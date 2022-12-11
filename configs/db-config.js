const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
const { getFirestore, collection } = require('firebase/firestore');
const { ref } = require('firebase/storage');

// Initialize firebase admin SDK

exports.DBConfig = {
    apiKey: "AIzaSyAMb4pQMrYP5QgV_Rgb-Fn6fFaOsk-Ain4",
    authDomain: "thehomeverse-io.firebaseapp.com",
    projectId: "thehomeverse-io",
    storageBucket: "thehomeverse-io.appspot.com",
    messagingSenderId: "835228193883",
    appId: "1:835228193883:web:472f427b63874742d31b7e",
    measurementId: "G-DXDCFV7CMS"
};


const firebaseApp = initializeApp(this.DBConfig);

exports.storage = getStorage(firebaseApp);
exports.db = getFirestore(firebaseApp);

exports.userCollection = collection(this.db,"user_info");
exports.msgCollection = collection(this.db,"messages");
exports.dataCollection = collection(this.db,"video_data");
exports.blogCollection = collection(this.db,"video_blogs");


exports.posterImageRef = (id) => {
    return ref(this.storage, `poster-images/${id}.jpg`);
} 

exports.videoRef = (id) => {
    return ref(this.storage, `videos/${id}.mp4`);
} 