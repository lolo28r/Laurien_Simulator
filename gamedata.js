export const gameData = {
    lp: 0,
    totalLp: 0,
    playerName: "Anonyme",
    playerGender: "Garçon",
    clickModifier: 1,
    liamCaptured: false,
    story: [
        {
            threshold: 0,
            text: (n, g) => [
                `Bienvenue dans le simulateur de Laurien, ${n}.`,
                `${g} !! On baise ?`,
                `Dans ce jeu tu vas devoir gagner des Laurien Points en achetant des améliorations et en cliquant !!`,
                `Vas-y ${n}, clique sur la silhouette pour faire des Laurien Points.`,
            ]
        },
        {
            threshold: 15,
            text: (n) => [
                `Alors ${n} ? On s'amuse ?`,
                `C'est fun de cliquer dans le vide comme ça ?`,
                `Moi j'aime assez.`
            ]
        },
        {
            threshold: 20,
            text: (n) => [
                `Bonne nouvelle, tu viens de débloquer les "Sondages Rémunérés".`,
                `Tu peux acheter des business dans la boutique pour générer des revenus passifs.`,
                `Allez, plus que 6 000 Laurien Points AVANT la binouze !!`
            ]
        },
        {
            threshold: 100,
            text: (n) => [
                `T'es encore là ?`,
                `Merci de jouer à mon jeu, c'est vraiment cool.`,
                `Tu peux aussi améliorer tes Business dans le Shop.`
            ]
        },
        {
            threshold: 200,
            text: (n) => [
                `Allez régale-toi, un petit bonus arrive !`
            ]
        },
        {
            threshold: 10000,
            text: (n) => [
                `Wow 10 000 Laurien Points !! Impressionnant.`,
                `J'ai entendu dire qu'un voyage t'attend à un certain seuil de points...`
            ]
        },
    ],
    upgrades: [
        {
            id: 'sondages',
            name: 'Sondages Rémunérés',
            sprite: '📝',
            desc: 'Plutôt tentant non ?',
            baseCost: 20,
            baseProduction: 0.2,
            count: 0
        },
        {
            id: 'binouze',
            name: 'Binouze',
            sprite: '🍺',
            desc: 'Une petite bière pour la motivation. Ça bombarde !',
            baseCost: 6000,
            baseProduction: 45,
            count: 0
        }
    ]
};