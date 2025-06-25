import React, { useState } from "react";
import axios from "axios";

function InpaintForm() {
  const [image, setImage] = useState(null);
  const [mask, setMask] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [resultImageUrl, setResultImageUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("mask", mask);
    formData.append("prompt", prompt);

    try {
      const res = await axios.post("http://localhost:5000/inpaint", formData, {
        responseType: "blob", // pour récupérer une image
      });
      const imageBlob = res.data;
      const imageUrl = URL.createObjectURL(imageBlob);
      setResultImageUrl(imageUrl);
    } catch (err) {
      alert("Erreur lors de l'envoi : " + err.message);
    }
  };

  return (
    <div>
      <h2>Inpaint Image</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
        <input type="file" accept="image/*" onChange={(e) => setMask(e.target.files[0])} required />
        <input
          type="text"
          placeholder="Enter your prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <button type="submit">Inpaint</button>
      </form>

      {resultImageUrl && (
        <div>
          <h3>Résultat :</h3>
          <img src={resultImageUrl} alt="Résultat Inpaint" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default InpaintForm;
