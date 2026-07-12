import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ফায়ারবেস কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyC_TG9wP8DXtRoSZF3VTxQYXHXtDfosCAE",
  authDomain: "tapgold-78143.firebaseapp.com",
  projectId: "tapgold-78143",
  storageBucket: "tapgold-78143.firebasestorage.app",
  messagingSenderId: "89078852556",
  appId: "1:89078852556:web:18e5e46e2394f116a1cb69",
  measurementId: "G-ZQK8M0VX3C"
};

// ফায়ারবেস ইনিশিয়ালাইজেশন
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// টেলিগ্রাম ওয়েব অ্যাপ ইনিশিয়ালাইজেশন
const tg = window.Telegram.WebApp;
tg.expand();

let score = 0;
const scoreDisplay = document.getElementById('score');
const tapBtn = document.getElementById('tap-btn');

// ফায়ারস্টোর থেকে ইউজারের ডাটা লোড করা
async function loadUserScore(userId) {
    const userRef = doc(db, "users", userId.toString());
    try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            score = userSnap.data().score || 0;
            scoreDisplay.innerText = score;
        } else {
            await setDoc(userRef, { score: 0 });
            score = 0;
            scoreDisplay.innerText = score;
        }
    } catch (error) {
        console.error("ডেটা লোড করতে সমস্যা হয়েছে: ", error);
    }
}

// টেলিগ্রাম ইউজার আইডি যাচাই করে ডেটা ফেচ করা
if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const userId = tg.initDataUnsafe.user.id;
    loadUserScore(userId);
} else {
    // টেলিগ্রাম ছাড়া সাধারণ ব্রাউজারে টেস্ট করার জন্য ফলব্যাক আইডি
    loadUserScore("test_user_123");
}

// ট্যাপ বাটন ক্লিক ইভেন্ট
tapBtn.addEventListener('click', async () => {
    score++;
    scoreDisplay.innerText = score;

    let userId = "test_user_123";
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        userId = tg.initDataUnsafe.user.id.toString();
    }

    const userRef = doc(db, "users", userId);
    try {
        await updateDoc(userRef, {
            score: increment(1)
        });
    } catch (error) {
        // যদি ডকুমেন্ট না থাকে তবে তৈরি করে নেওয়া
        await setDoc(userRef, { score: score }, { merge: true });
    }
});
