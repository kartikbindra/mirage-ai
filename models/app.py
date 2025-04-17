from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
import torchvision.transforms as T
from torchvision import transforms
from PIL import Image
import clip
import os
from io import BytesIO
from facenet_pytorch import InceptionResnetV1
from model import EmbeddingPoisoner

app = Flask(__name__)
CORS(app)

device = "cuda" if torch.cuda.is_available() else "cpu"
clip_model, preprocess_clip = clip.load("ViT-B/32", device=device)

normalize_clip = T.Normalize(mean=(0.4815, 0.4578, 0.4082), std=(0.2686, 0.2613, 0.2758))

def generate_cloak(image_pil, epsilon=0.003):
    transform = T.Compose([
        T.Resize((224, 224)),
        T.ToTensor(),
    ])
    image_tensor = transform(image_pil).unsqueeze(0).to(device)
    
    image_clip = image_tensor.clone().detach().requires_grad_(True)
    image_clip_norm = normalize_clip(image_clip)

    text_prompts = ["a painting of a cat", "an abstract landscape"]
    text_tokens = clip.tokenize(text_prompts).to(device)
    text_features = clip_model.encode_text(text_tokens).float()
    text_features = text_features.mean(dim=0, keepdim=True)
    text_features = text_features / text_features.norm(dim=-1, keepdim=True)

    # Original features
    original_image_features = clip_model.encode_image(image_clip_norm).float()
    original_image_features = original_image_features / original_image_features.norm(dim=-1, keepdim=True)
    original_similarity = torch.cosine_similarity(original_image_features, text_features).item()

    # Backpropagate CLIP loss
    clip_loss = -torch.cosine_similarity(original_image_features, text_features).mean()
    clip_loss.backward()

    perturbed = image_clip + epsilon * image_clip.grad.data.sign()
    perturbed = torch.clamp(perturbed, 0, 1)

    # Perturbed features
    perturbed_features = clip_model.encode_image(normalize_clip(perturbed)).float()
    perturbed_features = perturbed_features / perturbed_features.norm(dim=-1, keepdim=True)
    perturbed_similarity = torch.cosine_similarity(perturbed_features, original_image_features).item()

    # Convert to PIL
    output_img = T.ToPILImage()(perturbed.squeeze().detach().cpu())

    return output_img, original_similarity, perturbed_similarity

@app.route("/cloak", methods=["POST"])
def cloak():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    image = Image.open(file.stream).convert("RGB")

    result_img, sim_orig, sim_pert = generate_cloak(image)
    print("Original Cosine Similarity:", sim_orig)
    
    # Save the cloaked image to a temporary file
    cloaked_image_path = 'cloaked_image_output.jpg'
    result_img.save(cloaked_image_path)

        # Return the cosine similarity scores and the cloaked image
    return jsonify({
        'original_cosine_similarity': sim_orig,
        'perturbed_cosine_similarity': sim_pert,
        'cloaked_image_url': cloaked_image_path
    }), 200

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_file(filename, as_attachment=True)

facenet = InceptionResnetV1(pretrained='vggface2').eval().to(device)

# Load poisoner
poisoner = EmbeddingPoisoner(facenet, epsilon=0.01).to(device)

# Transform
transform = transforms.Compose([
    transforms.Resize((160, 160)),
    transforms.ToTensor()
])

@app.route('/face-cloak', methods=['POST'])
def face_cloak():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']
    image = Image.open(file.stream).convert("RGB")
    original_image_size = image.size
    print("Original Image Size:", original_image_size)
    image_tensor = transform(image).unsqueeze(0).to(device)

    # Get original and cloaked embeddings
    with torch.no_grad():
        original_emb = facenet(image_tensor)

    cloaked_tensor = poisoner(image_tensor)

    with torch.no_grad():
        cloaked_emb = facenet(cloaked_tensor)

    # Calculate similarity
    cos = torch.nn.CosineSimilarity(dim=1)
    similarity = cos(original_emb, cloaked_emb).item()
    delta_norm = torch.norm(cloaked_emb - original_emb).item()

    # Convert back to image
    cloaked_img = transforms.ToPILImage()(cloaked_tensor.squeeze().cpu())

    # Resize cloaked image to original size
    cloaked_img = cloaked_img.resize(original_image_size, Image.LANCZOS)
    # Prepare image for return
    face_cloak_image_path = 'face_cloak_output.jpg'
    cloaked_img.save(face_cloak_image_path)
    return jsonify({
        'cosine_similarity': similarity,
        'delta_norm': delta_norm,
        'cloaked_image_url': face_cloak_image_path
    }), 200

if __name__ == "__main__":
    app.run(debug=True, port = 8080)
