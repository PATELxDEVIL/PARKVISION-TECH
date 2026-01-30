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

/**************** BOOK SLOT FORM ****************/
const bookingForm = document.getElementById("slotBookingForm");
const bookingMessage = document.getElementById("bookingMessage");

bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const vehicleNumber = document.getElementById("vehicleNumber").value.trim();
  const slotNumber = parseInt(document.getElementById("slotNumber").value);
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  const startEpoch = Math.floor(new Date(startTime).getTime() / 1000);
  const endEpoch = Math.floor(new Date(endTime).getTime() / 1000);

  if (startEpoch >= endEpoch) {
    bookingMessage.innerText = "❌ End time must be after start time";
    return;
  }

  // Slot Conflict Check
  const snapshot = await db.ref("advanceBookings").once("value");
  let conflict = false;

  snapshot.forEach(child => {
    const data = child.val();
    if (data.slot === slotNumber && !(endEpoch <= data.startEpoch || startEpoch >= data.endEpoch)) {
      conflict = true;
    }
  });

  if (conflict) {
    bookingMessage.innerText = `❌ Slot ${slotNumber} is already booked in that time.`;
    return;
  }

  // Create Advance Booking
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
    .then(() => {
      bookingMessage.innerText = `✅ Slot ${slotNumber} booked successfully!`;
      bookingForm.reset();
    })
    .catch(err => {
      bookingMessage.innerText = "❌ Booking failed!";
      console.error(err);
    });
});

/**************** AUTO ACTIVATE BOOKINGS ****************/
setInterval(() => {
  const now = Math.floor(Date.now() / 1000);

  db.ref("advanceBookings").once("value", snapshot => {
    snapshot.forEach(child => {
      const data = child.val();
      const advId = child.key;

      if (data.status === "BOOKED" && data.converted === false && now >= data.startEpoch) {
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
}, 10000);

/**************** SLOT STATUS DASHBOARD ****************/
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

/**************** ADMIN DASHBOARD ****************/
const adminTableBody = document.querySelector("#adminTable tbody");

db.ref("bookings").on("value", snapshot => {
  adminTableBody.innerHTML = "";
  snapshot.forEach(child => {
    const data = child.val();
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${data.slot}</td>
      <td>${data.vehicleNumber}</td>
      <td>${data.status}</td>
      <td>${data.entryEpoch ? new Date(data.entryEpoch*1000).toLocaleString() : "--"}</td>
      <td>${data.exitEpoch ? new Date(data.exitEpoch*1000).toLocaleString() : "--"}</td>
    `;
    adminTableBody.appendChild(row);
  });
});

