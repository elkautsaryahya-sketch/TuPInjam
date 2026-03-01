import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "ISI_API_KEY",
  authDomain: "tupinjam-39c42.firebaseapp.com",
  projectId: "tupinjam-39c42",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const uid = user.uid;
  const snap = await getDoc(doc(db, "users", uid));

  if (!snap.exists()) {
    window.location.href = "index.html";
    return;
  }

  const data = snap.data();

  document.getElementById("showNama").innerText = data.nama;
  document.getElementById("showKelas").innerText = data.kelas;
  document.getElementById("showNis").innerText = data.nis;

});
