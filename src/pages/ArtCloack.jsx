import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FaceCloak = () => {
  const [preview, setPreview] = useState(null);
  const [responseImage, setResponseImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [similarityScore, setSimilarityScore] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post("http://127.0.0.1:8080/cloak", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const {
        original_cosine_similarity,
        perturbed_cosine_similarity,
        cloaked_image_url,
      } = res.data;
      console.log(res.data);
      console.log(perturbed_cosine_similarity);
      setResponseImage(cloaked_image_url);
      setSimilarityScore(perturbed_cosine_similarity);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-semibold mb-4">Face Cloak – Drag & Drop</h1>

      <div
        {...getRootProps()}
        className={`w-96 h-48 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer mb-4 ${
          isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag & drop an image here, or click to select</p>
        )}
      </div>

      {preview && (
        <div className="flex flex-col items-center mb-4">
          <p className="mb-2 font-medium">Original Image</p>
          <img
            src={preview}
            alt="Preview"
            className="w-64 rounded-md shadow-md"
          />
        </div>
      )}

      {loading && <p>Processing...</p>}
      {similarityScore && (
        <p className="mt-2 text-sm text-gray-500">
          Similarity Score: {similarityScore.toFixed(4)}
        </p>
      )}

      {responseImage && (
        <div className="flex flex-col items-center mt-6">
          <p className="mb-2 font-medium">Cloaked Image</p>
          <img
            src={responseImage}
            alt="Cloaked"
            className="w-64 rounded-md shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

export default FaceCloak;
