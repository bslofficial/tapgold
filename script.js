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
// টেলিগ্রাম থেকে ইউজারের নাম নিশ্চিত করা, না থাকলে 'ইউজার' দেখাবে
const username = user?.first_name || user?.username || "ইউজার";
const userRef = doc(db, "users", userId);

let score = 0, energy = 100, power = 1;

async function initUser() {
    try {
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            // নতুন ইউজার হলে নামসহ ডেটা তৈরি হবে
            await setDoc(userRef, { 
                name: username, 
                score: 0, 
                power: 1, 
                referrals: 0 
            });
            score = 0;
            power = 1;
        } else {
            const data = snap.data();
            score = data.score || 0;
            power = data.power || 1;
            
            // যদি ডেটাবেসে নাম সেভ করা না থাকে বা undefined হয়, তবে আপডেট করে দেওয়া
            if (!data.name || data.name === "undefined") {
                await updateDoc(userRef, { name: username });
            }
        }
        document.getElementById('username').innerText = username;
        document.getElementById('score').innerText = score;
        document.getElementById('ref-link').value = `https://t.me/tapgold_2026_bot?start=${userId}`;
    } catch (err) {
        console.error("ইনিট ডাটা লোডে সমস্যা:", err);
    }
}

document.getElementById('tap-btn').addEventListener('click', async () => {
    if (energy > 0) {
        score += power; 
        energy -= 1;
        document.getElementById('score').innerText = score;
        document.getElementById('energy').innerText = energy;
        await updateDoc(userRef, { score: increment(power), name: username });
    }
});

window.watchRewardAd = () => {
    if (typeof show_11274199 === 'function') {
        show_11274199().then(() => {
            score += 100;
            document.getElementById('score').innerText = score;
            updateDoc(userRef, { score: score });
            alert('১০০ গোল্ড পেয়েছেন!');
        }).catch(e => {
            console.log("বিজ্ঞাপন প্রদর্শনে সমস্যা হয়েছে");
        });
    } else {
        alert("বিজ্ঞাপন লোড হচ্ছে, একটু পরে চেষ্টা করুন।");
    }
};

window.loadLeaderboard = async () => {
    const listEl = document.getElementById('leaderboard-list');
    listEl.innerHTML = "<li>লোড হচ্ছে...</li>";
    try {
        const q = query(collection(db, "users"), orderBy("score", "desc"), limit(10));
        const snapshot = await getDocs(q);
        listEl.innerHTML = "";
        let rank = 1;
        snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            const displayName = d.name && d.name !== "undefined" ? d.name : "ইউজার";
            listEl.innerHTML += `<li>#${rank} ${displayName} <span>${d.score || 0} গোল্ড</span></li>`;
            rank++;
        });
    } catch (e) {
        listEl.innerHTML = "<li>লিডারবোর্ড লোড করতে সমস্যা হয়েছে।</li>";
    }
};

window.switchTab = (tab) => {
    document.querySelectorAll('.section').forEach(e => e.classList.remove('active'));
    document.getElementById(`${tab}-section`).classList.add('active');
    if (tab === 'leaderboard') loadLeaderboard();
};

window.copyRefLink = () => {
    const linkInput = document.getElementById('ref-link');
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value);
    alert("রেফারেল লিংক কপি হয়েছে!");
};

initUser();
setInterval(() => { 
    if (energy < 100) {
        energy++; 
        document.getElementById('energy').innerText = energy; 
    }
}, 3000);
