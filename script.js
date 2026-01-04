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

db.ref("parking/carCount").on("value", snap => {
  document.getElementById("carCount").innerText = snap.val();
});

function bindSlot(slot) {
  db.ref("parking/slots/" + slot).on("value", snap => {
    const d = snap.val();
    document.getElementById(slot).className =
      "slot " + (d.occupied ? "occupied" : "");

    document.getElementById(slot + "_entry").innerText = d.entryTime;
    document.getElementById(slot + "_exit").innerText = d.exitTime;
    document.getElementById(slot + "_duration").innerText = d.durationMin;
  });
}

["slot1", "slot2", "slot3", "slot4"].forEach(bindSlot);
