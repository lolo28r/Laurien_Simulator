import { gameData } from './gamedata.js';
import { UI } from './ui.js';

let lastThreshold = -1;
let eventTriggered = false;
let liamEventTriggered = false;
let sebEventTriggered = false;
let battleActive = false;
let liamHP = 100;
let laurienHP = 100;

// --- GESTION AUDIO ---
const audioManager = {
    sfx: {
        buy: new Audio('buy.mp3'),
        victory: new Audio('victory.mp3')
    },
    bgm: {
        battle: new Audio('battle.mp3'),
        street: new Audio('street.mp3') // Ajouté pour Seb
    },
    playSFX(name) {
        if (!this.sfx[name]) return;
        this.sfx[name].currentTime = 0;
        this.sfx[name].play().catch(e => console.log("Audio bloqué"));
    },
    startMusic(name) {
        if (!this.bgm[name]) return;
        this.bgm[name].loop = true;
        this.bgm[name].volume = 0.5;
        this.bgm[name].play().catch(e => console.log("Musique bloquée"));
    },
    stopMusic(name) {
        if (!this.bgm[name]) return;
        this.bgm[name].pause();
        this.bgm[name].currentTime = 0;
    }
};

// --- GESTION DES SPRITES ---
function setLiamSprite(name) {
    const liamImg = document.querySelector('#liam-sprite img');
    if (liamImg) {
        const src = name.includes('.') ? name : `${name}.png`;
        liamImg.src = src;
    }
}

function init() {
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

    // --- CLIC PRINCIPAL ---
    document.getElementById('laurien-btn').addEventListener('click', () => {
        if (document.body.classList.contains('is-talking') || battleActive) return;

        const gain = 1 * (gameData.clickModifier || 1);
        gameData.lp += gain;
        gameData.totalLp += gain;

        checkEvents();
        updateAll();
    });

    // --- BOUTON ACTIONS COMBAT ---
    const actionBtn = document.getElementById('show-actions-btn');
    if (actionBtn) {
        actionBtn.addEventListener('click', () => {
            actionBtn.style.display = "none";
            document.getElementById('battle-menu').style.display = "grid";
        });
    }

    // --- BOUTONS SYSTÈME ---
    document.getElementById('save-btn').addEventListener('click', saveGame);
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm("Reset la partie ?")) {
            localStorage.removeItem('laurien_save');
            location.reload();
        }
    });

    // --- PRODUCTION PASSIVE ---
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
    if (gameData.lp >= 200 && !eventTriggered) {
        eventTriggered = true;
        gameData.lp += 6000;
        gameData.totalLp += 6000;
        UI.queueDialogues(["Tiens, prends ça et va t'acheter une binouze !"]);
        updateAll();
    }

    const binouze = gameData.upgrades.find(u => u.id === 'binouze');
    if (binouze && binouze.count > 0 && !liamEventTriggered) {
        liamEventTriggered = true;
        startLiamEncounter();
    }

    const invest = gameData.upgrades.find(u => u.id === 'invest_israel');
    if (invest && invest.count > 0 && !sebEventTriggered) {
        sebEventTriggered = true;
        startSebScene();
    }
}

// --- SCÈNE SEB (NARRATIVE) ---
function startSebScene() {
    battleActive = true;
    audioManager.startMusic('street');
    const screen = document.getElementById('liam-event-screen');
    const diag = document.getElementById('liam-event-dialogue');
    const bg = document.getElementById('liam-encounter-bg');

    const actionBtn = document.getElementById('show-actions-btn');
    const battleMenu = document.getElementById('battle-menu');
    const healthBars = document.querySelectorAll('.health-bar, #liam-hp, #laurien-hp, .hp-container');

    if (actionBtn) actionBtn.style.display = "none";
    if (battleMenu) battleMenu.style.display = "none";
    healthBars.forEach(bar => bar.style.display = "none");

    bg.style.backgroundImage = "url('telaviv.jpg')";
    setLiamSprite('sebjuif');

    screen.classList.add('active');
    bg.classList.add('visible');

    diag.innerText = "Shalom ! Je suis juif !";

    setTimeout(() => {
        diag.innerText = "J'apparais sur les fichiers Epstein, alors je suis venu ici, c'est le paradis !";

        setTimeout(() => {
            diag.innerText = "[A suivre...]";

            setTimeout(() => {
                audioManager.stopMusic('street');
                screen.classList.remove('active');
                healthBars.forEach(bar => bar.style.display = "");
                battleActive = false;
                gameData.clickModifier = 10;
                updateAll();
                saveGame();
            }, 3000);
        }, 4000);
    }, 4000);
}

// --- COMBAT LIAM (FORET) ---
function startLiamEncounter() {
    battleActive = true;
    audioManager.startMusic('battle');
    liamHP = 100; laurienHP = 100;
    const screen = document.getElementById('liam-event-screen');
    const diag = document.getElementById('liam-event-dialogue');
    const bg = document.getElementById('liam-encounter-bg');

    const healthBars = document.querySelectorAll('.health-bar, #liam-hp, #laurien-hp');
    healthBars.forEach(bar => bar.style.display = "block");

    bg.style.backgroundImage = "url('forêt.png')";
    setLiamSprite('liamfache');

    screen.classList.add('active');
    diag.innerText = "Mais... c'est quoi ce bruit ?";

    setTimeout(() => {
        bg.classList.add('visible');
        diag.innerText = "L'odeur de la bière a attiré un Irlandais sauvage ! C'EST LIAM !";

        setTimeout(() => {
            updateBattleUI();
            diag.innerText = "LIAM veut ta bière ! Défends-toi !";
            const actionBtn = document.getElementById('show-actions-btn');
            if (actionBtn) actionBtn.style.display = "block";
        }, 2000);
    }, 2000);
}

// --- LOGIQUE DE COMBAT ---
window.battleAction = function (type) {
    if (!battleActive) return;
    const diag = document.getElementById('liam-event-dialogue');
    document.getElementById('battle-menu').style.display = "none";

    if (type === 'attack' || type === 'kick') {
        let dmg = type === 'attack' ? Math.floor(Math.random() * 10) + 10 : Math.floor(Math.random() * 25) + 5;
        liamHP -= dmg;
        diag.innerText = type === 'attack' ? `Tacle d'épaule ! Liam perd ${dmg} HP.` : `Coup de savate ! Liam encaisse ${dmg} HP.`;
    } else if (type === 'protect') {
        diag.innerText = "Défense augmentée !";
        window.isProtected = true;
    } else if (type === 'pity') {
        diag.innerText = "Tu partages ta bière... Liam est ému.";
        setTimeout(() => victory(true), 2000);
        return;
    }

    updateBattleUI();

    if (liamHP > 0 && liamHP <= 20) {
        const pityBtn = document.getElementById('pity-btn');
        if (pityBtn) pityBtn.style.display = "block";
    }

    setTimeout(() => {
        if (liamHP <= 0) victory(false);
        else liamTurn();
    }, 1500);
};

function liamTurn() {
    const diag = document.getElementById('liam-event-dialogue');
    let dmg = Math.floor(Math.random() * 15) + 5;
    if (window.isProtected) { dmg = Math.floor(dmg / 2); window.isProtected = false; }
    laurienHP -= dmg;
    diag.innerText = `Liam utilise "Soif Irlandaise" ! -${dmg} HP.`;
    updateBattleUI();

    setTimeout(() => {
        if (laurienHP <= 0) {
            diag.innerText = "Liam repart avec la bière...";
            setTimeout(() => location.reload(), 3000);
        } else {
            diag.innerText = "À ton tour !";
            document.getElementById('show-actions-btn').style.display = "block";
        }
    }, 1500);
}

function victory(byPity) {
    battleActive = false;
    audioManager.stopMusic('battle');
    audioManager.playSFX('victory');
    const diag = document.getElementById('liam-event-dialogue');

    if (byPity) {
        setLiamSprite('liambiere');
        diag.innerText = "Liam est aux anges ! Il devient ton allié. Chaque clic rapporte 5 LP.";
        gameData.clickModifier = 5;
    } else {
        diag.innerText = "Liam est K.O. ! Tu récupères son butin. +10 000 LP.";
        gameData.lp += 10000;
        gameData.totalLp += 10000;
    }

    setTimeout(() => {
        document.getElementById('liam-event-screen').classList.remove('active');
        audioManager.sfx.victory.pause();
        audioManager.sfx.victory.currentTime = 0;
        updateAll();
        saveGame();
    }, 3000);
}

function updateBattleUI() {
    const lFill = document.getElementById('liam-hp');
    const pFill = document.getElementById('laurien-hp');
    if (lFill) lFill.style.width = Math.max(0, liamHP) + "%";
    if (pFill) pFill.style.width = Math.max(0, laurienHP) + "%";
}

// --- SYSTÈME DE SAUVEGARDE ---
function saveGame() {
    const data = {
        lp: gameData.lp,
        totalLp: gameData.totalLp,
        liamEventTriggered,
        sebEventTriggered,
        clickModifier: gameData.clickModifier,
        upgrades: gameData.upgrades,
        playerName: gameData.playerName,
        playerGender: gameData.playerGender
    };
    localStorage.setItem('laurien_save', JSON.stringify(data));
}

function loadGame() {
    const saved = JSON.parse(localStorage.getItem('laurien_save'));
    if (saved) {
        Object.assign(gameData, saved);
        liamEventTriggered = saved.liamEventTriggered || false;
        sebEventTriggered = saved.sebEventTriggered || false;
    }
}

function updateAll() {
    UI.update(gameData.lp, gameData.totalLp);
    refreshShop();
    checkStory();
}

function refreshShop() {
    UI.renderShop(gameData.upgrades, gameData.lp, gameData.totalLp, (u) => {
        if (gameData.lp >= u.baseCost) {
            audioManager.playSFX('buy');
            gameData.lp -= u.baseCost;
            u.count++;
            u.baseCost = Math.ceil(u.baseCost * 1.15);
            updateAll();
        }
    });
}

function checkStory() {
    if (!gameData.story) return;
    const currentStory = [...gameData.story].reverse().find(s => gameData.lp >= s.threshold);
    if (currentStory && currentStory.threshold > lastThreshold) {
        lastThreshold = currentStory.threshold;
        UI.queueDialogues(currentStory.text(gameData.playerName, gameData.playerGender));
    }
}

init();