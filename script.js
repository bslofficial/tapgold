// রেফারেল ট্র্যাকিং লজিক
const urlParams = new URLSearchParams(window.location.search);
const referrerId = urlParams.get('start'); // টেলিগ্রাম লিংক থেকে রেফারার আইডি পাওয়া যাবে

async function initUser() {
    try {
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            // নতুন ইউজার এবং রেফারেল হলে
            await setDoc(userRef, { 
                name: username, 
                score: 0, 
                power: 1, 
                referredBy: referrerId || null 
            });
            
            // যদি রেফারেল থাকে, তবে রেফারারের গোল্ড বাড়িয়ে দেওয়া
            if (referrerId) {
                const referrerRef = doc(db, "users", referrerId);
                await updateDoc(referrerRef, { score: increment(100) }); // রেফার বোনাস ১০০
            }
            score = 0;
            power = 1;
        } else {
            const data = snap.data();
            score = data.score || 0;
            power = data.power || 1;
        }
        document.getElementById('username').innerText = username;
        document.getElementById('score').innerText = score;
    } catch (err) {
        console.error("ইনিট ডাটা লোডে সমস্যা:", err);
    }
}

// বুস্ট ফাংশন (আগে যেটা দিয়েছিলাম)
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
