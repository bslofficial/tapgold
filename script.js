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

// টেলিগ্রাম সেফ চেক
let userId = "test_user_123";
let username = "গেস্ট ইউজার";

try {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.expand();
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            userId = tg.initDataUnsafe.user.id.toString();
            username = tg.initDataUnsafe.user.first_name || tg.initDataUnsafe.user.username || "ইউজার";
        }
    }
} catch (e) {
    console.log("Telegram WebApp not detected, using default user.");
}

const userRef = doc(db, "users", userId);
let score = 0, energy = 100, power = 1;

async function initUser() {
    try {
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            await setDoc(userRef, { name: username, score: 0, power: 1, referrals: 0 });
        } else {
            const data = snap.data();
            score = data.score || 0;
            power = data.power || 1;
        }
    } catch (err) {
        console.error("DB Error:", err);
    }

    // UI আপডেট
    const nameEl = document.getElementById('username');
    const scoreEl = document.getElementById('score');
    const linkEl = document.getElementById('ref-link');

    if (nameEl) nameEl.innerText = username;
    if (scoreEl) scoreEl.innerText = score;
    if (linkEl) linkEl.value = `https://t.me/tapgold_2026_bot?start=${userId}`;
}

// ট্যাপ ইভেন্ট
const tapBtn = document.getElementById('tap-btn');
if (tapBtn) {
    tapBtn.addEventListener('click', async () => {
        if (energy > 0) {
            score += power; 
            energy -= 1;
            
            const scoreEl = document.getElementById('score');
            const energyEl = document.getElementById('energy');
            if (scoreEl) scoreEl.innerText = score;
            if (energyEl) energyEl.innerText = energy;

            try {
                await updateDoc(userRef, { score: increment(power) });
            } catch (e) {
                console.error("Update failed", e);
            }
        }
    });
}

window.buyBoost = async () => {
    if (score >= 500) {
        score -= 500; 
        power += 1;
        document.getElementById('score').innerText = score;
        await updateDoc(userRef, { score: score, power: power });
        alert("বুস্ট সফল হয়েছে!");
    } else {
        alert("পর্যাপ্ত গোল্ড নেই!");
    }
};

window.watchRewardAd = () => {
    if (typeof show_11274199 === 'function') {
        show_11274199().then(() => {
            score += 100;
            document.getElementById('score').innerText = score;
            updateDoc(userRef, { score: score });
            alert('১০০ গোল্ড পেয়েছেন!');
        }).catch(err => {
            alert('বিজ্ঞাপন দেখাতে সমস্যা হয়েছে।');
        });
    } else {
        alert('বিজ্ঞাপন লোড হয়নি, একটু পর চেষ্টা করুন।');
    }
};

window.copyRefLink = () => {
    const refLinkInput = document.getElementById('ref-link');
    if (refLinkInput) {
        refLinkInput.select();
        navigator.clipboard.writeText(refLinkInput.value);
        alert('রেফারেল লিংক কপি করা হয়েছে!');
    }
};

window.switchTab = (tab) => {
    document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
    const targetSection = document.getElementById(`${tab}-section`);
    if (targetSection) targetSection.classList.add('active');
    if (tab === 'leaderboard') loadLeaderboard();
};

async function loadLeaderboard() {
    const listEl = document.getElementById('leaderboard-list');
    if (!listEl) return;
    listEl.innerHTML = "<li>লোড হচ্ছে...</li>";
    try {
        const q = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
        const snapshot = await getDocs(q);
        listEl.innerHTML = "";
        snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            listEl.innerHTML += `<li># ${d.name || "ইউজার"} <span>${d.score || 0} গোল্ড</span></li>`;
        });
    } catch (err) {
        listEl.innerHTML = "<li>লিডারবোর্ড লোড করা যায়নি।</li>";
    }
}

initUser();

setInterval(() => { 
    if (energy < 100) {
        energy++; 
        const energyEl = document.getElementById('energy');
        if (energyEl) energyEl.innerText = energy; 
    } 
}, 3000);

// ফাংশনগুলোকে গ্লোবাল স্কোপে যুক্ত করা যাতে HTML এর onclick কাজ করে
window.buyBoost = buyBoost;
window.watchRewardAd = watchRewardAd;
window.copyRefLink = copyRefLink;
window.switchTab = switchTab;

