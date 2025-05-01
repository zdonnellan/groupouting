<script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
    import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, increment, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

    const firebaseConfig = {
        apiKey: "AIzaSyCiLppMzhF6qdVNfAl-OU9tsCBXmpODOw4",
        authDomain: "group-outing.firebaseapp.com",
        projectId: "group-outing",
        storageBucket: "group-outing.firebasestorage.app",
        messagingSenderId: "819308473489",
        appId: "1:819308473489:web:e7035118c4ec461143a330"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    window.addIdea = async function() {
        const ideaInput = document.getElementById('idea-input');
        const ideaText = ideaInput.value.trim();

        if (ideaText) {
            const newIdea = { text: ideaText, votes: 0 };
            await addDoc(collection(db, "ideas"), newIdea);
            ideaInput.value = '';
            renderIdeas(); // Call renderIdeas after adding
        }
    };

    window.renderIdeas = async function() {
        console.log("renderIdeas function called"); // Check if this log appears
        const ideaList = document.getElementById('idea-list');
        ideaList.innerHTML = '';

        const querySnapshot = await getDocs(collection(db, "ideas"));
        const ideasArray = [];

        querySnapshot.forEach((doc) => {
            const idea = doc.data();
            ideasArray.push({ id: doc.id, ...idea });
        });

        console.log("Fetched Ideas:", ideasArray); // Log fetched ideas

        console.log("Before Sorting:", ideasArray);
        ideasArray.sort((a, b) => b.votes - a.votes);
        console.log("After Sorting:", ideasArray); // Log sorted ideas

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

    window.upvote = async function(id) {
        console.log(`Upvoting idea with ID: ${id}`); // Log the ID being upvoted
        const ideaRef = doc(db, "ideas", id);
        await updateDoc(ideaRef, {
            votes: increment(1)
        });
        renderIdeas(); // Call renderIdeas to refresh the list
    };

    window.downvote = async function(id) {
        console.log(`Downvoting idea with ID: ${id}`); // Log the ID being downvoted
        const ideaRef = doc(db, "ideas", id);
        await updateDoc(ideaRef, {
            votes: increment(-1)
        });
        renderIdeas(); // Call renderIdeas to refresh the list
    };

    window.deleteIdea = async function(id) {
        const ideaRef = doc(db, "ideas", id);
        await deleteDoc(ideaRef);
        renderIdeas(); // Re-render the ideas list
    };

    // Load ideas on initial load
    renderIdeas();
</script>
