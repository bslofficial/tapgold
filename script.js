// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_TG9wP8DXtRoSZF3VTxQYXHXtDfosCAE",
  authDomain: "tapgold-78143.firebaseapp.com",
  projectId: "tapgold-78143",
  storageBucket: "tapgold-78143.firebasestorage.app",
  messagingSenderId: "89078852556",
  appId: "1:89078852556:web:18e5e46e2394f116a1cb69",
  measurementId: "G-ZQK8M0VX3C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Firestore ইনিশিয়ালাইজ করা হলো

// টেলিগ্রাম ওয়েব অ্যাপ ইনিশিয়ালাইজেশন
const tg = window.Telegram.WebApp;
tg.expand();

let score = 0;
const scoreDisplay = document.getElementById('score');
const tapBtn = document.getElementById('tap-btn');

// ইউজারের বর্তমান স্কোর ফায়ারস্টোর থেকে লোড করা (যদি থাকে)
async function loadUserScore(userId) {
    const userRef = doc(db, "users", userId.toString());
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
        score = userSnap.data().score || 0;
        scoreDisplay.innerText = score;
    } else {
        // নতুন ইউজার হলে ডাটাবেসে এন্ট্রি তৈরি করা
        await setDoc(userRef, { score: 0 });
    }
}

// টেলিগ্রাম থেকে ইউজার আইডি নিয়ে ডাটা লোড করা
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const userId = tg.initDataUnsafe.user.id;
    loadUserScore(userId);
}

// ট্যাপ করার ফাংশন
tapBtn.addEventListener('click', async () => {
    score++;
    scoreDisplay.innerText = score;
    
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const userId = tg.initDataUnsafe.user.id.toString();
        const userRef = doc(db, "users", userId);
        
        try {
            // রিয়েল-টাইমে ডাটাবেসে পয়েন্ট আপডেট করা
            await updateDoc(userRef, {
                score: increment(1)
            });
        } catch (error) {
            // যদি ডকুমেন্ট আগে না থাকে, তবে সেট করে দেওয়া
            await setDoc(userRef, { score: score }, { merge: true });
        }
    }
});
