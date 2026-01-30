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

/**************** BOOK SLOT ****************/
function bookSlot(slotNumber, vehicleNumber, startTime, endTime) {

  const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
  const endEpoch = Math.floor(new Date(endTime).getTime() / 1000);

  const bookingId = "ADV_" + Date.now();

  const bookingData = {
    userId: "USER_001",
    vehicleNumber: vehicleNumber,
    slot: slotNumber,
    startEpoch: startEpoch,
    endEpoch: endEpoch,
    status: "BOOKED",
    converted: false
  };

  db.ref("advanceBookings/" + bookingId).set(bookingData)
    .then(() => {
      alert("✅ Slot Booked Successfully!");
    })
    .catch(err => {
      alert("❌ Booking Failed");
      console.error(err);
    });
}

/**************** AUTO ACTIVATE BOOKINGS ****************/
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);

  db.ref("advanceBookings").once("value", snapshot => {
    snapshot.forEach(child => {

      const data = child.val();
      const advId = child.key;

      if (
        data.status === "BOOKED" &&
        data.converted === false &&
        now >= data.startEpoch
      ) {

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
    });
  });
}, 10000); // check every 10 sec

/**************** UI SLOT STATUS ****************/
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
