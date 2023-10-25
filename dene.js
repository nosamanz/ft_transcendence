"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var dizinYolu = '/path/to/your/directory'; // Dizin yolunu kendi dizin yolunuzla değiştirin
// Dizinde bulunan dosyaları listeleme fonksiyonu
function listeleDosyalari(dizinYolu) {
    fs_1.default.readdir(dizinYolu, function (hata, dosyalar) {
        if (hata) {
            console.error("Dizin okuma hatas\u0131: ".concat(hata));
            return;
        }
        console.log("Dizin i\u00E7inde bulunan dosyalar:");
        dosyalar.forEach(function (dosya) {
            console.log(dosya);
        });
    });
}
listeleDosyalari(dizinYolu);
