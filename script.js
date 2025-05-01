<script type="module">
    // Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, increment, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyCiLppMzhF6qdVNfAl-OU9tsCBXmpODOw4",
        authDomain: "group-outing.firebaseapp.com",
        projectId: "group-outing",
        storageBucket: "group-outing.firebasestorage.app",
        messagingSenderId: "819308473489",
        appId: "1:819308473489:web:e7035118c4ec461143a330"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // Function to add an idea
    window.addIdea = async function() {
        const ideaInput = document.getElementById('idea-input');
        const ideaText = ideaInput.value.trim();

        if (ideaText) {
            const newIdea = { text: ideaText, votes: 0 };
            await addDoc(collection(db, "ideas"), newIdea);
            ideaInput.value = '';
            await renderIdeas(); // Call renderIdeas after adding
        }
    };

    // Function to render ideas
    window.renderIdeas = async function() {
        console.log("renderIdeas function called"); // Log to check if this is called
        const ideaList = document.getElementById('idea-list');
        ideaList.innerHTML = '';

        // Fetch ideas from Firestore
        const querySnapshot = await getDocs(collection(db, "ideas"));
        const ideasArray = [];

        // Populate the array with ideas and their IDs
        querySnapshot.forEach((doc) => {
            const idea = doc.data();
            ideasArray.push({ id: doc.id, ...idea }); // Push the idea along with its ID
        });

        console.log("Fetched Ideas:", ideasArray); // Log fetched ideas

        // Sort ideas by votes in descending order
        ideasArray.sort((a, b) => b.votes - a.votes);
        console.log("Sorted Ideas:", ideasArray); // Log sorted ideas

        // Render sorted ideas
        ideasArray.forEach((idea) => {
            const li = document.createElement('li');
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
    };

    // Function to upvote an idea
    window.upvote = async function(id) {
        console.log(`Upvoting idea with ID: ${id}`); // Log the ID being upvoted
        const ideaRef = doc(db, "ideas", id);
        await updateDoc(ideaRef, {
            votes: increment(1) // Increment votes
        });
        await renderIdeas(); // Call renderIdeas to refresh the list
    };

    // Function to downvote an idea
    window.downvote = async function(id) {
        console.log(`Downvoting idea with ID: ${id}`); // Log the ID being downvoted
        const ideaRef = doc(db, "ideas", id);
        await updateDoc(ideaRef, {
            votes: increment(-1) // Decrement votes
        });
        await renderIdeas(); // Call renderIdeas to refresh the list
    };

    // Function to delete an idea
    window.deleteIdea = async function(id) {
        const ideaRef = doc(db, "ideas", id);
        await deleteDoc(ideaRef); // Delete the document from Firestore
        await renderIdeas(); // Re-render the ideas list
    };

    // Load ideas on initial load
    renderIdeas();
</script>
