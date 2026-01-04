// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvision-tech",
  storageBucket: "parkvision-tech.firebasestorage.app",
  messagingSenderId: "259137051604",
  appId: "1:259137051604:web:95d40b5e5d839009d21441"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ===== LIVE CAR COUNT ===== */
db.ref("parking/carCount").on("value", snapshot => {
  document.getElementById("carCount").innerText = snapshot.val() ?? 0;
});

/* ===== SLOT WATCHER ===== */
function watchSlot(slotId) {
  const slot = document.getElementById(slotId);
  const status = slot.querySelector(".status");
  const time = document.getElementById(slotId + "-time");

  db.ref(`parking/slots/${slotId}/occupied`).on("value", s => {
    if (s.val()) {
      slot.className = "slot occupied";
      status.innerText = "🔴 OCCUPIED";
    } else {
      slot.className = "slot available";
      status.innerText = "🟢 AVAILABLE";
    }
  });

  db.ref(`parking/slots/${slotId}/entryTime`).on("value", s => {
    if (s.val() && s.val() !== "-")
      time.innerText = "Entry: " + s.val();
  });

  db.ref(`parking/slots/${slotId}/exitTime`).on("value", s => {
    if (s.val() && s.val() !== "-")
      time.innerText = "Exit: " + s.val();
  });
}

["slot1","slot2","slot3","slot4"].forEach(watchSlot);
