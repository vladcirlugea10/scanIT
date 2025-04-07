import easyocr
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Initialize EasyOCR reader (Romanian and English language support)
reader = easyocr.Reader(['ro', 'en'])

@app.route('/ocr', methods=['POST'])
def ocr_img():
    try:
        if 'image' not in request.files:
            print("No image file in request")
            return jsonify({'error': 'No image file uploaded'}), 400
            
        file = request.files['image']
        if not file:
            print("Empty file in request")
            return jsonify({'error': 'Empty file uploaded'}), 400

        img_path = './uploaded_img.jpg'
        file.save(img_path)

        # Perform OCR using EasyOCR
        result = reader.readtext(img_path)
        text_output = [entry[1] for entry in result]  # Extract detected text
        
        try:
            os.remove(img_path)  # Clean up the image file
        except Exception as e:
            print(f"Error deleting file: {str(e)}")
            
        return jsonify({'text': text_output}), 200
        
    except Exception as e:
        print(f"Error processing OCR request: {str(e)}")
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=False)
