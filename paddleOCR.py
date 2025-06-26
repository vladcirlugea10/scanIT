import easyocr
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import requests

app = Flask(__name__)
CORS(app)

reader = easyocr.Reader(['ro', 'en'])

@app.route('/ocr', methods=['POST'])
def ocr_img():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file uploaded'}), 400
            
        file = request.files['image']
        if not file:
            return jsonify({'error': 'Empty file uploaded'}), 400

        img_path = './uploaded_img.jpg'
        file.save(img_path)

        # Perform OCR using EasyOCR
        result = reader.readtext(img_path)
        text_output = [entry[1] for entry in result]
        
        try:
            os.remove(img_path)
        except Exception as e:
            print(f"Error deleting file: {str(e)}")
            
        return jsonify({'text': text_output}), 200
        
    except Exception as e:
        return jsonify({'error': f'Error processing image: {str(e)}'}), 500

# Translation
@app.route('/detect', methods=['POST'])
def detect_language():
    try:
        data = request.json
        text = data.get('text')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        response = requests.post("http://127.0.0.1:5000/detect", json={"q": text})
        
        if response.status_code != 200:
            return jsonify({'error': f'Translation service error: {response.status_code}'}), 500
            
        detected = response.json()
        
        if not detected:
            return jsonify({'error': 'No language detected'}), 400
        
        language = detected[0]['language']
        return jsonify({'language': language}), 200
    
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'Translation service unavailable'}), 503
    except Exception as e:
        return jsonify({'error': f'Error detecting language: {str(e)}'}), 500

@app.route('/translate', methods=['POST'])
def translate_text():
    try:
        data = request.json
        text = data.get('text')
        target = data.get('target', 'en')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # detect language
        detect_response = requests.post("http://127.0.0.1:5000/detect", json={"q": text})
        
        if detect_response.status_code != 200:
            return jsonify({'error': f'Language detection service error: {detect_response.status_code}'}), 500
            
        detected = detect_response.json()
        
        if not detected:
            return jsonify({'error': 'No language detected'}), 400
        
        source_lang = detected[0]['language']

        # Translate text
        translate_payload = {
            "q": text,
            "source": source_lang,
            "target": target,
            "format": "text"
        }
        
        translate_response = requests.post("http://127.0.0.1:5000/translate", json=translate_payload)
        
        if translate_response.status_code != 200:
            return jsonify({'error': f'Translation service error: {translate_response.status_code}'}), 500
            
        translation_result = translate_response.json()

        response_data = {
            "translatedText": translation_result.get('translatedText'),
            "translated_text": translation_result.get('translatedText'),
            "detected_source": source_lang,
        }
        return jsonify(response_data), 200
    
    except requests.exceptions.ConnectionError:
        return jsonify({'error': 'Translation service unavailable'}), 503
    except Exception as e:
        return jsonify({'error': f'Error translating text: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5001, debug=True)