// 🔥 Firebase Config (replace with yours)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.firebaseio.com",
  projectId: "parkvision-tech",
  storageBucket: "parkvision-tech.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();

// 🔢 Total car count
db.ref("parking/carCount").on("value", snapshot => {
  document.getElementById("carCount").innerText = snapshot.val();
});

// 🚗 Slot status
function updateSlot(slotId) {
  db.ref("parking/slots/" + slotId + "/occupied").on("value", snap => {
    const slotDiv = document.getElementById(slotId);
    if (snap.val() === true) {
      slotDiv.className = "slot occupied";
      slotDiv.innerText = slotId.toUpperCase() + "\nOCCUPIED";
    } else {
      slotDiv.className = "slot available";
      slotDiv.innerText = slotId.toUpperCase() + "\nAVAILABLE";
    }
  });
}

updateSlot("slot1");
updateSlot("slot2");
updateSlot("slot3");
updateSlot("slot4");
