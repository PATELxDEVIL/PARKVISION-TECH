<script type="module">
  // 🔥 Import Firebase v9 modules
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

  // 🔐 Your Firebase Config (already correct)
  const firebaseConfig = {
    apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
    authDomain: "parkvision-tech.firebaseapp.com",
    databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "parkvision-tech",
    storageBucket: "parkvision-tech.firebasestorage.app",
    messagingSenderId: "259137051604",
    appId: "1:259137051604:web:95d40b5e5d839009d21441",
    measurementId: "G-BE3NE1HSYM"
  };

  // 🚀 Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // ===============================
  // 🔢 TOTAL CAR COUNT
  // ===============================
  const carCountRef = ref(db, "parking/carCount");

  onValue(carCountRef, (snapshot) => {
    const count = snapshot.val() ?? 0;
    document.getElementById("carCount").innerText = count;
  });

  // ===============================
  // 🚗 SLOT STATUS HANDLER
  // ===============================
  function watchSlot(slotId) {
    const slotRef = ref(db, `parking/slots/${slotId}/occupied`);

    onValue(slotRef, (snapshot) => {
      const occupied = snapshot.val();
      const slotDiv = document.getElementById(slotId);

      if (!slotDiv) return;

      if (occupied === true) {
        slotDiv.className = "slot occupied";
        slotDiv.innerText = slotId.toUpperCase() + "\nOCCUPIED";
      } else {
        slotDiv.className = "slot available";
        slotDiv.innerText = slotId.toUpperCase() + "\nAVAILABLE";
      }
    });
  }

  // 🔁 Monitor all slots
  watchSlot("slot1");
  watchSlot("slot2");
  watchSlot("slot3");
  watchSlot("slot4");
</script>
