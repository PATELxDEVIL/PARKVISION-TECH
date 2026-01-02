<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

  const firebaseConfig = {
    apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
    authDomain: "parkvision-tech.firebaseapp.com",
    databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "parkvision-tech",
    storageBucket: "parkvision-tech.firebasestorage.app",
    messagingSenderId: "259137051604",
    appId: "1:259137051604:web:95d40b5e5d839009d21441"
  };

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  // 🔢 Total car count
  onValue(ref(db, "parking/carCount"), (snapshot) => {
    document.getElementById("carCount").innerText = snapshot.val() ?? 0;
  });

  // 🚗 Slot watcher
  function watchSlot(slotId) {
    const baseRef = ref(db, `parking/slots/${slotId}`);

    onValue(baseRef, (snapshot) => {
      const data = snapshot.val();
      const slotDiv = document.getElementById(slotId);

      if (!data || !slotDiv) return;

      slotDiv.querySelector(".status").innerText =
        data.occupied ? "OCCUPIED" : "AVAILABLE";

      slotDiv.querySelector(".entry").innerText =
        data.entryTime ?? "--";

      slotDiv.querySelector(".exit").innerText =
        data.exitTime ?? "--";

      slotDiv.className = data.occupied
        ? "slot occupied"
        : "slot available";
    });
  }

  watchSlot("slot1");
  watchSlot("slot2");
  watchSlot("slot3");
  watchSlot("slot4");
</script>
