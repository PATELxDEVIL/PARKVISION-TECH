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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/**************** BOOK SLOT FUNCTION ****************/
function bookSlot() {
  const vehicleNumber = document.getElementById("vehicleNumber").value.trim();
  const slotNumber = parseInt(document.getElementById("slotSelect").value);
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  if (!vehicleNumber || !startTime || !endTime) {
    alert("Please fill all fields!");
    return;
  }

  const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
  const endEpoch = Math.floor(new Date(endTime).getTime() / 1000);

  const bookingId = "ADV_" + Date.now();

  const bookingData = {
    userId: "USER_001",
    vehicleNumber,
    slot: slotNumber,
    startEpoch,
    endEpoch,
    status: "BOOKED",
    converted: false
  };

  db.ref("advanceBookings/" + bookingId).set(bookingData)
    .then(() => alert("✅ Slot Booked Successfully!"))
    .catch(err => { alert("❌ Booking Failed"); console.error(err); });
}

/**************** AUTO-ACTIVATE + NO-SHOW CHECK ****************/
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);

  db.ref("advanceBookings").once("value", snapshot => {
    snapshot.forEach(child => {
      const data = child.val();
      const advId = child.key;

      const waitTime = now - data.startEpoch;

      // 1️⃣ Auto activate booking
      if (data.status === "BOOKED" && !data.converted && now >= data.startEpoch) {
        const newBookingId = "BOOKING_" + Date.now();
        const booking = {
          userId: data.userId,
          vehicleNumber: data.vehicleNumber,
          slot: data.slot,
          status: "BOOKED",
          entryEpoch: 0,
          exitEpoch: 0,
          fare: 0,
          source: "ADVANCE",
          advanceId: advId
        };
        db.ref("bookings/" + newBookingId).set(booking);
        db.ref("advanceBookings/" + advId + "/converted").set(true);
        console.log("✅ Activated booking:", newBookingId);
      }

      // 2️⃣ No-show auto-expire after 2 min
      if (data.status === "BOOKED" && waitTime > 120 && !data.converted) {
        db.ref("advanceBookings/" + advId + "/status").set("EXPIRED");
        console.log("⚠️ Booking expired (no-show):", advId);
      }

    });
  });
}, 10000); // check every 10 sec

/**************** UPDATE DASHBOARD UI ****************/
db.ref("bookings").on("value", snapshot => {
  let count = 0;

  document.querySelectorAll(".slot").forEach(slot => {
    slot.classList.remove("occupied");
    slot.querySelector(".status").innerText = "AVAILABLE";
  });

  snapshot.forEach(child => {
    const data = child.val();
    if (data.status === "BOOKED" || data.status === "IN") {
      count++;
      const slotDiv = document.getElementById("slot" + data.slot);
      slotDiv.classList.add("occupied");
      slotDiv.querySelector(".status").innerText = data.status;
    }
  });

  document.getElementById("carCount").innerText = count;
});

