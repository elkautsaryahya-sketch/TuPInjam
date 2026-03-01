import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const inputNama = document.getElementById("inputNama");
const inputKelas = document.getElementById("inputKelas");
const inputNis = document.getElementById("inputNis");

const profileNama = document.getElementById("profileNama");
const profileKelas = document.getElementById("profileKelas");
const profileNis = document.getElementById("profileNis");

// ================= CEK LOGIN =================
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  // Cek apakah sudah ada profil
  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
  const data = snap.data();

  if (data.nama && data.kelas && data.nis) {
    tampilProfil(data);
  }
}

});

// ================= SIMPAN PROFIL =================
window.simpanProfil = async function () {

  const user = auth.currentUser;

  const nama = inputNama.value.trim();
  const kelas = inputKelas.value.trim();
  const nis = inputNis.value.trim();

  if (!nama || !kelas || !nis) {
    alert("Lengkapi semua data!");
    return;
  }

  await setDoc(doc(db, "users", user.uid), {
  nama,
  kelas,
  nis
}, { merge: true });

  tampilProfil({ nama, kelas, nis });
};

// ================= TAMPIL PROFIL =================
function tampilProfil(data) {

  document.getElementById("formProfil").classList.add("hidden");
  document.getElementById("profileView").classList.remove("hidden");
  document.getElementById("logoSection").classList.remove("hidden");
  document.getElementById("logoutSection").classList.remove("hidden");

  profileNama.textContent = data.nama;
  profileKelas.textContent = data.kelas;
  profileNis.textContent = "NIS: " + data.nis;
}

// ================= LOGOUT =================
window.logout = async function () {
  await signOut(auth);
  window.location.href = "index.html";
};
window.editProfil = async function () {
  const user = auth.currentUser;
  const snap = await getDoc(doc(db, "users", user.uid));
  const data = snap.data();

  // Isi form dengan data lama
  inputNama.value = data.nama;
  inputKelas.value = data.kelas;
  inputNis.value = data.nis;

  // Tampilkan form
  document.getElementById("formProfil").classList.remove("hidden");
  document.getElementById("profileView").classList.add("hidden");
  document.getElementById("logoSection").classList.add("hidden");
  document.getElementById("logoutSection").classList.add("hidden");
};
