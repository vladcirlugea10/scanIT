from paddleocr import PaddleOCR
from flask import Flask, request, jsonify

app = Flask(__name__)
ocr = PaddleOCR(use_angle_cls=True, det=False, lang="ro")

@app.route('/ocr', methods=['POST'])
def ocr_img():
    file = request.files['image']
    if not file:
        print("No file in request")
        return jsonify({'error': 'No file uploaded'}), 400

    img_path = './uploaded_img.jpg'
    file.save(img_path)

    result = ocr.ocr(img_path, cls=True)
    text_output = [line[1][0] for line in result[0]]

    return jsonify({'text': text_output}), 200


if __name__ == '__main__':
    app.run(host = "0.0.0.0", port = 5001)