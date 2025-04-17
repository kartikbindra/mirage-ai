import React, { useState } from "react";
import axios from "axios";

function ArtCloack() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalSimilarity, setOriginalSimilarity] = useState(null);
  const [perturbedSimilarity, setPerturbedSimilarity] = useState(null);
  const [cloakedImageUrl, setCloakedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file input
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Submit image to Flask backend
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    setLoading(true);
    setError(null);

    try {
      console.log("Sending request to backend...");
      const response = await axios.post(
        "http://127.0.0.1:8080/cloak",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const {
        original_cosine_similarity,
        perturbed_cosine_similarity,
        cloaked_image_url,
      } = response.data;
      setOriginalSimilarity(original_cosine_similarity);
      setPerturbedSimilarity(perturbed_cosine_similarity);
      setCloakedImageUrl(cloaked_image_url);
    } catch (err) {
      setError("Error processing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Mirage-AI: Image Cloaking</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload Image"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {originalSimilarity !== null && (
        <div>
          <h2>Cosine Similarity Scores</h2>
          <p>
            <strong>Original Image:</strong> {originalSimilarity}
          </p>
          <p>
            <strong>Perturbed Image:</strong> {perturbedSimilarity}
          </p>
        </div>
      )}

      {cloakedImageUrl && (
        <div>
          <img src={cloakedImageUrl} alt="Cloaked" />
        </div>
      )}
    </div>
  );
}

export default ArtCloack;
