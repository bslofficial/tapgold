import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment, collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC_TG9wP8DXtRoSZF3VTxQYXHXtDfosCAE",
  projectId: "tapgold-78143",
  // ... অন্যান্য কনফিগ ঠিক রাখুন
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe?.user;
const userId = user?.id ? user.id.toString() : "test_user_123";
const username = user?.first_name || "গেস্ট ইউজার";
const userRef = doc(db, "users", userId);

let score = 0, energy = 100, power = 1;

async function initUser() {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        await setDoc(userRef, { name: username, score: 0, power: 1, referrals: 0 });
    } else {
        const data = snap.data();
        score = data.score || 0;
        power = data.power || 1;
    }
    document.getElementById('username').innerText = username;
    document.getElementById('score').innerText = score;
    document.getElementById('ref-link').value = `https://t.me/tapgold_2026_bot?start=${userId}`;
}

document.getElementById('tap-btn').addEventListener('click', async () => {
    if (energy > 0) {
        score += power; energy -= 1;
        document.getElementById('score').innerText = score;
        document.getElementById('energy').innerText = energy;
        await updateDoc(userRef, { score: increment(power) });
    }
});

window.watchRewardAd = () => {
    show_11274199().then(() => {
        score += 100;
        document.getElementById('score').innerText = score;
        updateDoc(userRef, { score: score });
        alert('১০০ গোল্ড পেয়েছেন!');
    });
};

window.loadLeaderboard = async () => {
    const listEl = document.getElementById('leaderboard-list');
    listEl.innerHTML = "";
    const q = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
        const d = doc.data();
        listEl.innerHTML += `<li># ${d.name || "ইউজার"} <span>${d.score} গোল্ড</span></li>`;
    });
};

window.switchTab = (tab) => {
    document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
    document.getElementById(`${tab}-section`).classList.add('active');
    if(tab === 'leaderboard') loadLeaderboard();
};

initUser();
setInterval(() => { if (energy < 100) energy++; document.getElementById('energy').innerText = energy; }, 3000);
