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


firebase.initializeApp({
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = firebase.database();

function loadSlots() {
  const loc = document.getElementById("location").value;
  const div = document.getElementById("slots");
  div.innerHTML = "";

  db.ref(`parkingLocations/${loc}/slots`).on("value", snap => {
    div.innerHTML = "";
    snap.forEach(s => {
      const d = s.val();
      div.innerHTML += `
        <div class="slot ${d.status !== 'AVAILABLE' ? 'occupied' : ''}">
          <h3>${s.key}</h3>
          <p>Status: ${d.status}</p>
        </div>`;
    });
  });
}
