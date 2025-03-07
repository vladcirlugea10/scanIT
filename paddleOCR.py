from paddleocr import PaddleOCR
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

ocr = PaddleOCR(use_angle_cls=True, det=False, lang="ro")

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

        result = ocr.ocr(img_path, cls=True)
        text_output = []
        
        if result and result[0]:
            for line in result[0]:
                words = line[1][0].split()
                text_output.extend(words)
        
        try:
            os.remove(img_path)
        except:
            pass
            
        return jsonify({'text': text_output}), 200
        
    except Exception as e:
        print(f"Error processing OCR request: {str(e)}")
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=False)