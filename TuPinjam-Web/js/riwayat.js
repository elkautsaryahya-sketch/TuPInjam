import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  orderBy,
  getDocs 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBKBlwXashCr76gEsH_b0w8FD-BJKosQ90",
  authDomain: "tupinjam-39c42.firebaseapp.com",
  projectId: "tupinjam-39c42",
  storageBucket: "tupinjam-39c42.appspot.com",
  messagingSenderId: "410564688322",
  appId: "1:410564688322:web:187157e3a6a52567f83e5b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const container = document.getElementById("listRiwayat");

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  loadRiwayat(user.uid);

});

async function loadRiwayat(userId) {

  container.innerHTML = "";

  const q = query(
    collection(db, "peminjaman"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    container.innerHTML = "<p style='color:white;text-align:center'>Belum ada riwayat</p>";
    return;
  }

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();

    const card = document.createElement("div");
    card.className = "status-card";

    const warnaStatus = data.status === "Dipinjam" ? "dipinjam" : "dikembalikan";

    card.innerHTML = `
      <div class="status-header">
        <img src="assets/${data.alat}.png" class="status-img">
        <h4>${data.alat.toUpperCase()}</h4>
      </div>

      <div class="status-badge ${warnaStatus}">
        ${data.status}
      </div>

      <small style="color:white">
        ${data.nama} - ${data.kelas}
      </small>
      <br>
      <small style="color:white">
        ${data.tanggal}
      </small>
    `;

    container.appendChild(card);

  });

}