import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_TG9wP8DXtRoSZF3VTxQYXHXtDfosCAE",
  authDomain: "tapgold-78143.firebaseapp.com",
  projectId: "tapgold-78143",
  storageBucket: "tapgold-78143.firebasestorage.app",
  messagingSenderId: "89078852556",
  appId: "1:89078852556:web:18e5e46e2394f116a1cb69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tg = window.Telegram.WebApp;
tg.expand();

let score = 0;
let energy = 100;
let power = 1;
const userId = tg.initDataUnsafe?.user?.id || "test_user_123";
const userRef = doc(db, "users", userId.toString());

// ডাটা লোড
async function loadData() {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
        score = snap.data().score || 0;
    } else {
        await setDoc(userRef, { score: 0 });
    }
    document.getElementById('score').innerText = score;
}

// ট্যাপ লজিক
document.getElementById('tap-btn').addEventListener('click', async () => {
    if (energy > 0) {
        score += power;
        energy -= 1;
        document.getElementById('score').innerText = score;
        document.getElementById('energy').innerText = energy;
        await updateDoc(userRef, { score: increment(power) });
    } else {
        alert("এনার্জি শেষ!");
    }
});

// বুস্ট লজিক
window.buyBoost = async () => {
    if (score >= 500) {
        score -= 500;
        power += 1;
        document.getElementById('score').innerText = score;
        await updateDoc(userRef, { score: score });
        alert("পাওয়ার বেড়েছে!");
    } else {
        alert("গোল্ড কম!");
    }
};

// এনার্জি রিফিল
setInterval(() => {
    if (energy < 100) {
        energy += 1;
        document.getElementById('energy').innerText = energy;
    }
}, 3000);

loadData();
