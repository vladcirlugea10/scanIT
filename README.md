📱 scanIT
    scanIT is a React Native mobile application that allows users to scan barcodes or take pictures of product labels. It checks for allergens and unhealthy ingredients using a database and provides relevant information about the scanned product.

🚀 Features
    📷 Barcode Scanning – Scan product barcodes to fetch details from OpenFoodFacts API.
    🔍 OCR Text Extraction – Extract ingredients from images using PaddleOCR.
    ⚡ Ingredient Analysis – Check for allergens or unhealthy ingredients.
    📊 Database Integration – Store allergen information and user preferences.
    🌍 Cross-Platform Support – Works on both Android and iOS.

🛠️ Tech Stack
    Frontend: React Native (Expo)
    Backend: Node.js
    Database: SQLite - for local DB
              MongoDB - for cloud DB
    APIs: OpenFoodFacts, PaddleOCR

📦 Installation
    1️⃣ Clone the Repository
        git clone https://github.com/vladcirlugea10/scanIT.git
        cd scanIT
    2️⃣ Install Dependencies
        npm install
    3️⃣ Start the Development Server
        npx expo start - frontend
        npm run dev - backend
        py paddleOCR.py - for OCR script
        
📸 Usage
    Choose a Mode: Select either "Barcode" or "Photo" mode.
    Scan code or Capture image:
      In Barcode Mode, scan a barcode to fetch product details.
      In Photo Mode, take a picture of the product label for OCR processing.
      View Results: The app displays ingredient analysis and allergen warnings.
      OCR Accuracy: PaddleOCR may struggle with certain fonts and lighting conditions.
