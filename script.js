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
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app"
});

firebase.database().ref("parkingLocations")
.on("value", snap => {
  const div = document.getElementById("parking");
  div.innerHTML = "";

  snap.forEach(loc => {
    const l = loc.val();
    let html = `<div class="location"><h2>${l.name}</h2>`;

    Object.entries(l.slots).forEach(([id, s]) => {
      html += `
        <div class="slot ${s.status.toLowerCase()}">
          <b>${id}</b><br>${s.status}
        </div>`;
    });

    html += "</div>";
    div.innerHTML += html;
  });
});

