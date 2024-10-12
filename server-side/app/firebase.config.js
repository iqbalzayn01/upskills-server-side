const dotenv = require('dotenv');
dotenv.config();

const admin = require('firebase-admin');
const credentials = require('../credentials.json');
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(credentials),
});

module.exports = {
  storage,
  admin,
};
