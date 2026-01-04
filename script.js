const firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const timers = {};

db.ref("parking/carCount").on("value", snap => {
  document.getElementById("carCount").innerText = snap.val() || 0;
});

["slot1","slot2","slot3","slot4"].forEach(slot => {
  db.ref("parking/slots/" + slot).on("value", snap => {
    const d = snap.val();
    const card = document.getElementById(slot);

    card.querySelector(".status").innerText =
      d.occupied ? "OCCUPIED" : "AVAILABLE";
    card.querySelector(".status").className =
      d.occupied ? "status occupied" : "status available";

    card.querySelector(".entry").innerText = d.entryTime;
    card.querySelector(".exit").innerText = d.exitTime;

    if (d.occupied && d.entryTimestamp > 0) {
      startTimer(slot, d.entryTimestamp);
    } else {
      stopTimer(slot);
    }
  });
});

function startTimer(slot, ts) {
  stopTimer(slot);
  timers[slot] = setInterval(() => {
    const diff = Date.now() - ts;
    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    document.getElementById(slot + "Duration").innerText =
      `${String(min).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`;
  }, 1000);
}

function stopTimer(slot) {
  if (timers[slot]) clearInterval(timers[slot]);
  document.getElementById(slot + "Duration").innerText = "00:00";
}
