let ideas = [];

function addIdea() {
    const ideaInput = document.getElementById('idea-input');
    const ideaText = ideaInput.value.trim();

    if (ideaText) {
        const newIdea = { text: ideaText, votes: 0 };
        ideas.push(newIdea);
        ideaInput.value = '';
        renderIdeas();
    }
}

function upvote(index) {
    ideas[index].votes++;
    renderIdeas();
}

function downvote(index) {
    ideas[index].votes--;
    renderIdeas();
}

function renderIdeas() {
    const ideaList = document.getElementById('idea-list');
    ideaList.innerHTML = '';

    // Sort ideas based on votes
    ideas.sort((a, b) => b.votes - a.votes);

    ideas.forEach((idea, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${idea.text} (Votes: ${idea.votes})</span>
            <div>
                <button onclick="upvote(${index})">Upvote</button>
                <button onclick="downvote(${index})">Downvote</button>
            </div>
        `;
        ideaList.appendChild(li);
    });
}