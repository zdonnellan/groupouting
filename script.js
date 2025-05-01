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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let userVotes = {}; // To track user votes

async function addIdea() {
    const ideaInput = document.getElementById('idea-input');
    const ideaText = ideaInput.value.trim();

    if (ideaText) {
        const newIdea = { text: ideaText, votes: 0 };
        await db.collection('ideas').add(newIdea);
        ideaInput.value = '';
        renderIdeas();
    }
}

async function upvote(id) {
    const userId = getUserId(); // You need a way to identify users
    if (!userVotes[userId]) userVotes[userId] = {};

    if (!userVotes[userId][id]) {
        await db.collection('ideas').doc(id).update({
            votes: firebase.firestore.FieldValue.increment(1)
        });
        userVotes[userId][id] = true; // Mark this idea as voted by the user
        renderIdeas();
    } else {
        alert("You've already voted for this idea.");
    }
}

async function downvote(id) {
    const userId = getUserId(); // You need a way to identify users
    if (!userVotes[userId]) userVotes[userId] = {};

    if (!userVotes[userId][id]) {
        await db.collection('ideas').doc(id).update({
            votes: firebase.firestore.FieldValue.increment(-1)
        });
        userVotes[userId][id] = true; // Mark this idea as voted by the user
        renderIdeas();
    } else {
        alert("You've already voted for this idea.");
    }
}

async function renderIdeas() {
    const ideaList = document.getElementById('idea-list');
    ideaList.innerHTML = '';

    const snapshot = await db.collection('ideas').orderBy('votes', 'desc').get();
    snapshot.forEach(doc => {
        const idea = doc.data();
        const id = doc.id;
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${idea.text} (Votes: ${idea.votes})</span>
            <div>
                <button onclick="upvote('${id}')">Upvote</button>
                <button onclick="downvote('${id}')">Downvote</button>
            </div>
        `;
        ideaList.appendChild(li);
    });
}

// Function to get a unique user ID (for demo purposes)
function getUserId() {
    // In a real application, you would implement user authentication and get a unique ID
    return 'user1'; // Replace this with actual user identification logic
}

// Load ideas on initial load
renderIdeas();