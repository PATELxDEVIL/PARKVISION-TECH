const firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvision-tech"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* Car Count */
db.ref("parking/carCount").on("value", s => {
  document.getElementById("carCount").innerText = s.val() ?? 0;
});

/* Daily Analytics */
db.ref("parking/today/totalEntry").on("value", s => {
  document.getElementById("entryToday").innerText = s.val() ?? 0;
});

db.ref("parking/today/totalExit").on("value", s => {
  document.getElementById("exitToday").innerText = s.val() ?? 0;
});

/* Slots */
["slot1","slot2","slot3","slot4"].forEach(slot => {
  db.ref("parking/slots/" + slot + "/occupied").on("value", s => {
    const el = document.getElementById(slot);
    if (s.val()) {
      el.className = "slot occupied";
      el.innerText = slot.toUpperCase() + "\nOCCUPIED";
    } else {
      el.className = "slot available";
      el.innerText = slot.toUpperCase() + "\nAVAILABLE";
    }
  });
});
