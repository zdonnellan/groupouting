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

    window.addIdea = async function() {
        const ideaInput = document.getElementById('idea-input');
        const ideaText = ideaInput.value.trim();

        if (ideaText) {
            const newIdea = { text: ideaText, votes: 0 };
            await addDoc(collection(db, "ideas"), newIdea);
            ideaInput.value = '';
            renderIdeas();
        }
    };

    window.renderIdeas = async function() {
        const ideaList = document.getElementById('idea-list');
        ideaList.innerHTML = '';
        
        // Fetch ideas from Firestore
        const querySnapshot = await getDocs(collection(db, "ideas"));
        
        // Create an array to hold ideas
        const ideasArray = [];
        
        // Populate the array with ideas and their IDs
        querySnapshot.forEach((doc) => {
            const idea = doc.data();
            ideasArray.push({ id: doc.id, ...idea }); // Push the idea along with its ID
        });
        console.log(ideasArray); // Check the fetched ideas
        
        // Sort ideas by votes in descending order
        ideasArray.sort((a, b) => b.votes - a.votes);
        
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

    window.upvote = async function(id) {
        const ideaRef = doc(db, "ideas", id);
        await updateDoc(ideaRef, {
            votes: increment(1)
        });
        renderIdeas();
    };

    window.downvote = async function(id) {
        const ideaRef = doc(db, "ideas", id);
        await updateDoc(ideaRef, {
            votes: increment(-1)
        });
        renderIdeas();
    };

    window.deleteIdea = async function(id) {
        const ideaRef = doc(db, "ideas", id);
        await deleteDoc(ideaRef); // Delete the document from Firestore
        renderIdeas(); // Re-render the ideas list
    };

    // Load ideas on initial load
    renderIdeas();
</script>
