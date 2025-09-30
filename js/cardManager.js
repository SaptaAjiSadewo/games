import {
  gameState,
  characterCardTypes,
  specialCardTypes,
  enemyCardTypes,
} from "./gameState.js";
import {
  createCharacterCardElement,
  createSpecialCardElement,
  createEnemyCardElement,
} from "./uiManager.js";
import { addBattleLog, updateGameUI } from "./uiManager.js";
import { startBattle } from "./battleSystem.js";

export function addRandomCharacterCard() {
  const cardType = characterCardTypes[Math.floor(Math.random() * characterCardTypes.length)];
  const cardId = `char-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const card = {
    id: cardId,
    type: cardType.type,
    name: cardType.name,
    hp: cardType.hp,
    attack: cardType.attack,
    cost: cardType.cost,
    symbol: cardType.symbol,
    heal: cardType.heal || 0,
  };

  gameState.characterCards.push(card);
  createCharacterCardElement(card);
}

export function addRandomSpecialCard() {
  const cardType = specialCardTypes[Math.floor(Math.random() * specialCardTypes.length)];
  const cardId = `special-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const card = {
    id: cardId,
    type: cardType.type,
    name: cardType.name,
    cost: cardType.cost,
    symbol: cardType.symbol,
    effect: cardType.effect,
  };

  gameState.specialCards.push(card);
  createSpecialCardElement(card);
}

export function addRandomEnemyCard() {
  const cardType = enemyCardTypes[Math.floor(Math.random() * enemyCardTypes.length)];
  const cardId = `enemy-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const card = {
    id: cardId,
    type: "enemy",
    name: cardType.name,
    hp: cardType.hp,
    attack: cardType.attack,
    cost: cardType.cost,
    symbol: cardType.symbol,
  };

  gameState.enemyCards.push(card);
  createEnemyCardElement(card);
}

export function useSpecialCard(card) {
  gameState.player.mana -= card.cost;

  if (card.effect === "heal") {
    gameState.player.characters.forEach((character) => {
      character.hp = Math.min(character.hp + 30, character.maxHp);

      const healthBar = document.getElementById(`health-${character.id}`);
      if (healthBar) {
        const healthPercent = (character.hp / character.maxHp) * 100;
        healthBar.style.width = `${healthPercent}%`;
      }

      const characterElement = document.getElementById(character.id);
      if (characterElement) {
        characterElement.classList.add("healing");
        setTimeout(() => {
          characterElement.classList.remove("healing");
        }, 500);
      }
    });

    addBattleLog(`Menggunakan ${card.name}! Semua karakter dipulihkan 30 HP.`);
  } else if (card.effect === "poison") {
    if (gameState.enemy.characters.length > 0) {
      gameState.enemy.poisoned = true;
      gameState.enemy.poisonTurns = 3;

      const enemyElement = document.getElementById(gameState.enemy.characters[0].id);
      if (enemyElement) {
        enemyElement.classList.add("poisoned");

        const poisonDot = document.createElement("div");
        poisonDot.className = "poison-dot";
        poisonDot.textContent = "P";
        poisonDot.id = `poison-${gameState.enemy.characters[0].id}`;
        enemyElement.appendChild(poisonDot);

        enemyElement.classList.add("poisoning");
        setTimeout(() => {
          enemyElement.classList.remove("poisoning");
        }, 500);
      }

      addBattleLog(`Menggunakan ${card.name}! Musuh diracuni selama 3 giliran.`);
    } else {
      addBattleLog(`Tidak ada musuh untuk diracuni!`);
    }
  }

  updateGameUI();
}

