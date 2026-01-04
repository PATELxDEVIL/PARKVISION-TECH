const firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvision-tech",
  messagingSenderId: "259137051604",
  appId: "1:259137051604:web:95d40b5e5d839009d21441"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* TOTAL CAR COUNT */
db.ref("parking/carCount").on("value", snap => {
  document.getElementById("carCount").innerText = snap.val() ?? 0;
});

function formatTime(ms) {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

["slot1","slot2","slot3","slot4"].forEach(slot => {
  let occupied = false;
  let entryTimestamp = 0;

  db.ref("parking/slots/" + slot).on("value", snap => {
    const d = snap.val();
    if (!d) return;

    occupied = d.occupied;
    entryTimestamp = d.entryTimestamp || 0;

    const card = document.getElementById(slot);
    const status = card.querySelector(".status");

    card.classList.toggle("occupied", occupied);
    status.innerText = occupied ? "OCCUPIED" : "AVAILABLE";

    document.getElementById(slot + "_entry").innerText = d.entryTime;
    document.getElementById(slot + "_exit").innerText = d.exitTime;
  });

  setInterval(() => {
    if (occupied && entryTimestamp > 0) {
      document.getElementById(slot + "_duration").innerText =
        formatTime(Date.now() - entryTimestamp);
    } else {
      document.getElementById(slot + "_duration").innerText = "00:00";
    }
  }, 1000);
});
