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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Form Handling
const form = document.getElementById("bookingForm");
const message = document.getElementById("message");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const userId = document.getElementById("userId").value;
  const vehicleNumber = document.getElementById("vehicleNumber").value;
  const slot = document.getElementById("slot").value;

  const bookingId = "BOOKING_" + Date.now();

  firebase.database().ref("bookings/" + bookingId).set({
    userId: userId,
    vehicleNumber: vehicleNumber,
    slot: Number(slot),
    status: "BOOKED",
    entryEpoch: 0,
    exitEpoch: 0,
    fare: 0
  }).then(() => {
    message.innerHTML = "✅ Booking Successful! Go to Entry Gate.";
    message.style.color = "#00ff99";
    form.reset();
  }).catch((error) => {
    message.innerHTML = "❌ Error: " + error.message;
    message.style.color = "red";
  });
});

