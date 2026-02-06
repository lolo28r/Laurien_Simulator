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
                `Dans ce jeu tu va devoir gagner des Laurien Points en achetant des améliorations et en cliquant !! Mais go faire ca en fait !`,
                `Va-y ${n}, clique sur la silhouette pour faire des Laurien Points.`,
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
                `J'en ai fait plein durant ma jeunesse, tu va voir c'est très formateur, et ça te rapporte 0.2 Laurien Points par secondes.`,
                `Tu peux acheter l'amélioration dans le Shop.`,
                `Allez plus que 6 000 avant la binouze !!.`
            ]
        },
        // NOUVEAUX DIALOGUES POUR NE PAS ABANDONNER
        {
            threshold: 100,
            text: (n) => [
                `T'es encore là ?.`,
                `Merci de jouer à mon jeu, c'est vraiment cool.`,
                `Bah continue hein.`,
                `Tu peux aussi améliorer tes Business dans le Shop pour faire plus de Laurien Points par secondes.`
            ]
        },
        {
            threshold: 150,
            text: (n) => [
                `T'a vu c'est rentable les sondages.`,

            ]
        },
        {
            threshold: 200,
            text: (n) => [
                `Bon je rigole, tiens achète moi une binouze la`,
                `Je te vais te donner un petit coup de pouce.`
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