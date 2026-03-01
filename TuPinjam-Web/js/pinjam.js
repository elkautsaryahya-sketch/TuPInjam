import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc, 
  collection, 
  serverTimestamp,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= FIREBASE CONFIG =================
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

// ================= ELEMENT =================
const judul = document.getElementById("alatNama");
const stokEl = document.getElementById("alatStok");
const inputNama = document.getElementById("inputNama");
const inputKelas = document.getElementById("inputKelas");
const inputTanggal = document.getElementById("inputTanggal");
const btn = document.getElementById("btnKonfirmasi");

// ================= PARAM URL =================
const params = new URLSearchParams(window.location.search);
const alat = params.get("alat");

if (!alat) {
  alert("Alat tidak ditemukan");
  window.location.href = "home.html";
}

// ================= CEK LOGIN =================
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // ================= CEK PROFIL USER =================
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("Lengkapi data diri dulu di Pengaturan!");
    window.location.href = "pengaturan.html";
    return;
  }

  const profil = userSnap.data();

  if (!profil.nama || !profil.kelas || !profil.nis) {
    alert("Lengkapi data diri dulu di Pengaturan!");
    window.location.href = "pengaturan.html";
    return;
  }

  // ================= AUTOFILL =================
  inputNama.value = profil.nama;
  inputKelas.value = profil.kelas;
  inputNama.readOnly = true;
  inputKelas.readOnly = true;

  // ================= AMBIL STOK =================
  const alatRef = doc(db, "alat", "stok");
  const snap = await getDoc(alatRef);

  if (!snap.exists()) {
    alert("Data stok tidak ditemukan!");
    return;
  }

  const data = snap.data();

  judul.textContent = alat.toUpperCase();
  stokEl.textContent = `Tersedia = ${data[alat]}`;

  if (data[alat] <= 0) {
    btn.disabled = true;
    btn.textContent = "Stok Habis";
    return;
  }

  // ================= KONFIRMASI PINJAM =================
  btn.onclick = async () => {

    if (!inputTanggal.value) {
      alert("Pilih tanggal dulu!");
      return;
    }

    try {

      // cek stok terbaru
      const latestSnap = await getDoc(alatRef);
      const latestData = latestSnap.data();

      if (latestData[alat] <= 0) {
        alert("Stok habis!");
        return;
      }

      // kurangi stok
      await updateDoc(alatRef, {
        [alat]: increment(-1)
      });

      // simpan riwayat peminjaman
      await addDoc(collection(db, "peminjaman"), {
        alat: alat,
        nama: profil.nama,
        kelas: profil.kelas,
        nis: profil.nis,
        tanggal: inputTanggal.value,
        userId: user.uid,
        status: "Dipinjam",
        createdAt: serverTimestamp()
      });

      alert("Peminjaman berhasil!");
      window.location.href = "dipinjam.html";

    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat meminjam.");
    }

  };

});
