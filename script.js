<script type="module">
  // Confirm the script is loaded
  console.log("Module script loaded.");

  // Import Firebase functions
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    doc,
    increment,
    deleteDoc
  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

  // Your Firebase configuration (replace with your actual config)
  const firebaseConfig = {
    apiKey: "AIzaSyCiLppMzhF6qdVNfAl-OU9tsCBXmpODOw4",
    authDomain: "group-outing.firebaseapp.com",
    projectId: "group-outing",
    storageBucket: "group-outing.firebasestorage.app",
    messagingSenderId: "819308473489",
    appId: "1:819308473489:web:e7035118c4ec461143a330"
  };

  // Initialize Firebase and Firestore
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Add a new idea
  window.addIdea = async function() {
    const ideaInput = document.getElementById("idea-input");
    const ideaText = ideaInput.value.trim();

    if (ideaText) {
      console.log("Adding idea:", ideaText);
      try {
        await addDoc(collection(db, "ideas"), { text: ideaText, votes: 0 });
        ideaInput.value = "";
        await renderIdeas();
      } catch (error) {
        console.error("Error adding idea:", error);
      }
    }
  };

  // Render ideas sorted by votes descending
  window.renderIdeas = async function() {
    console.log("renderIdeas called");
    const ideaList = document.getElementById("idea-list");
    ideaList.innerHTML = "";

    try {
      const querySnapshot = await getDocs(collection(db, "ideas"));
      const ideasArray = [];

      querySnapshot.forEach((doc) => {
        const idea = doc.data();
        ideasArray.push({ id: doc.id, ...idea });
      });

      console.log("Fetched ideas:", ideasArray);

      // Sort descending by votes
      ideasArray.sort((a, b) => b.votes - a.votes);

      console.log("Sorted ideas:", ideasArray);

      ideasArray.forEach((idea) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <span>${idea.text} (Votes: ${idea.votes})</span>
          <div>
            <button onclick="upvote('${idea.id}')">Upvote</button>
            <button onclick="downvote('${idea.id}')">Downvote</button>
            <button onclick="deleteIdea('${idea.id}')">Delete</button>
          </div>
        `;
        ideaList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching/rendering ideas:", error);
    }
  };

  // Upvote an idea
  window.upvote = async function(id) {
    console.log("Upvoting idea with ID:", id);
    try {
      const ideaRef = doc(db, "ideas", id);
      await updateDoc(ideaRef, { votes: increment(1) });
      await renderIdeas();
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  // Downvote an idea
  window.downvote = async function(id) {
    console.log("Downvoting idea with ID:", id);
    try {
      const ideaRef = doc(db, "ideas", id);
      await updateDoc(ideaRef, { votes: increment(-1) });
      await renderIdeas();
    } catch (error) {
      console.error("Error downvoting:", error);
    }
  };

  // Delete an idea
  window.deleteIdea = async function(id) {
    console.log("Deleting idea with ID:", id);
    try {
      const ideaRef = doc(db, "ideas", id);
      await deleteDoc(ideaRef);
      await renderIdeas();
    } catch (error) {
      console.error("Error deleting idea:", error);
    }
  };

  // Initial load of ideas
  renderIdeas();
</script>
