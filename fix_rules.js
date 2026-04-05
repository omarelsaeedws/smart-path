import fs from 'fs';

// المحتوى النظيف تمامًا للقواعد
const content = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

try {
  // كتابة الملف بصيغة UTF-8 نقية
  fs.writeFileSync('firestore.rules', content, { encoding: 'utf8' });
  console.log("✅ Great! firestore.rules has been recreated cleanly.");
} catch (e) {
  console.error("❌ Error:", e);
}