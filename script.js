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
const username = user?.first_name || "গেস্ট ইউজার";

const userRef = doc(db, "users", userId);

let score = 0;
let energy = 100;
let power = 1;
let refCount = 0;

// ১. সাইনআপ ও ডাটা লোড
async function initUser() {
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
        await setDoc(userRef, {
            userId: userId,
            name: username,
            score: 0,
            energy: 100,
            power: 1,
            referrals: 0,
            level: 1,
            joinedAt: new Date().toISOString()
        });
        score = 0;
    } else {
        score = snap.data().score || 0;
        refCount = snap.data().referrals || 0;
        power = snap.data().power || 1;
    }
    
    document.getElementById('username').innerText = username;
    document.getElementById('score').innerText = score;
    document.getElementById('ref-count').innerText = refCount;
    document.getElementById('ref-link').value = `https://t.me/tapgold_2026_bot?start=${userId}`;
    
    loadLeaderboard();
}

// ২. ট্যাপ লজিক
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

// ৩. বুস্ট লজিক
window.buyBoost = async () => {
    if (score >= 500) {
        score -= 500;
        power += 1;
        document.getElementById('score').innerText = score;
        await updateDoc(userRef, { score: score, power: power });
        alert("পাওয়ার লেভেল বেড়েছে!");
    } else {
        alert("পয়েন্ট কম (৫০০ গোল্ড লাগবে)!");
    }
};

// ৪. রিওয়ার্ডড অ্যাড লজিক (বিজ্ঞাপন দেখলে ১০০ গোল্ড বোনাস)
window.watchRewardAd = () => {
    if (typeof show_11274199 === 'function') {
        show_11274199().then(() => {
            score += 100;
            document.getElementById('score').innerText = score;
            updateDoc(userRef, { score: score });
            alert('অভিনন্দন! বিজ্ঞাপন দেখার জন্য ১০০ গোল্ড পেয়েছেন।');
        }).catch(e => {
            console.log("বিজ্ঞাপন লোড হয়নি বা ক্লোজ করা হয়েছে");
        });
    } else {
        alert("বিজ্ঞাপন লোড হচ্ছে, একটু পরে আবার চেষ্টা করুন।");
    }
};

// ৫. লিডারবোর্ড লোড করা
async function loadLeaderboard() {
    const listEl = document.getElementById('leaderboard-list');
    listEl.innerHTML = "";
    try {
        const q = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        let rank = 1;
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            listEl.innerHTML += `<li><span>#${rank} ${data.name}</span> <b>${data.score} গোল্ড</b></li>`;
            rank++;
        });
    } catch (e) {
        listEl.innerHTML = "<li>লিডারবোর্ড লোড করতে সমস্যা হয়েছে।</li>";
    }
};

// ৬. ট্যাব পরিবর্তন ফাংশন
window.switchTab = (tabName) => {
    document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
    document.getElementById(`${tabName}-section`).classList.add('active');
    if(tabName === 'leaderboard') loadLeaderboard();
};

// ৭. রেফারেল লিংক কপি
window.copyRefLink = () => {
    const linkInput = document.getElementById('ref-link');
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value);
    alert("রেফারেল লিংক কপি হয়েছে!");
};

// এনার্জি রিফিল
setInterval(() => {
    if (energy < 100) {
        energy += 1;
        document.getElementById('energy').innerText = energy;
    }
}, 3000);

initUser();
