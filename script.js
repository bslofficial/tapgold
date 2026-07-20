import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const user = tg.initDataUnsafe?.user;
const userId = user?.id ? user.id.toString() : "test_user_123";
const username = user?.first_name || user?.username || "ইউজার";
const userRef = doc(db, "users", userId);

let score = 0, energy = 100, power = 1;

const urlParams = new URLSearchParams(window.location.search);
const referrerId = urlParams.get('start'); 

async function initUser() {
    try {
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            await setDoc(userRef, { name: username, score: 0, power: 1, referredBy: referrerId || null });
            if (referrerId) {
                const referrerRef = doc(db, "users", referrerId);
                await updateDoc(referrerRef, { score: increment(100) });
            }
            score = 0; power = 1;
        } else {
            const data = snap.data();
            score = data.score || 0;
            power = data.power || 1;
        }
        document.getElementById('username').innerText = username;
        document.getElementById('score').innerText = score;
        document.getElementById('ref-link').value = `https://t.me/tapgold_2026_bot?start=${userId}`;
    } catch (err) { console.error(err); }
}

document.getElementById('tap-btn').addEventListener('click', async () => {
    if (energy > 0) {
        score += power; energy -= 1;
        document.getElementById('score').innerText = score;
        document.getElementById('energy').innerText = energy;
        await updateDoc(userRef, { score: increment(power) });
    }
});

window.buyBoost = async () => {
    if (score >= 500) {
        score -= 500; power += 1;
        document.getElementById('score').innerText = score;
        await updateDoc(userRef, { score: score, power: power });
        alert("বুস্ট সফল!");
    } else { alert("পর্যাপ্ত গোল্ড নেই!"); }
};

window.watchRewardAd = () => {
    if (typeof show_11274199 === 'function') {
        show_11274199().then(() => {
            score += 100;
            document.getElementById('score').innerText = score;
            updateDoc(userRef, { score: score });
        });
    } else { alert("বিজ্ঞাপন লোড হচ্ছে..."); }
};

window.switchTab = (tab) => {
    document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
    document.getElementById(`${tab}-section`).classList.add('active');
    if (tab === 'leaderboard') loadLeaderboard();
};

window.loadLeaderboard = async () => {
    const listEl = document.getElementById('leaderboard-list');
    const snapshot = await getDocs(query(collection(db, "users"), orderBy("score", "desc"), limit(10)));
    listEl.innerHTML = "";
    snapshot.forEach(docSnap => {
        const d = docSnap.data();
        listEl.innerHTML += `<li>${d.name} - ${d.score} গোল্ড</li>`;
    });
};

window.copyRefLink = () => {
    navigator.clipboard.writeText(document.getElementById('ref-link').value);
    alert("লিংক কপি হয়েছে!");
};

initUser();
setInterval(() => { if (energy < 100) { energy++; document.getElementById('energy').innerText = energy; } }, 3000);
