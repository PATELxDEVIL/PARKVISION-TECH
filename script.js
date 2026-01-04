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

/* ================= CAR COUNT ================= */
db.ref("parking/carCount").on("value", snap => {
  document.getElementById("carCount").innerText = snap.val() ?? 0;
});

/* ================= TIME FORMAT ================= */
function formatMMSS(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

/* ================= SLOT LISTENER ================= */
function listenSlot(slotId) {
  const slotDiv = document.getElementById(slotId);

  db.ref(`parking/slots/${slotId}`).on("value", snap => {
    const d = snap.val();
    if (!d) return;

    const occupied = d.occupied;
    const entry = d.entryTime || "-";
    const exit = d.exitTime || "-";
    const duration = d.duration || 0;

    slotDiv.innerHTML = `
      <h3>${slotId.toUpperCase()}</h3>
      <span class="badge ${occupied ? "occupied" : "available"}">
        ${occupied ? "OCCUPIED" : "AVAILABLE"}
      </span>
      <p>Entry: ${entry}</p>
      <p>Exit: ${exit}</p>
      <p><strong>Duration: ${formatMMSS(duration)}</strong></p>
    `;
  });
}

["slot1","slot2","slot3","slot4"].forEach(listenSlot);
