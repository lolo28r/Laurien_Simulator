import { gameData } from './gamedata.js';
import { UI } from './ui.js';

let lastThreshold = -1;
let eventTriggered = false;

function init() {
    // 1. Initialisation UI (Ordre important : Listeners d'abord)
    UI.initGlobalListeners();

    const saved = localStorage.getItem('laurien_save');

    if (saved) {
        loadGame();
        UI.hideIntro();
        updateAll();
    } else {
        UI.initIntro((name, gender) => {
            gameData.playerName = name;
            gameData.playerGender = gender;
            updateAll();
        });
    }

    // 2. LISTENERS DU BOUTON PRINCIPAL
    const laurienBtn = document.getElementById('laurien-btn');
    laurienBtn.addEventListener('click', () => {
        gameData.lp += 1;
        gameData.totalLp += 1;

        // Petit effet visuel au clic
        laurienBtn.style.transform = 'scale(0.9) rotate(5deg)';
        setTimeout(() => laurienBtn.style.transform = 'scale(1) rotate(0deg)', 50);

        checkEvents();
        updateAll();
    });

    document.getElementById('save-btn').addEventListener('click', saveGame);
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', deleteProgress);

    // 3. BOUCLE DE PRODUCTION (1 seconde)
    setInterval(() => {
        let totalProd = 0;
        gameData.upgrades.forEach(upg => totalProd += upg.count * upg.baseProduction);

        if (totalProd > 0) {
            gameData.lp += totalProd;
            gameData.totalLp += totalProd;
            checkEvents();
            updateAll();
        }

        const psDisplay = document.getElementById('lp-ps');
        if (psDisplay) psDisplay.innerText = totalProd.toFixed(1);
    }, 1000);
}

function checkEvents() {
    // Événement spécial des 200 LP
    if (gameData.totalLp >= 200 && !eventTriggered) {
        eventTriggered = true;
        gameData.lp += 6000;
        gameData.totalLp += 6000;
        UI.queueDialogues([
            "Allez régale toi."

        ]);
        updateAll();
    }
}

function saveGame() {
    const saveData = {
        lp: gameData.lp,
        totalLp: gameData.totalLp,
        playerName: gameData.playerName,
        playerGender: gameData.playerGender,
        eventTriggered: eventTriggered,
        lastThreshold: lastThreshold, // On sauve le palier pour éviter de répéter les dialogues
        upgrades: gameData.upgrades.map(u => ({ id: u.id, count: u.count, cost: u.baseCost }))
    };
    localStorage.setItem('laurien_save', JSON.stringify(saveData));
    alert("Partie sauvegardée, Laurien se souviendra de toi !");
}

function loadGame() {
    const saved = localStorage.getItem('laurien_save');
    if (saved) {
        const data = JSON.parse(saved);
        gameData.lp = data.lp;
        gameData.totalLp = data.totalLp;
        gameData.playerName = data.playerName;
        gameData.playerGender = data.playerGender;
        eventTriggered = data.eventTriggered || false;
        lastThreshold = data.lastThreshold || -1; // On restaure le dernier palier vu

        data.upgrades.forEach(savedUpg => {
            const upg = gameData.upgrades.find(u => u.id === savedUpg.id);
            if (upg) {
                upg.count = savedUpg.count;
                upg.baseCost = savedUpg.cost;
            }
        });
    }
}

function deleteProgress() {
    if (confirm("Tu veux vraiment tout effacer ? Laurien va t'oublier...")) {
        localStorage.removeItem('laurien_save');
        location.reload();
    }
}

function updateAll() {
    UI.update(gameData.lp, gameData.totalLp);
    checkStory();
    refreshShop();
}

function refreshShop() {
    UI.renderShop(gameData.upgrades, gameData.lp, gameData.totalLp, (clickedUpg) => {
        if (gameData.lp >= clickedUpg.baseCost) {
            gameData.lp -= clickedUpg.baseCost;
            clickedUpg.count++;
            clickedUpg.baseCost = Math.ceil(clickedUpg.baseCost * 1.15);
            updateAll();
        }
    });
}

function checkStory() {
    const currentStory = [...gameData.story]
        .reverse()
        .find(s => gameData.totalLp >= s.threshold);

    if (currentStory && currentStory.threshold > lastThreshold) {
        lastThreshold = currentStory.threshold;
        UI.queueDialogues(currentStory.text(gameData.playerName, gameData.playerGender));
    }
}

init();