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

// Auto-update bookings and handle no-show / overstaying
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);

  db.ref("advanceBookings").once("value").then(snapshot => {
    snapshot.forEach(child => {
      const data = child.val();
      const advId = child.key;
      const waitTime = now - data.startEpoch;

      // Auto activate booking
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
        console.log("Activated booking:", newBookingId);
      }

      // No-show release after 2 min
      if (data.status === "BOOKED" && waitTime > 120 && !data.converted) {
        db.ref("advanceBookings/" + advId + "/status").set("EXPIRED");
        console.log("Booking expired (no-show):", advId);
      }
    });
  });

  // Update dashboard UI from /bookings
  db.ref("bookings").once("value").then(snapshot => {
    let count = 0;
    document.querySelectorAll(".slot").forEach(slot => {
      slot.classList.remove("occupied");
      slot.querySelector(".status").innerText = "AVAILABLE";
    });

    snapshot.forEach(child => {
      const data = child.val();
      const slotDiv = document.getElementById("slot" + data.slot);
      if (!slotDiv) return;

      const nowEpoch = Math.floor(Date.now() / 1000);

      // Determine status
      let displayStatus = data.status;
      if (data.status === "BOOKED" && nowEpoch >= data.startEpoch + 120 && data.entryEpoch == 0) {
        displayStatus = "AVAILABLE"; // expired
      } else if (data.status === "BOOKED" && data.entryEpoch > 0) {
        displayStatus = "IN";
      } else if (data.status === "IN" && nowEpoch > data.endEpoch) {
        displayStatus = "OCCUPIED"; // overstayed
      }

      if (displayStatus !== "AVAILABLE") {
        slotDiv.classList.add("occupied");
        slotDiv.querySelector(".status").innerText = displayStatus;
        count++;
      } else {
        slotDiv.classList.remove("occupied");
        slotDiv.querySelector(".status").innerText = "AVAILABLE";
      }
    });

    document.getElementById("carCount").innerText = count;
  });

}, 3000); // check every 5 seconds
