// 🔥 Firebase Config (v8)
var firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvision-tech",
  storageBucket: "parkvision-tech.appspot.com",
  messagingSenderId: "259137051604",
  appId: "1:259137051604:web:95d40b5e5d839009d21441"
};

// 🚀 Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();


// 🔢 Total car count
db.ref("parking/carCount").on("value", function (snapshot) {
  document.getElementById("carCount").innerText = snapshot.val() || 0;
});


// 🚗 Slot watcher
function watchSlot(slotId) {
  db.ref("parking/slots/" + slotId).on("value", function (snapshot) {
    var data = snapshot.val();
    var slotDiv = document.getElementById(slotId);

    if (!data || !slotDiv) return;

    slotDiv.querySelector(".status").innerText =
      data.occupied ? "OCCUPIED" : "AVAILABLE";

    slotDiv.querySelector(".entry").innerText =
      data.entryTime || "--";

    slotDiv.querySelector(".exit").innerText =
      data.exitTime || "--";

    slotDiv.className = data.occupied
      ? "slot occupied"
      : "slot available";
  });
}

// 👀 Watch all slots
watchSlot("slot1");
watchSlot("slot2");
watchSlot("slot3");
watchSlot("slot4");
