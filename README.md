[🔗 GitHub Repository](https://github.com/vladcirlugea10/scanIT)

# 📱 scanIT
scanIT is a React Native mobile application that allows users to scan barcodes or take pictures of product labels. It checks for allergens and unhealthy ingredients using a database and provides relevant information about the scanned product.

## 🚀 Features
- 📷 **Barcode Scanning** – Scan product barcodes to fetch details from OpenFoodFacts API.
- 🔍 **OCR Text Extraction** – Extract ingredients from images using EasyOCR.
- ⚡ **Ingredient Analysis** – Check for allergens or unhealthy ingredients.
- 📊 **Database Integration** – Store allergen information and user preferences.

## 🛠️ Tech Stack
- **Frontend**: React Native (Expo)
- **Backend**: Node.js
- **Database**: 
  - SQLite – for local DB
  - MongoDB – for cloud DB
- **APIs**: OpenFoodFacts, Google Gemini, EasyOCR, Libretranslate

## 📦 Installation
1️⃣ **Clone the Repository**
  - `git clone https://github.com/vladcirlugea10/scanIT.git`

2️⃣ **Install Dependencies**
  - `cd scanIT-backend`
  - `npm install`
  - `cd scanIT-frontend`
  - `npx expo install`

3️⃣ **Start the Development Server**
  - `npx expo start` – frontend
  - `npm run dev` – backend
  - `python paddleOCR.py` – for OCR processing

## 📸 Usage
- **Choose a Mode**: Select either "Barcode" or "Photo" mode.
- **Scan Code or Capture Image**:
  - In Barcode Mode, scan a barcode to fetch product details.
  - In Photo Mode, take a picture of the product label for OCR processing.
- **View Results**: The app displays ingredient analysis and allergen warnings.
- **OCR Accuracy**: EasyOCR handles multiple fonts well but may still be affected by poor image quality or lighting.

