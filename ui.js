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
        document.getElementById('lp-count').innerText = Math.floor(lp);
        document.getElementById('lp-total').innerText = Math.floor(totalLp);
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
        if (overlay) overlay.style.display = 'block';
        this.showNextDialogue();
    },

    endDialogueMode() {
        document.body.classList.remove('is-talking');
        const overlay = document.getElementById('dialogue-overlay');
        if (overlay) overlay.style.display = 'none';
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

    // --- CETTE FONCTION EST LA CLÉ ---
    // On l'appelle une seule fois au tout début du jeu
    initGlobalListeners() {
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

        document.getElementById('dialogue-box').addEventListener('click', advanceDialogue);
        document.getElementById('dialogue-overlay').addEventListener('click', advanceDialogue);
        window.addEventListener('keydown', (e) => {
            if (e.key === "Enter" && document.body.classList.contains('is-talking')) {
                advanceDialogue();
            }
        });
    },

    initIntro(onComplete) {
        const btn = document.getElementById('start-btn');
        const screen = document.getElementById('intro-screen');
        btn.addEventListener('click', () => {
            const nameInput = document.getElementById('player-name-input');
            const genderSelect = document.getElementById('player-gender');
            const name = nameInput.value.trim() || "Champion";
            const gender = genderSelect.value;
            screen.classList.add('hidden');
            onComplete(name, gender);
        });
    },
    switchTab(tabName) {
        // 1. Gérer l'affichage des sections
        const sections = {
            'left': document.querySelector('.sidebar.left'),
            'main': document.querySelector('.main-clicker'),
            'right': document.querySelector('.sidebar.right')
        };

        Object.values(sections).forEach(el => el.classList.remove('mobile-active'));
        sections[tabName].classList.add('mobile-active');

        // 2. Gérer l'état des boutons de la nav
        const buttons = document.querySelectorAll('.mobile-nav button');
        buttons.forEach(btn => btn.classList.remove('active'));

        // On trouve le bouton cliqué (index 0=stats, 1=jeu, 2=shop)
        if (tabName === 'left') buttons[0].classList.add('active');
        if (tabName === 'main') buttons[1].classList.add('active');
        if (tabName === 'right') buttons[2].classList.add('active');
    },

    renderShop(upgrades, currentLp, totalLp, onBuy) {
        const container = document.getElementById('shop-container');
        container.innerHTML = "";
        upgrades.forEach(upg => {
            if (totalLp < upg.baseCost * 0.5 && upg.count === 0) return;
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
                item.onclick = () => onBuy(upg);
            }
            container.appendChild(item);
        });
    }

};