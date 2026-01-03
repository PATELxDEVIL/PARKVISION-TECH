// 🔥 Firebase Config (YOUR REAL CONFIG)
const firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvision-tech",
  storageBucket: "parkvision-tech.appspot.com",
  messagingSenderId: "259137051604",
  appId: "1:259137051604:web:95d40b5e5d839009d21441"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* 🔢 TOTAL CARS */
db.ref("parking/carCount").on("value", snapshot => {
  document.getElementById("carCount").innerText = snapshot.val() ?? 0;
});

/* 🚗 SLOT STATUS */
function watchSlot(slotId) {
  db.ref("parking/slots/" + slotId + "/occupied").on("value", snap => {
    const slot = document.getElementById(slotId);

    if (snap.val() === true) {
      slot.className = "slot occupied";
      slot.innerHTML = "🚗 " + slotId.toUpperCase() + "<br>OCCUPIED";
    } else {
      slot.className = "slot available";
      slot.innerHTML = "🅿 " + slotId.toUpperCase() + "<br>AVAILABLE";
    }
  });
}

watchSlot("slot1");
watchSlot("slot2");
watchSlot("slot3");
watchSlot("slot4");
