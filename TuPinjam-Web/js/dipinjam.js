import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  getDoc 
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

const list = document.getElementById("listDipinjam");

// =======================
// CEK LOGIN
// =======================
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  await loadData(user.uid);
  await loadStat(user.uid);

});

// =======================
// LOAD DATA DIPINJAM
// =======================
async function loadData(userId) {

  list.innerHTML = "";

  const q = query(
    collection(db, "peminjaman"),
    where("userId", "==", userId),
    where("status", "==", "Dipinjam")
  );

  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    list.innerHTML = "<p style='color:white;text-align:center'>Belum ada alat dipinjam</p>";
    return;
  }

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const docId = docSnap.id;

    const card = document.createElement("div");
    card.className = "status-card";

    card.innerHTML = `
      <div class="status-header">
        <img src="assets/${data.alat}.png" class="status-img">
        <h4>${data.alat.toUpperCase()}</h4>
      </div>
      <div class="status-badge dipinjam">
        Di kelas ${data.kelas}
      </div>
      <button class="btn-kembali" data-id="${docId}" data-alat="${data.alat}">
        Kembalikan
      </button>
    `;

    list.appendChild(card);
  });

}

// =======================
// EVENT RETURN
// =======================
list.addEventListener("click", async (e) => {

  if (!e.target.classList.contains("btn-kembali")) return;

  const docId = e.target.dataset.id;
  const alatKey = e.target.dataset.alat;

  // Tambah stok lagi
  const alatRef = doc(db, "alat", "stok");
  const snap = await getDoc(alatRef);
  const stokData = snap.data();

  await updateDoc(alatRef, {
    [alatKey]: stokData[alatKey] + 1
  });

  // Update status
  await updateDoc(doc(db, "peminjaman", docId), {
    status: "Dikembalikan"
  });

  alert("Alat berhasil dikembalikan");
  location.reload();

});
async function loadStat(userId) {

  // Ambil stok
  const stokSnap = await getDoc(doc(db, "alat", "stok"));
  const stokData = stokSnap.data();

  let totalTersedia = 0;
  for (let key in stokData) {
    totalTersedia += stokData[key];
  }

  // Ambil jumlah yang sedang dipakai
  const q = query(
    collection(db, "peminjaman"),
    where("status", "==", "Dipinjam")
  );

  const snap = await getDocs(q);
  const totalDipinjam = snap.size;

  const totalAlat = totalTersedia + totalDipinjam;

  document.getElementById("totalAlat").textContent = totalAlat;
  document.getElementById("totalTersedia").textContent = totalTersedia;
  document.getElementById("totalDipinjam").textContent = totalDipinjam;
}