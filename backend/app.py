from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("STABILITY_API_KEY")
print("API_KEY LOADED:", API_KEY)
HEADERS = {
    "Authorization": f"Bearer {API_KEY}",
    "Accept": "image/*"
}
@app.route('/inpaint', methods=['POST'])
def inpaint_image():
    image = request.files['image']
    mask = request.files['mask']
    prompt = request.form['prompt']

    files = {
        'image': (image.filename, image.stream, image.mimetype),
        'mask': (mask.filename, mask.stream, mask.mimetype)
    }
    data = {'prompt': prompt, 'mode': 'masking', 'model': 'stable-inpainting-512-v2-0'}

    response = requests.post(
        'https://api.stability.ai/v2beta/stable-image/edit/inpaint',
        headers=HEADERS,
        files=files,
        data=data
    )

    # 👉 Affiche la vraie erreur si 400
    if response.status_code != 200:
        print("----- STABILITY AI RESPONSE -----")
        print("Status code:", response.status_code)
        print("Text:", response.text)
        return jsonify({"error": response.text}), response.status_code

    # Sinon retourne l'image
    return response.content, 200, {'Content-Type': 'image/png'}

if __name__ == "__main__":
    app.run(debug=True)
