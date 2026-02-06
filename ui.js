// ui.js - Gestion de l'interface, dialogues Typewriter et Boutique
export const UI = {
    dialogueQueue: [],
    isTyping: false,
    currentMessage: "",
    typewriterTimeout: null,

    hideIntro() {
        const intro = document.getElementById('intro-screen');
        if (intro) intro.classList.add('hidden');
    },

    update(lp, totalLp) {
        const formattedLp = Math.floor(lp);

        // Update tous les compteurs de score (PC + Mobile)
        const mainScore = document.getElementById('lp-count');
        if (mainScore) mainScore.innerText = formattedLp;

        const mobileScore = document.getElementById('lp-count-mobile');
        if (mobileScore) mobileScore.innerText = formattedLp;

        const totalScore = document.getElementById('lp-total');
        if (totalScore) totalScore.innerText = Math.floor(totalLp);
    },

    queueDialogues(messages) {
        this.dialogueQueue.push(...messages);
        if (!document.body.classList.contains('is-talking')) {
            this.startDialogueMode();
        }
    },

    startDialogueMode() {
        document.body.classList.add('is-talking');
        const overlay = document.getElementById('dialogue-overlay');
        const box = document.getElementById('dialogue-box');

        if (overlay) overlay.style.display = 'block';
        if (box) box.style.pointerEvents = 'auto'; // On permet de cliquer sur la box pour passer le texte

        this.showNextDialogue();
    },

    endDialogueMode() {
        document.body.classList.remove('is-talking');
        const overlay = document.getElementById('dialogue-overlay');
        const box = document.getElementById('dialogue-box');

        if (overlay) overlay.style.display = 'none';
        if (box) {
            box.style.pointerEvents = 'none'; // CRUCIAL : On rend la box transparente aux clics pour jouer
            document.getElementById('la-talks-container'); // Petit reset visuel si besoin
        }

        document.getElementById('laurien-talks').innerText = "À toi de jouer !";
    },

    typeWriter(text, i = 0) {
        const box = document.getElementById('laurien-talks');
        this.isTyping = true;
        if (i < text.length) {
            box.innerText = text.substring(0, i + 1) + " ▮";
            this.typewriterTimeout = setTimeout(() => {
                this.typeWriter(text, i + 1);
            }, 30);
        } else {
            this.isTyping = false;
            box.innerText = text + " ▾";
        }
    },

    showNextDialogue() {
        if (this.dialogueQueue.length > 0) {
            this.currentMessage = this.dialogueQueue[0];
            this.typeWriter(this.currentMessage);
        } else {
            this.endDialogueMode();
        }
    },

    initGlobalListeners() {
        // 1. Logique d'avancement des dialogues
        const advanceDialogue = () => {
            if (this.dialogueQueue.length > 0) {
                if (this.isTyping) {
                    clearTimeout(this.typewriterTimeout);
                    this.isTyping = false;
                    document.getElementById('laurien-talks').innerText = this.currentMessage + " ▾";
                } else {
                    this.dialogueQueue.shift();
                    this.showNextDialogue();
                }
            }
        };

        // On clique sur la boîte ou l'overlay pour passer le texte
        const diagBox = document.getElementById('dialogue-box');
        const diagOverlay = document.getElementById('dialogue-overlay');
        if (diagBox) diagBox.addEventListener('click', advanceDialogue);
        if (diagOverlay) diagOverlay.addEventListener('click', advanceDialogue);

        window.addEventListener('keydown', (e) => {
            if ((e.key === "Enter" || e.key === " ") && document.body.classList.contains('is-talking')) {
                advanceDialogue();
            }
        });

        // 2. Navigation Mobile
        const btnStats = document.getElementById('nav-stats');
        const btnGame = document.getElementById('nav-game');
        const btnShop = document.getElementById('nav-shop');

        if (btnStats) btnStats.onclick = () => this.switchTab('left');
        if (btnGame) btnGame.onclick = () => this.switchTab('main');
        if (btnShop) btnShop.onclick = () => this.switchTab('right');

        // Initialisation de l'onglet par défaut sur Mobile
        if (window.innerWidth <= 850) {
            this.switchTab('main');
        }
    },

    initIntro(onComplete) {
        const btn = document.getElementById('start-btn');
        const screen = document.getElementById('intro-screen');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const nameInput = document.getElementById('player-name-input');
            const genderSelect = document.getElementById('player-gender');
            const name = nameInput.value.trim() || "Champion";
            const gender = genderSelect.value;
            if (screen) screen.classList.add('hidden');
            onComplete(name, gender);
        });
    },

    switchTab(tabName) {
        const sections = {
            'left': document.querySelector('.sidebar.left'),
            'main': document.querySelector('.main-clicker'),
            'right': document.querySelector('.sidebar.right')
        };

        // On gère l'affichage des zones
        Object.values(sections).forEach(el => {
            if (el) el.classList.remove('mobile-active');
        });

        if (sections[tabName]) {
            sections[tabName].classList.add('mobile-active');
        }

        // On gère le style des boutons
        const buttons = document.querySelectorAll('.mobile-nav button');
        buttons.forEach(btn => btn.classList.remove('active'));

        if (tabName === 'left' && buttons[0]) buttons[0].classList.add('active');
        if (tabName === 'main' && buttons[1]) buttons[1].classList.add('active');
        if (tabName === 'right' && buttons[2]) buttons[2].classList.add('active');
    },

    renderShop(upgrades, currentLp, totalLp, onBuy) {
        const container = document.getElementById('shop-container');
        if (!container) return;

        container.innerHTML = "";
        upgrades.forEach(upg => {
            // Condition d'affichage (découverte progressive)
            if (totalLp < upg.baseCost * 0.4 && upg.count === 0) return;

            const canAfford = currentLp >= upg.baseCost;
            const item = document.createElement('div');
            item.className = `shop-item ${canAfford ? 'affordable' : 'locked'}`;

            item.innerHTML = `
                <div class="upgrade-sprite">${upg.sprite}</div>
                <div class="shop-info">
                    <strong>${upg.name}</strong>
                    <small>${upg.desc}</small>
                </div>
                <div class="shop-stats">
                    <div class="shop-cost">${Math.floor(upg.baseCost)} LP</div>
                </div>
                <div class="upgrade-count">${upg.count}</div>
            `;

            if (canAfford) {
                item.onclick = (e) => {
                    e.stopPropagation();
                    onBuy(upg);
                };
            }
            container.appendChild(item);
        });
    }
};