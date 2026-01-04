// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.firebaseio.com",
  projectId: "parkvision-tech"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const timers = {};

// 🔢 Auto car count from slots
db.ref("parking/slots").on("value", snap => {
  let count = 0;
  snap.forEach(s => {
    if (s.val().occupied === true) count++;
  });
  document.getElementById("carCount").innerText = count;
});

// 🎯 Slot listener
function listenSlot(slot) {
  db.ref("parking/slots/" + slot).on("value", snap => {
    const d = snap.val();
    if (!d) return;

    document.getElementById(slot + "Status").innerText =
      d.occupied ? "OCCUPIED" : "AVAILABLE";

    document.getElementById(slot + "Entry").innerText = d.entryTime || "-";
    document.getElementById(slot + "Exit").innerText = d.exitTime || "-";

    if (d.occupied && d.entryTimestamp > 0) {
      startTimer(slot, d.entryTimestamp);
    } else {
      stopTimer(slot);
    }
  });
}

// ⏱ MM:SS Timer
function startTimer(slot, entryTs) {
  stopTimer(slot);

  timers[slot] = setInterval(() => {
    const diff = Date.now() - entryTs;
    if (diff < 0) return;

    const totalSec = Math.floor(diff / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;

    document.getElementById(slot + "Duration").innerText =
      `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }, 1000);
}

function stopTimer(slot) {
  if (timers[slot]) {
    clearInterval(timers[slot]);
    delete timers[slot];
  }
  document.getElementById(slot + "Duration").innerText = "00:00";
}

// 🚗 Start listeners
listenSlot("slot1");
listenSlot("slot2");
listenSlot("slot3");
listenSlot("slot4");
