const firebaseConfig = {
  apiKey: "AIzaSyCCoyLflwSGYv2akdXCwCxxQLQnR0l_p6I",
  authDomain: "parkvision-tech.firebaseapp.com",
  databaseURL: "https://parkvision-tech-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "parkvision-tech",
  messagingSenderId: "259137051604",
  appId: "1:259137051604:web:95d40b5e5d839009d21441"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

db.ref("parking/carCount").on("value", s => {
  document.getElementById("carCount").innerText = s.val() || 0;
});

function format(ms) {
  let sec = Math.floor(ms / 1000);
  return `${Math.floor(sec/60)}:${(sec%60).toString().padStart(2,"0")}`;
}

["slot1","slot2","slot3","slot4"].forEach(slot=>{
  let entryTs=0, occupied=false;

  db.ref("parking/slots/"+slot).on("value", s=>{
    let d=s.val();
    if(!d) return;
    occupied=d.occupied;
    entryTs=d.entryTimestamp;
    document.getElementById(slot).classList.toggle("occupied", occupied);
    document.getElementById(slot+"_entry").innerText=d.entryTime;
    document.getElementById(slot+"_exit").innerText=d.exitTime;
  });

  setInterval(()=>{
    if(occupied && entryTs)
      document.getElementById(slot+"_duration").innerText =
        format(Date.now()-entryTs);
  },1000);
});
