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

// FORMAT TIME
function timeFormat(ts) {
  if (!ts || ts === 0) return "-";
  return new Date(ts).toLocaleTimeString();
}

// MM:SS FORMAT
function duration(entry) {
  if (!entry) return "00:00";
  const diff = Math.floor((Date.now() - entry) / 1000);
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  return `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

// TOTAL CAR COUNT
db.ref("parking/carCount").on("value", snap => {
  document.getElementById("carCount").innerText = snap.val() ?? 0;
});

// SLOT LISTENER
["slot1","slot2","slot3","slot4"].forEach(slotId => {
  db.ref("parking/slots/" + slotId).on("value", snap => {
    const data = snap.val();
    const el = document.getElementById(slotId);

    if (!data) return;

    el.className = "slot" + (data.occupied ? " occupied" : "");

    el.innerHTML = `
      <img src="car.png" class="car">
      <h3>${slotId.toUpperCase()}</h3>
      <p>Status:
        <span class="status ${data.occupied ? "red":"green"}">
          ${data.occupied ? "OCCUPIED":"AVAILABLE"}
        </span>
      </p>
      <p>Entry: ${timeFormat(data.entryTime)}</p>
      <p>Exit: ${timeFormat(data.exitTime)}</p>
      <p>Duration: ${data.occupied ? duration(data.entryTime) : "00:00"}</p>
    `;
  });
});

