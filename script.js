// Import Firebase modules (for V9+)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCjf6QOf7gdq1StOBdf5zWtWyde-Gis0Nc",
  authDomain: "bm-trading-llp.firebaseapp.com",
  projectId: "bm-trading-llp",
  storageBucket: "bm-trading-llp.firebasestorage.app",
  messagingSenderId: "760421393441",
  appId: "1:760421393441:web:bda19fd259add66b892f60",
  measurementId: "G-FXSZ8BFMK2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ---------------- LOGIN LOGIC ----------------
if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();

    // Hardcoded admin credentials
    if (phone === "0720300388" && password === "Brian") {
      localStorage.setItem("isAdmin", "true");
      alert("Login successful!");
      window.location.href = "add-product.html";
    } else {
      alert("Invalid admin credentials.");
    }
  });
}

// ---------------- ADD PRODUCT ----------------
if (document.getElementById("addProductForm")) {
  // Check if logged in
  if (localStorage.getItem("isAdmin") !== "true") {
    alert("Access denied. Please log in as admin.");
    window.location.href = "login.html";
  }

  document.getElementById("addProductForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const imageFile = document.getElementById("productImage").files[0];

    if (!imageFile) {
      alert("Please select an image");
      return;
    }

    const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imageUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, "products"), {
      name,
      price,
      imageUrl,
      createdAt: new Date()
    });

    alert("Product added successfully!");
    document.getElementById("addProductForm").reset();
  });
}

// ---------------- DISPLAY PRODUCTS ----------------
if (document.getElementById("productList")) {
  async function loadProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));
    const productList = document.getElementById("productList");
    productList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const div = document.createElement("div");
      div.classList.add("product-card");
      div.innerHTML = `
        <img src="${data.imageUrl}" alt="${data.name}" />
        <h3>${data.name}</h3>
        <p>KES ${data.price}</p>
      `;
      productList.appendChild(div);
    });
  }

  loadProducts();
}
