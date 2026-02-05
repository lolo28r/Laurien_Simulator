export const gameData = {
    lp: 0,
    totalLp: 0,
    playerName: "Anonyme",
    playerGender: "Garçon",

    story: [
        {
            threshold: 0,
            text: (n, g) => [
                `Bienvenue dans le simulateur de Laurien, ${n}.`,
                `${g} !!  On baise ?`,
                `Dans ce jeu tu va devoir gagner des Laurien Points en achetant des améliorations et en cliquant !! Mais go faire ca en fait !`
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
                `Bon, parce que j'ai pitié, je t'ai débloqué les "Sondages Rémunérés".`,
                `J'en ai fait plein durant ma jeunesse, tu va voir c'est très formateur, et ça te rapporte 0.2 Laurien Points par secondes.`,
                `allez plus que 6 000 avant la binouze !!.`
            ]
        },
        // NOUVEAUX DIALOGUES POUR NE PAS ABANDONNER
        {
            threshold: 500,
            text: (n) => [
                `T'es encore là ? T'as l'air déterminé.`,
                `500 LP... C'est presque rien, mais c'est un début.`,
                `Continue à cliquer, la bière n'attend pas.`
            ]
        },
        {
            threshold: 2000,
            text: (n) => [
                `2000 ! On est au tiers du chemin.`,
                `Tes doigts tiennent le coup ? On dirait que t'as fait ça toute ta vie.`
            ]
        },
        {
            threshold: 4500,
            text: (n) => [
                `Presque 6000 ! Je commence à sentir l'odeur du houblon d'ici.`,
                `Lâche rien, t'y es presque.`
            ]
        },
        {
            threshold: 6000,
            text: (n) => [
                `Oh, tu as découvert la "Binouze" !`,
                `Enfin un investissement sérieux.`
            ]
        }
    ],

    upgrades: [
        {
            id: 'sondages',
            name: 'Sondages Rémunérés',
            sprite: '📝',
            desc: 'Eh plutôt tentant non ?',
            baseCost: 20,
            baseProduction: 0.2,
            count: 0
        },
        {
            id: 'binouze',
            name: 'Binouze',
            sprite: '🍺',
            desc: 'Une petite bière pour la motivation. Ça produit enfin.',
            baseCost: 6000,
            baseProduction: 45, // BOOST : On passe de 5 à 45 pour que ça bombarde direct !
            count: 0
        }
    ]
};