// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC50tfEA2h__peWlFCf4Dly5m_eEJ8br-s",
  authDomain: "bangla-story-9061a.firebaseapp.com",
  databaseURL: "https://bangla-story-9061a-default-rtdb.firebaseio.com",
  projectId: "bangla-story-9061a",
  storageBucket: "bangla-story-9061a.appspot.com",
  messagingSenderId: "135733018669",
  appId: "1:135733018669:web:66e5c0903e612bf40538a4",
  measurementId: "G-X2W6RPC4PT"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// App Script
const container = document.getElementById("story-container");

async function setMainBackground() {
  try {
    const doc = await db.collection("category").doc("main_screen_background").get();
    const url = doc.data()?.imageUrl;
    if (url) {
      document.body.style.backgroundImage = `url('${url}')`;
    }
  } catch (e) {
    console.error("Main background not found:", e);
  }
}

async function showCategories() {
  await setMainBackground();
  container.innerHTML = "<p>Loading categories...</p>";
  const snapshot = await db.collection("category").get();

  container.innerHTML = "";
  snapshot.forEach(doc => {
    if (doc.id === "main_screen_background") return;

    const data = doc.data();
    const name = data.name || doc.id;
    const btn = document.createElement("div");
    btn.classList.add("category-btn");
    btn.textContent = name;
    btn.onclick = () => loadStories(doc.id);
    container.appendChild(btn);
  });
}

async function loadStories(categoryId) {
  const doc = await db.collection("category").doc(categoryId).get();
  const data = doc.data();
  const bg = data.backgroundImageUrl;
  const name = data.name || categoryId;

  if (bg) {
    document.body.style.backgroundImage = `url('${bg}')`;
  }

  container.innerHTML = `
    <button class="back-btn" onclick="showCategories()">← Back</button>
    <h2>${name}</h2>
  `;

  const storiesSnap = await db.collection("category").doc(categoryId).collection("all").get();

  storiesSnap.forEach(storyDoc => {
    const story = storyDoc.data().data;
    const p = document.createElement("div");
    p.classList.add("story");
    p.textContent = story;
    container.appendChild(p);
  });
}

showCategories();