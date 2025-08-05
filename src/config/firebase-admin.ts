import admin from 'firebase-admin';

if (!process.env.FIREBASE_CONFIG) {
  console.error('.env에 FIREBASE_CONFIG 내용 없음');
  process.exit(1);
}

let serviceAccount;

try {
  serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

  // 줄바꿈 복원
  if (typeof serviceAccount.private_key === 'string') {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }
} catch (error) {
  console.error('FIREBASE_CONFIG 파싱 실패:', error);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://codeit-beginner-project.firebasestorage.app',
  });
}

const bucket = admin.storage().bucket();
export default bucket;
