// ================= LOGIN REDIRECT =================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        window.location.href = "home.html";
    });
}

// ================= ELEMENTS =================
const skillsContainer = document.getElementById("skillsContainer");
const matchesContainer = document.getElementById("matchesContainer");
const skillForm = document.getElementById("skillForm");
const searchInput = document.getElementById("searchInput");

// ================= LOAD DATA =================
let skills = JSON.parse(localStorage.getItem("skills")) || [];
let currentUserSkill = JSON.parse(localStorage.getItem("currentUserSkill"));

// ================= SAVE FUNCTION =================
function saveData() {
    localStorage.setItem("skills", JSON.stringify(skills));
}

// ================= DISPLAY SKILLS =================
function displaySkills(filtered = skills) {
    if (!skillsContainer) return;

    skillsContainer.innerHTML = "";

    if (filtered.length === 0) {
        skillsContainer.innerHTML = "<p>No skills found</p>";
        return;
    }

    filtered.forEach((s, index) => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${s.name}</h3>
            <p><strong>Skill:</strong> ${s.skill}</p>
            <p><strong>Type:</strong> ${s.type}</p>
            <p><strong>Level:</strong> ${s.level}</p>
            <button onclick="deleteSkill(${index})">Delete</button>
        `;

        skillsContainer.appendChild(card);
    });
}

// ================= DELETE SKILL =================
function deleteSkill(index) {
    skills.splice(index, 1);
    saveData();

    // Remove stored match if deleted
    localStorage.removeItem("currentUserSkill");
    currentUserSkill = null;

    displaySkills();
    matchesContainer.innerHTML = "";
}

// ================= MATCHING SYSTEM =================
function findMatches() {
    if (!matchesContainer || !currentUserSkill) return;

    matchesContainer.innerHTML = "";

    const matches = skills.filter(s =>
        s.skill.toLowerCase() === currentUserSkill.skill.toLowerCase() &&
        s.type !== currentUserSkill.type
    );

    if (matches.length === 0) {
        matchesContainer.innerHTML = "<p>No matches found</p>";
        return;
    }

    matches.forEach(m => {
        let score = 50;

        if (m.level === currentUserSkill.level) score += 30;
        if (m.type !== currentUserSkill.type) score += 20;

        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <h3>${m.name}</h3>
            <p><strong>Skill:</strong> ${m.skill}</p>
            <p><strong>Level:</strong> ${m.level}</p>
            <p><strong>Match:</strong> ${score}%</p>
            <button onclick="alert('Request Sent!')">Connect</button>
        `;

        matchesContainer.appendChild(card);
    });
}

// ================= ADD SKILL =================
if (skillForm) {
    skillForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const newSkill = {
            name: document.getElementById("name").value,
            skill: document.getElementById("skill").value,
            type: document.getElementById("type").value,
            level: document.getElementById("level").value
        };

        skills.push(newSkill);

        // Save current skill for matching
        currentUserSkill = newSkill;
        localStorage.setItem("currentUserSkill", JSON.stringify(newSkill));

        saveData();
        displaySkills();
        findMatches();

        skillForm.reset();
    });
}

// ================= SEARCH =================
if (searchInput) {
    searchInput.addEventListener("input", function() {
        const value = searchInput.value.toLowerCase();

        const filtered = skills.filter(s =>
            s.skill.toLowerCase().includes(value)
        );

        displaySkills(filtered);
    });
}

// ================= INITIAL LOAD =================
displaySkills();
findMatches();