"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Settings_js_1 = require("../common/Settings.js");
function Has_key(object, key) {
    return key in object;
}
function Project(object, axis) {
    var keys = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        keys[_i - 2] = arguments[_i];
    }
    return keys.reduce(function (accumulator, key) {
        var _a;
        if (Has_key(object, key))
            return __assign(__assign({}, accumulator), (_a = {}, _a[axis] = object[key], _a));
        else
            return accumulator;
    }, {});
}
var Dataviz = /** @class */ (function () {
    function Dataviz() {
    }
    Dataviz.Setup = function (dataviz, data, name, features, types, enumerations) {
        /**
         * On obtient ici les info. à traiter. Paramétrer l'IHM via
         * 'dataviz.dataviz_area' qui est une 'div' HTML vide.
         */
        var f = features;
        types.forEach(function (type) { return console.warn(type === "enum" ? "type énuméré" : type); });
        // Ajout d'un menu pour choisir les axes
        Dataviz._createAxisSelector(dataviz, data, features, name, enumerations);
    };
    // Création d'un sélecteur pour les axes X et Y
    Dataviz._createAxisSelector = function (dataviz, data, features, name, enumerations) {
        var container = dataviz.dataviz_area;
        // Créer les menus déroulants pour X et Y
        var xSelect = document.createElement("select");
        var ySelect = document.createElement("select");
        features.forEach(function (feature) {
            var optionX = document.createElement("option");
            var optionY = document.createElement("option");
            optionX.value = feature;
            optionX.textContent = "X: ".concat(feature);
            optionY.value = feature;
            optionY.textContent = "Y: ".concat(feature);
            xSelect.appendChild(optionX);
            ySelect.appendChild(optionY);
        });
        // Ajouter un bouton pour valider la sélection
        var button = document.createElement("button");
        button.textContent = "Afficher les graphiques";
        container.appendChild(xSelect);
        container.appendChild(ySelect);
        container.appendChild(button);
        // Ajouter un événement pour le bouton
        button.onclick = function () {
            var xFeature = xSelect.value;
            var yFeature = ySelect.value;
            // Nettoyer la zone et afficher les graphiques sélectionnés
            container.innerHTML = "";
            Dataviz._Linechart(dataviz, data, name, xFeature, yFeature, enumerations);
            Dataviz._Barchart(dataviz, data, name, xFeature, yFeature);
            Dataviz._Table(dataviz, data, xFeature, yFeature);
        };
    };
    // Graphique en ligne
    Dataviz._Linechart = function (dataviz, data, name, xFeature, yFeature, enumerations) {
        try {
            console.log("Dataviz_area :", dataviz.dataviz_area);
            console.log("Données reçues :", data);
            var line = data.map(function (datum) { return ({
                x: datum[xFeature],
                y: datum[yFeature],
            }); });
            line.sort(function (a, b) { return (a.x < b.x ? -1 : 1); });
            var data_ = { values: [line], series: [name] };
            tfvis.render.linechart(dataviz.dataviz_area, data_, {
                xLabel: xFeature,
                yLabel: yFeature,
                height: 400,
                width: 600,
            });
        }
        catch (error) {
            throw new Error(Settings_js_1.DMiNer_error.No_possible_visualization);
        }
    };
    // Graphique en barres
    Dataviz._Barchart = function (dataviz, data, name, xFeature, yFeature) {
        var barData = data.map(function (datum) { return ({ x: datum[xFeature], y: datum[yFeature] }); });
        var barChart = { values: barData };
        tfvis.render.barchart(dataviz.dataviz_area, barChart, {
            xLabel: xFeature,
            yLabel: yFeature,
            height: 400,
            width: 600,
        });
    };
    // Tableau de données
    Dataviz._Table = function (dataviz, data, xFeature, yFeature) {
        var tableData = data.map(function (datum) { return [datum[xFeature], datum[yFeature]]; });
        tfvis.render.table(dataviz.dataviz_area, {
            headers: [xFeature, yFeature],
            values: tableData,
        });
    };
    return Dataviz;
}());
exports.default = Dataviz;
