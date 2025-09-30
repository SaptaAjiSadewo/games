console.log("Main module loaded successfully!");

document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    console.log("All buttons:", {
        resetBtn: document.getElementById('resetBtn'),
        addCardBtn: document.getElementById('addCardBtn'),
        spawnEnemyBtn: document.getElementById('spawnEnemyBtn'),
        endTurnBtn: document.getElementById('endTurnBtn'),
        addEnemyCardBtn: document.getElementById('addEnemyCardBtn')
    });
}); 

import { initializeGame, resetGame } from "./gameState.js";
import {
  addRandomCharacterCard,
  addRandomSpecialCard,
  addRandomEnemyCard,
} from "./cardManager.js";
import { spawnEnemy, endTurn } from "./battleSystem.js";
import { updateGameUI, addBattleLog } from "./uiManager.js";
import { initializeDragDrop } from "./dragDrop.js";

// Global function untuk diakses oleh HTML jika needed
window.resetGame = resetGame;
window.addRandomCharacterCard = addRandomCharacterCard;
window.spawnEnemy = spawnEnemy;
window.endTurn = endTurn;
window.addRandomEnemyCard = addRandomEnemyCard;

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content Loaded - Initializing Game");

  // Element references
  const resetBtn = document.getElementById("resetBtn");
  const addCardBtn = document.getElementById("addCardBtn");
  const spawnEnemyBtn = document.getElementById("spawnEnemyBtn");
  const endTurnBtn = document.getElementById("endTurnBtn");
  const addEnemyCardBtn = document.getElementById("addEnemyCardBtn");

  // Cek jika elemen ada
  if (
    !resetBtn ||
    !addCardBtn ||
    !spawnEnemyBtn ||
    !endTurnBtn ||
    !addEnemyCardBtn
  ) {
    console.error("Tombol tidak ditemukan! Pastikan HTML sudah benar.");
    return;
  }

  // Inisialisasi game
  initializeGame();

  // Tambahkan kartu awal
  for (let i = 0; i < 5; i++) {
    addRandomCharacterCard();
  }

  for (let i = 0; i < 2; i++) {
    addRandomSpecialCard();
  }

  for (let i = 0; i < 3; i++) {
    addRandomEnemyCard();
  }

  document.addEventListener("addCharacterCard", addRandomCharacterCard);
  document.addEventListener("addSpecialCard", addRandomSpecialCard);
  document.addEventListener("addEnemyCard", addRandomEnemyCard);

  // Inisialisasi drag & drop
  initializeDragDrop();

  // Event listeners untuk tombol
  resetBtn.addEventListener("click", resetGame);
  addCardBtn.addEventListener("click", addRandomCharacterCard);
  spawnEnemyBtn.addEventListener("click", spawnEnemy);
  endTurnBtn.addEventListener("click", endTurn);
  addEnemyCardBtn.addEventListener("click", addRandomEnemyCard);

  // Update UI awal
  updateGameUI();
  addBattleLog(
    "Game dimulai! Seret kartu karakter ke area pemain untuk memanggil karakter."
  );

  // Event untuk reinitialize setelah reset
  document.addEventListener("reinitializeGame", function () {
    for (let i = 0; i < 5; i++) addRandomCharacterCard();
    for (let i = 0; i < 2; i++) addRandomSpecialCard();
    for (let i = 0; i < 3; i++) addRandomEnemyCard();
    updateGameUI();
    addBattleLog(
      "Game dimulai! Seret kartu karakter ke area pemain untuk memanggil karakter."
    );
  });

  console.log("Game initialized successfully");
});
