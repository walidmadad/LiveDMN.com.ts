export default class Dataviz {
    /**
     * Configure et initialise la visualisation des données.
     * @param {Object} dataviz - Configuration de la zone de visualisation.
     * @param {HTMLDivElement} dataviz.dataviz_area - Élément HTML où afficher les visualisations.
     * @param {Function} dataviz.dataviz_handler - Fonction pour gérer l'état d'activité de la visualisation.
     * @param {ReadonlyArray<Record<string, any>>} data - Données à visualiser.
     * @param {string} name - Nom de la visualisation.
     * @param {ReadonlyArray<string>} features - Liste des fonctionnalités ou attributs à visualiser.
     * @param {ReadonlyArray<string>} types - Types de données (e.g., "enum", "string").
     * @param {Readonly<Map<string, Array<boolean | number | string> | null>>} enumerations - Dictionnaire des énumérations pour certains types de données.
     */
    static Setup(dataviz, data, name, features, types, enumerations) {
        // Active la gestion initiale de la visualisation
        console.log("data", data);
        console.log("name", name);
        console.log("types", types);
        console.log("features", features);
        console.log("enum", enumerations);
        dataviz.dataviz_handler(false);
        // Affiche un avertissement pour chaque type de données
        types.forEach(type => console.warn(type === "enum" ? "type énuméré" : type));
        // Nettoyer la zone de visualisation existante
        dataviz.dataviz_area.innerHTML = '';
        // Création du conteneur principal pour les graphiques
        const mainContainer = document.createElement('div');
        mainContainer.style.display = 'flex';
        mainContainer.style.justifyContent = 'space-between';
        mainContainer.style.alignItems = 'center';
        mainContainer.style.gap = '20px';
        mainContainer.style.padding = '20px';
        mainContainer.style.backgroundColor = '#f9f9f9';
        mainContainer.style.border = '1px solid #ddd';
        mainContainer.style.borderRadius = '8px';
        mainContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        // Création et configuration du conteneur pour le graphique histogramme
        const histogramContainer = document.createElement('div');
        histogramContainer.id = "histogram";
        histogramContainer.style.flex = '1';
        histogramContainer.style.backgroundColor = '#fff';
        histogramContainer.style.border = '1px solid #ddd';
        histogramContainer.style.borderRadius = '8px';
        histogramContainer.style.padding = '10px';
        histogramContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        mainContainer.appendChild(histogramContainer);
        // Création et configuration du conteneur pour le graphique en bulles
        const bubblechartContainer = document.createElement('div');
        bubblechartContainer.id = "bubblechart";
        bubblechartContainer.style.flex = '1';
        bubblechartContainer.style.backgroundColor = '#fff';
        bubblechartContainer.style.border = '1px solid #ddd';
        bubblechartContainer.style.borderRadius = '8px';
        bubblechartContainer.style.padding = '10px';
        bubblechartContainer.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        mainContainer.appendChild(bubblechartContainer);
        // Ajoute le conteneur principal à la zone de visualisation
        dataviz.dataviz_area.appendChild(mainContainer);
        // Génère les graphiques nécessaires
        Dataviz._BubbleChart(dataviz, data, name, features, types, enumerations);
        Dataviz._Histogram(dataviz, data, name, features, types, enumerations);
        // Marque la visualisation comme terminée après 15 secondes
        setTimeout(() => dataviz.dataviz_handler(true), 15000);
    }
    /**
     * Crée un graphique en bulles dans le conteneur spécifié.
     */
    static _BubbleChart(dataviz, data, name, features, types, enumerations) {
        // Récupère le conteneur pour le graphique en bulles
        const bubblechartContainer = document.getElementById('bubblechart');
        if (!bubblechartContainer) {
            console.error('Bubble chart container not found');
            return;
        }
        // Prépare les données pour le graphique en bulles
        const bubbleData = data.map(datum => ({
            x: datum["_DMiNer_ UNIQUE hit rule(s)"] ?? 0,
            y: datum["Developer annual salary ($ US)"] ?? 0,
            size: 10,
            label: datum["Programming language"] ?? "Unknown"
        }));
        // Rend le graphique en bulles
        tfvis.render.scatterplot(bubblechartContainer, { values: bubbleData }, {
            xLabel: name,
            yLabel: 'Salary ($ US)',
            height: 400,
            width: 600,
            title: 'Bubble Chart: Salary vs Rules',
            grid: true,
        });
    }
    /**
     * Crée un histogramme pour chaque fonctionnalité spécifiée.
     */
    static _Histogram(dataviz, data, name, features, types, enumerations) {
        // Récupère le conteneur pour l'histogramme
        const histogramContainer = document.getElementById('histogram');
        if (!histogramContainer) {
            console.error('Histogram container not found');
            return;
        }
        // Génère un histogramme pour chaque fonctionnalité
        features.forEach(feature => {
            try {
                const values = data.map(datum => datum[feature]).filter(val => typeof val === 'number');
                tfvis.render.histogram(histogramContainer, values, {
                    xLabel: feature,
                    yLabel: 'Frequency',
                    height: 400,
                    width: 600,
                    title: `Histogram: Distribution of ${feature}`,
                    stats: true,
                });
            }
            catch (error) {
                console.error(`Unable to render histogram for ${feature}:`, error);
            }
        });
    }
}
//# sourceMappingURL=Dataviz.js.map