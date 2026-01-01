import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
  projectId: "your-project-id"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// CAR COUNT
onValue(ref(db, "parking/carCount"), snapshot => {
  document.getElementById("count").innerText = snapshot.val();
});

// SLOT STATUS
["slot1","slot2","slot3","slot4"].forEach(slot => {
  onValue(ref(db, "parking/slots/" + slot), snapshot => {
    const el = document.getElementById(slot);
    if (snapshot.val()) {
      el.className = "slot occupied";
    } else {
      el.className = "slot free";
    }
  });
});
