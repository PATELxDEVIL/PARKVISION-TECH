// 🔥 Firebase Config (YOUR REAL DATA)
//const firebaseConfig = {
  //apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  //authDomain: "parkvision-tech.firebaseapp.com",
  //databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  //projectId: "parkvision-tech",
  //storageBucket: "parkvision-tech.appspot.com",
  //messagingSenderId: "259137051604",
  //appId: "1:259137051604:web:95d40b5e5d839009d21441"
//};

// 🔥 Firebase Config (OFFICIAL)
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

// 🔹 FORMAT DURATION (MM:SS)
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// 🔹 CAR COUNT
db.ref("parking/carCount").on("value", snap => {
  document.getElementById("carCount").textContent = snap.val() || 0;
});

// 🔹 SLOTS LISTENER
for (let i = 1; i <= 4; i++) {
  const slotEl = document.getElementById(`slot${i}`);

  db.ref(`parking/slots/slot${i}`).on("value", snap => {
    const data = snap.val();
    if (!data) return;

    const status = slotEl.querySelector(".status");
    const entry = slotEl.querySelector(".entry");
    const exit = slotEl.querySelector(".exit");
    const duration = slotEl.querySelector(".duration");

    if (data.occupied) {
      slotEl.classList.add("occupied");
      status.textContent = "OCCUPIED";
    } else {
      slotEl.classList.remove("occupied");
      status.textContent = "AVAILABLE";
    }

    // ✅ FIXED TIME ISSUE (NO EPOCH CONVERSION)
    entry.textContent = data.entryTime || "--";
    exit.textContent  = data.exitTime  || "--";
    duration.textContent = formatDuration(data.duration || 0);
  });
}
