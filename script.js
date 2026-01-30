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

// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvision-tech",
  storageBucket: "parkvision-tech.appspot.com",
  messagingSenderId: "259137051604",
  appId: "1:259137051604:web:95d40b5e5d839009d21441"
};


// 🔥 Firebase Config
const firebaseConfig = {
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔐 BOOK SLOT
function bookSlot() {
  const vehicle = vehicleInput();
  const slot = document.getElementById("slot").value;
  const start = epoch("start");
  const end = epoch("end");

  if (!vehicle || end <= start) {
    alert("Invalid details");
    return;
  }

  const id = "BK_" + Date.now();

  db.ref("bookings/" + id).set({
    vehicle,
    slot,
    startEpoch: start,
    endEpoch: end,
    entryEpoch: 0,
    exitEpoch: 0,
    status: "BOOKED"
  });

  db.ref("slots/" + slot + "/status").set("BOOKED");

  alert("Slot Booked");
}

function epoch(id) {
  return new Date(document.getElementById(id).value).getTime() / 1000;
}

function vehicleInput() {
  return document.getElementById("vehicle").value;
}

// 🔄 LIVE SLOT UPDATE
db.ref("slots").on("value", snap => {
  snap.forEach(s => {
    const slotDiv = document.getElementById("slot" + s.key);
    slotDiv.querySelector(".status").innerText = s.val().status;
    slotDiv.classList.toggle("occupied", s.val().status === "OCCUPIED");
  });
});

// ⏱️ AUTO TIME LOGIC (CRITICAL FIX)
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);

  db.ref("bookings").once("value", snap => {
    snap.forEach(bk => {
      const b = bk.val();
      const id = bk.key;

      // ❌ No-show after 2 min
      if (b.status === "BOOKED" && b.entryEpoch === 0 && now > b.startEpoch + 120) {
        db.ref("bookings/" + id + "/status").set("EXPIRED");
        db.ref("slots/" + b.slot + "/status").set("AVAILABLE");
      }

      // ⏰ Booking time over, no car
      if (b.status === "BOOKED" && now > b.endEpoch) {
        db.ref("bookings/" + id + "/status").set("EXPIRED");
        db.ref("slots/" + b.slot + "/status").set("AVAILABLE");
      }

      // 🚗 Overstay
      if (b.status === "IN" && now > b.endEpoch) {
        db.ref("slots/" + b.slot + "/status").set("OCCUPIED");
      }

      // ✅ Exit
      if (b.status === "COMPLETED") {
        db.ref("slots/" + b.slot + "/status").set("AVAILABLE");
      }
    });
  });
}, 10000);

