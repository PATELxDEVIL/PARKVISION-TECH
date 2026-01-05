// 🔥 Firebase Config (YOUR REAL DATA)
const firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvision-tech",
  storageBucket: "parkvision-tech.appspot.com",
  messagingSenderId: "259137051604",
  appId: "1:259137051604:web:95d40b5e5d839009d21441"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔁 Convert seconds → MM:SS
function formatMMSS(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// 🔥 Live listener
db.ref("parking").on("value", snapshot => {
  const data = snapshot.val();
  document.getElementById("carCount").innerText = data.carCount;

  Object.keys(data.slots).forEach(slot => {
    const slotData = data.slots[slot];

    document.getElementById(`entry-${slot}`).innerText = slotData.entryTime;
    document.getElementById(`exit-${slot}`).innerText = slotData.exitTime;
    document.getElementById(`duration-${slot}`).innerText = formatMMSS(slotData.duration);

    const statusEl = document.getElementById(`status-${slot}`);
    if (slotData.occupied) {
      statusEl.innerText = "OCCUPIED";
      statusEl.className = "status occupied";
    } else {
      statusEl.innerText = "AVAILABLE";
      statusEl.className = "status available";
    }
  });
});
