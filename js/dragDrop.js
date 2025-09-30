import { gameState } from "./gameState.js";
import { useSpecialCard, addRandomEnemyCard } from "./cardManager.js";
import { spawnEnemyFromCard, startBattle } from "./battleSystem.js";
import { addBattleLog, updateGameUI, createCharacter } from "./uiManager.js";
// import { createCharacter } from "./uiManager.js"; // Add this line

let enemySlot, enemyReturnArea;

export function initializeDragDrop() {
  enemySlot = document.getElementById("enemySlot");
  enemyReturnArea = document.getElementById("enemyReturnArea");

  setupCardDragEvents();
  setupBoardDropEvents();
  setupReturnAreaEvents();
}

function setupCardDragEvents() {
  // Event listeners untuk drag kartu karakter
  document.addEventListener("dragstart", function (e) {
    if (e.target.classList.contains("card")) {
      const cardId = e.target.id;

      if (
        e.target.classList.contains("warrior") ||
        e.target.classList.contains("archer") ||
        e.target.classList.contains("healer")
      ) {
        const card = gameState.characterCards.find((c) => c.id === cardId);
        if (card && gameState.player.mana >= card.cost) {
          e.dataTransfer.setData("text/plain", cardId);
          e.dataTransfer.setData("type", "character");
          e.target.style.opacity = "0.7";
        } else {
          e.preventDefault();
          if (card) {
            addBattleLog(`Tidak cukup mana! Butuh ${card.cost} mana.`);
          }
        }
      } else if (
        e.target.classList.contains("heal-spell") ||
        e.target.classList.contains("poison-spell")
      ) {
        const card = gameState.specialCards.find((c) => c.id === cardId);
        if (card && gameState.player.mana >= card.cost) {
          e.dataTransfer.setData("text/plain", cardId);
          e.dataTransfer.setData("type", "special");
          e.target.style.opacity = "0.7";
        } else {
          e.preventDefault();
          if (card) {
            addBattleLog(`Tidak cukup mana! Butuh ${card.cost} mana.`);
          }
        }
      } else if (e.target.classList.contains("enemy-card")) {
        const card = gameState.enemyCards.find((c) => c.id === cardId);
        if (card) {
          e.dataTransfer.setData("text/plain", cardId);
          e.dataTransfer.setData("type", "enemy");
          e.target.style.opacity = "0.7";
        }
      }
    } else if (e.target.classList.contains("character")) {
      e.dataTransfer.setData("text/plain", e.target.id);
      e.target.style.opacity = "0.7";
    }
  });

  document.addEventListener("dragend", function (e) {
    if (
      e.target.classList.contains("card") ||
      e.target.classList.contains("character")
    ) {
      e.target.style.opacity = "1";
    }
  });
}

function setupBoardDropEvents() {
  const playerBoard = document.getElementById("playerBoard");
  const enemyBoard = document.getElementById("enemyBoard");

  // Player board drop
  playerBoard.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  playerBoard.addEventListener("drop", function (e) {
    e.preventDefault();

    const cardId = e.dataTransfer.getData("text/plain");
    const cardType = e.dataTransfer.getData("type");

    if (cardType === "character") {
      const card = gameState.characterCards.find((c) => c.id === cardId);

      if (card && gameState.player.mana >= card.cost) {
        const boardRect = playerBoard.getBoundingClientRect();
        const x = e.clientX - boardRect.left - 50;
        const y = e.clientY - boardRect.top - 60;

        const cardElement = document.getElementById(cardId);
        cardElement.remove();

        gameState.player.mana -= card.cost;
        createCharacter(card, x, y);
        gameState.characterCards = gameState.characterCards.filter(
          (c) => c.id !== cardId
        );

        updateGameUI();
        addBattleLog(`Memanggil ${card.name}! (-${card.cost} mana)`);
        startBattle();
      }
    } else if (cardType === "special") {
      const card = gameState.specialCards.find((c) => c.id === cardId);

      if (card && gameState.player.mana >= card.cost) {
        useSpecialCard(card);
        const cardElement = document.getElementById(cardId);
        cardElement.remove();
        gameState.specialCards = gameState.specialCards.filter(
          (c) => c.id !== cardId
        );
        updateGameUI();
      }
    } else if (!cardType) {
      // Memindahkan karakter
      const characterId = cardId;
      if (characterId.startsWith("char-")) {
        const characterElement = document.getElementById(characterId);
        const character = gameState.player.characters.find(
          (c) => c.id === characterId
        );

        if (characterElement && character) {
          const boardRect = playerBoard.getBoundingClientRect();
          const x = e.clientX - boardRect.left - 50;
          const y = e.clientY - boardRect.top - 60;

          characterElement.style.left = `${x}px`;
          characterElement.style.top = `${y}px`;

          character.x = x;
          character.y = y;
        }
      }
    }
  });

  // Enemy board drop
  enemyBoard.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  enemyBoard.addEventListener("drop", function (e) {
    e.preventDefault();

    const cardId = e.dataTransfer.getData("text/plain");
    const cardType = e.dataTransfer.getData("type");

    if (cardType === "enemy") {
      const card = gameState.enemyCards.find((c) => c.id === cardId);

      if (card && gameState.enemy.characters.length === 0) {
        const cardElement = document.getElementById(cardId);
        cardElement.remove();

        spawnEnemyFromCard(card);
        gameState.enemyCards = gameState.enemyCards.filter(
          (c) => c.id !== cardId
        );

        updateGameUI();
        addBattleLog(`Memanggil musuh ${card.name}!`);
        startBattle();
      } else if (gameState.enemy.characters.length > 0) {
        addBattleLog("Sudah ada musuh di papan!");
      }
    }
  });
}

function setupReturnAreaEvents() {
  enemyReturnArea.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  enemyReturnArea.addEventListener("drop", function (e) {
    e.preventDefault();

    const characterId = e.dataTransfer.getData("text/plain");

    if (characterId.startsWith("enemy-")) {
      const enemy = gameState.enemy.characters.find(
        (c) => c.id === characterId
      );

      if (enemy) {
        const enemyElement = document.getElementById(characterId);
        enemyElement.remove();

        gameState.enemy.characters = gameState.enemy.characters.filter(
          (c) => c.id !== characterId
        );
        addRandomEnemyCard();

        if (gameState.enemy.poisoned) {
          gameState.enemy.poisoned = false;
          gameState.enemy.poisonTurns = 0;
        }

        updateGameUI();
        addBattleLog(`Mengembalikan ${enemy.name} ke deck musuh.`);
      }
    }
  });
}
