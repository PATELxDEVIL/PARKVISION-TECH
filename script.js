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

// 🔥 Firebase Config (YOUR REAL DATA)
const firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvision-tech",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🔁 Helpers
function formatEpoch(epoch) {
  if (!epoch || epoch === 0) return "--";
  return new Date(epoch * 1000).toLocaleTimeString();
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// 🔥 REALTIME LISTENER
firebase.database().ref("parking/slots").on("value", snapshot => {
  let total = 0;

  snapshot.forEach(slotSnap => {
    const slotId = slotSnap.key.toUpperCase();
    const data = slotSnap.val();
    const el = document.getElementById(slotId);

    const status = el.querySelector(".status");
    const entry = el.querySelector(".entry");
    const exit = el.querySelector(".exit");
    const duration = el.querySelector(".duration");

    if (data.occupied) {
      total++;
      el.classList.add("occupied");
      status.innerText = "OCCUPIED";

      entry.innerText = formatEpoch(data.entryEpoch);
      exit.innerText = "--";

      const liveSec = Math.floor(Date.now() / 1000) - data.entryEpoch;
      duration.innerText = formatDuration(liveSec);
    } else {
      el.classList.remove("occupied");
      status.innerText = "AVAILABLE";

      entry.innerText = formatEpoch(data.entryEpoch);
      exit.innerText = formatEpoch(data.exitEpoch);
      duration.innerText = data.duration
        ? formatDuration(data.duration)
        : "00:00";
    }
  });

  document.getElementById("totalCars").innerText = total;
});

