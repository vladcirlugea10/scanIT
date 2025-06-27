[🔗 Repository GitHub](https://github.com/vladcirlugea10/scanIT)

# 📱 scanIT
scanIT este o aplicație mobilă React Native care permite utilizatorilor să scaneze coduri de bare sau să facă poze ale etichetelor de produse. Verifică alergenii și ingredientele nesănătoase folosind o bază de date și oferă informații relevante despre produsul scanat.

## 🚀 Funcționalități
- 📷 **Scanare Coduri de Bare** – Scanează codurile de bare ale produselor pentru a obține detalii din API-ul OpenFoodFacts.
- 🔍 **Extragerea Textului OCR** – Extrage ingredientele din imagini folosind EasyOCR.
- ⚡ **Analiza Ingredientelor** – Verifică alergenii sau ingredientele nesănătoase.
- 📊 **Integrare Bază de Date** – Stochează informațiile despre alergeni și preferințele utilizatorilor.

## 🛠️ Stack Tehnologic
- **Frontend**: React Native (Expo)
- **Backend**: Node.js
- **Baza de Date**: 
  - SQLite – pentru baza de date locală
  - MongoDB – pentru baza de date în cloud
- **API-uri**: OpenFoodFacts, Google Gemini, EasyOCR, Libretranslate

## 📦 Instalare
1️⃣ **Clonează Repository-ul**
  - `git clone https://github.com/vladcirlugea10/scanIT.git`

2️⃣ **Instalează Dependențele**
  - `cd scanIT-backend`
  - `npm install`
  - `cd scanIT-frontend`
  - `npx expo install`

3️⃣ **Pornește Serverul de Dezvoltare**
  - `npx expo start` – frontend
  - `npm run dev` – backend
  - `python paddleOCR.py` – pentru procesarea OCR cu easyOCR si traducere cu Libretranslate

## 📸 Utilizare
- **Alege un Mod**: Selectează fie modul "Cod de Bare", fie modul "Fotografie".
- **Scanează Codul sau Capturează Imaginea**:
  - În Modul Cod de Bare, scanează un cod de bare pentru a obține detaliile produsului.
  - În Modul Fotografie, fă o poză etichetei produsului pentru procesarea OCR.
- **Vizualizează Rezultatele**: Aplicația afișează analiza ingredientelor și avertismentele despre alergeni.
- **Acuratețea OCR**: EasyOCR gestionează bine mai multe tipuri de fonturi, dar poate fi încă afectat de calitatea slabă a imaginii sau de iluminare.