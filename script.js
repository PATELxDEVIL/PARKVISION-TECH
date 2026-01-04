// Firebase Config (YOUR REAL CONFIG)
const firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvision-tech",
  storageBucket: "parkvision-tech.firebasestorage.app",
  messagingSenderId: "259137051604",
  appId: "1:259137051604:web:95d40b5e5d839009d21441"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ================= LIVE CAR COUNT ================= */
db.ref("parking/carCount").on("value", snapshot => {
  document.getElementById("carCount").innerText = snapshot.val() ?? 0;
});

/* ================= SLOT HANDLER ================= */
function watchSlot(slotId) {
  const slotDiv = document.getElementById(slotId);
  const statusEl = slotDiv.querySelector(".status");
  const timeEl = document.getElementById(slotId + "-time");

  // Occupied / Available
  db.ref(`parking/slots/${slotId}/occupied`).on("value", snap => {
    if (snap.val() === true) {
      slotDiv.className = "slot occupied";
      statusEl.innerText = "🔴 OCCUPIED";
    } else {
      slotDiv.className = "slot available";
      statusEl.innerText = "🟢 AVAILABLE";
    }
  });

  // Entry time
  db.ref(`parking/slots/${slotId}/entryTime`).on("value", snap => {
    if (snap.val() && snap.val() !== "-") {
      timeEl.innerText = "Entry: " + snap.val();
    }
  });

  // Exit time
  db.ref(`parking/slots/${slotId}/exitTime`).on("value", snap => {
    if (snap.val() && snap.val() !== "-") {
      timeEl.innerText = "Exit: " + snap.val();
    }
  });
}

// Activate all slots
watchSlot("slot1");
watchSlot("slot2");
watchSlot("slot3");
watchSlot("slot4");
