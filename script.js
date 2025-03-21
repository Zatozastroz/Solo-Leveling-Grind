// Player Data
let player = {
    rank: "Shadow Initiate",
    level: 1,
    xp: 0,
    maxXp: 100,
    stats: {
        sleep: 0,
        study: 0,
        workout: 0,
        economics: 0,
        businessAnalytics: 0,
        spreadsheet: 0,
        financialManagement: 0,
        english: 0
    },
    completed: {
        total: 0,
        daily: 0,
        exam: 0
    }
};

// Quest Pools
let dailyQuestPool = [
    { id: 1, name: "Sleep Discipline: Sleep by 11 PM", xp: 5, stat: "sleep", value: 7, done: false },
    { id: 2, name: "Morning Warm-Up: 15-min workout", xp: 10, stat: "workout", value: 15, done: false },
    { id: 3, name: "Focus Sprint: 1 hour of study", xp: 15, stat: "study", value: 1, done: false },
    { id: 4, name: "Hydration Check: Drink 2L water", xp: 5, stat: "workout", value: 5, done: false },
    { id: 5, name: "Mind Reset: 10-min meditation", xp: 10, stat: "sleep", value: 1, done: false }
];

let examQuests = [
    { id: 6, name: "Market Mastery: Summarize 2 Economics chapters", xp: 20, stat: "economics", value: 10, done: false },
    { id: 7, name: "Data Hunt: Solve 5 Analytics problems", xp: 25, stat: "businessAnalytics", value: 10, done: false },
    { id: 8, name: "Excel Grind: Build 1 Spreadsheet model", xp: 30, stat: "spreadsheet", value: 10, done: false },
    { id: 9, name: "Capital Clash: Memorize 10 Finance formulas", xp: 25, stat: "financialManagement", value: 10, done: false },
    { id: 10, name: "Word Forge: Write a 300-word English essay", xp: 20, stat: "english", value: 10, done: false }
];

let nextQuestId = 11;
let currentDailyQuests = [];

// Titles
const ranks = [
    { level: 1, title: "Shadow Initiate" },
    { level: 5, title: "Gate Walker" },
    { level: 10, title: "Dungeon Slayer" }
];

// Motivation Quotes
const goodQuotes = [
    "You tried, there’s still left inside you—keep pushing.",
    "The shadows bow to your will—rise higher.",
    "You’ve carved a step forward—unbreakable."
];
const badQuotes = [
    "You can’t do this? You better throw yourself into the void.",
    "Weakness festers—get up or rot.",
    "Failed again? The gate spits on you."
];

// DOM Elements
const dailyQuestList = document.getElementById("daily-quest-list");
const examQuestList = document.getElementById("exam-quest-list");
const motivationText = document.getElementById("motivation-text");
const penaltyText = document.getElementById("penalty-text");
const rankDisplay = document.getElementById("rank");
const levelDisplay = document.getElementById("level");
const xpDisplay = document.getElementById("xp");
const maxXpDisplay = document.getElementById("max-xp");
const xpBar = document.getElementById("xp-bar");
const statsDisplay = {
    sleep: document.getElementById("sleep-progress"),
    study: document.getElementById("study-progress"),
    workout: document.getElementById("workout-progress"),
    economics: document.getElementById("econ-progress"),
    businessAnalytics: document.getElementById("ba-progress"),
    spreadsheet: document.getElementById("ss-progress"),
    financialManagement: document.getElementById("fm-progress"),
    english: document.getElementById("eng-progress")
};
const statBars = {
    sleep: document.getElementById("sleep-bar"),
    study: document.getElementById("study-bar"),
    workout: document.getElementById("workout-bar"),
    economics: document.getElementById("econ-bar"),
    businessAnalytics: document.getElementById("ba-bar"),
    spreadsheet: document.getElementById("ss-bar"),
    financialManagement: document.getElementById("fm-bar"),
    english: document.getElementById("eng-bar")
};
const progressionDisplay = {
    total: document.getElementById("total-completed"),
    daily: document.getElementById("daily-completed"),
    exam: document.getElementById("exam-completed")
};
const alertPopup = document.getElementById("level-up-alert");
const newLevel = document.getElementById("new-level");
const newTitle = document.getElementById("new-title");
const countdown = document.getElementById("countdown");

// Load Quests
function loadQuests() {
    dailyQuestList.innerHTML = "";
    examQuestList.innerHTML = "";

    if (currentDailyQuests.length === 0) {
        currentDailyQuests = [...dailyQuestPool].sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    currentDailyQuests.forEach(quest => {
        const li = document.createElement("li");
        li.classList.add("quest-item");
        li.innerHTML = `${quest.name} (+${quest.xp} XP) 
            <button onclick="completeQuest(${quest.id}, 'daily')" ${quest.done ? "disabled" : ""}>${quest.done ? "Done" : "Complete"}</button>
            <button onclick="skipQuest(${quest.id}, 'daily')" ${quest.done ? "disabled" : ""}>Skip</button>`;
        dailyQuestList.appendChild(li);
    });

    examQuests.forEach(quest => {
        const li = document.createElement("li");
        li.classList.add("quest-item");
        li.innerHTML = `${quest.name} (+${quest.xp} XP) 
            <button onclick="completeQuest(${quest.id}, 'exam')" ${quest.done ? "disabled" : ""}>${quest.done ? "Done" : "Complete"}</button>
            <button onclick="skipQuest(${quest.id}, 'exam')" ${quest.done ? "disabled" : ""}>Skip</button>
            <span class="settings-icon" onclick="toggleSettings(${quest.id})">⚙️</span>
            <div id="settings-${quest.id}" class="settings-dropdown">
                <button onclick="editQuest(${quest.id})">Edit</button>
                <button onclick="deleteQuest(${quest.id})">Delete</button>
            </div>`;
        examQuestList.appendChild(li);
    });
}

// Complete Quest
function completeQuest(questId, type) {
    const quest = (type === "daily" ? currentDailyQuests : examQuests).find(q => q.id === questId);
    if (!quest || quest.done) return;

    quest.done = true;
    player.xp += quest.xp;
    player.stats[quest.stat] += quest.value;
    player.completed.total += 1;
    player.completed[type === "daily" ? "daily" : "exam"] += 1;

    let leveledUp = false;
    if (player.xp >= player.maxXp) {
        player.level += 1;
        player.xp -= player.maxXp;
        player.maxXp += 50;
        const newRank = ranks.find(r => r.level === player.level);
        if (newRank) {
            player.rank = newRank.title;
            leveledUp = true;
        }
    }

    updateUI();
    motivationText.textContent = goodQuotes[Math.floor(Math.random() * goodQuotes.length)];
    penaltyText.style.display = "none";

    if (leveledUp) {
        newLevel.textContent = player.level;
        newTitle.textContent = player.rank;
        alertPopup.style.display = "block";
    }

    if (Notification.permission === "granted") {
        new Notification(`Quest Completed: ${quest.name}`);
    }
}

// Skip Quest
function skipQuest(questId, type) {
    const quest = (type === "daily" ? currentDailyQuests : examQuests).find(q => q.id === questId);
    if (!quest || quest.done) return;

    quest.done = true;
    motivationText.textContent = badQuotes[Math.floor(Math.random() * badQuotes.length)];
    penaltyText.style.display = "block";
    updateUI();
}

// Reset Daily Quests
function resetDailyQuests() {
    currentDailyQuests.forEach(quest => {
        const original = dailyQuestPool.find(q => q.id === quest.id);
        original.done = false;
        quest.done = false;
    });
    updateUI();
}

// Add/Edit/Delete Quests
function addQuest() {
    const name = document.getElementById("new-quest-name").value;
    const xp = parseInt(document.getElementById("new-quest-xp").value);
    const stat = document.getElementById("new-quest-stat").value;
    if (name && xp) {
        examQuests.push({ id: nextQuestId++, name, xp, stat, value: 10, done: false });
        loadQuests();
        document.getElementById("new-quest-name").value = "";
        document.getElementById("new-quest-xp").value = "";
    }
}

function editQuest(questId) {
    const quest = examQuests.find(q => q.id === questId);
    const newName = prompt("Edit quest name:", quest.name);
    const newXp = parseInt(prompt("Edit XP:", quest.xp));
    if (newName && newXp) {
        quest.name = newName;
        quest.xp = newXp;
        loadQuests();
    }
}

function deleteQuest(questId) {
    examQuests = examQuests.filter(q => q.id !== questId);
    loadQuests();
}

function toggleSettings(questId) {
    const dropdown = document.getElementById(`settings-${questId}`);
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Update UI
function updateUI() {
    rankDisplay.textContent = player.rank;
    levelDisplay.textContent = player.level;
    xpDisplay.textContent = player.xp;
    maxXpDisplay.textContent = player.maxXp;
    xpBar.style.width = `${(player.xp / player.maxXp) * 100}%`;

    statsDisplay.sleep.textContent = `${player.stats.sleep} hours`;
    statsDisplay.study.textContent = `${player.stats.study} hours`;
    statsDisplay.workout.textContent = `${player.stats.workout} mins`;
    statsDisplay.economics.textContent = `${player.stats.economics}%`;
    statsDisplay.businessAnalytics.textContent = `${player.stats.businessAnalytics}%`;
    statsDisplay.spreadsheet.textContent = `${player.stats.spreadsheet}%`;
    statsDisplay.financialManagement.textContent = `${player.stats.financialManagement}%`;
    statsDisplay.english.textContent = `${player.stats.english}%`;

    statBars.sleep.style.width = `${Math.min(player.stats.sleep / 8 * 100, 100)}%`;
    statBars.study.style.width = `${Math.min(player.stats.study / 6 * 100, 100)}%`;
    statBars.workout.style.width = `${Math.min(player.stats.workout / 60 * 100, 100)}%`;
    statBars.economics.style.width = `${player.stats.economics}%`;
    statBars.businessAnalytics.style.width = `${player.stats.businessAnalytics}%`;
    statBars.spreadsheet.style.width = `${player.stats.spreadsheet}%`;
    statBars.financialManagement.style.width = `${player.stats.financialManagement}%`;
    statBars.english.style.width = `${player.stats.english}%`;

    progressionDisplay.total.textContent = player.completed.total;
    progressionDisplay.daily.textContent = player.completed.daily;
    progressionDisplay.exam.textContent = player.completed.exam;

    loadQuests();
}

// Show Page
function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
    document.querySelector(`button[onclick="showPage('${pageId}')"]`).classList.add("active");
}

// Close Alert
function closeAlert() {
    alertPopup.style.display = "none";
}

// Countdown Timer
const endDate = new Date("April 4, 2025 00:00:00").getTime();
function updateCountdown() {
    const now = new Date().getTime();
    const distance = endDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (distance < 0) {
        countdown.textContent = "Time’s up!";
    }
}
setInterval(updateCountdown, 1000);

// Notification Permission
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Initial Load
loadQuests();
updateUI();
updateCountdown();
