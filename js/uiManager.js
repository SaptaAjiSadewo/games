import { gameState } from "./gameState.js";

export function updateGameUI() {
  const playerHpElement = document.getElementById("playerHp");
  const playerManaElement = document.getElementById("playerMana");
  const enemyHpElement = document.getElementById("enemyHp");
  const spawnEnemyBtn = document.getElementById("spawnEnemyBtn");

  if (playerHpElement) playerHpElement.textContent = gameState.player.hp;
  if (playerManaElement) playerManaElement.textContent = gameState.player.mana;

  if (gameState.enemy.characters.length > 0 && enemyHpElement) {
    enemyHpElement.textContent = gameState.enemy.characters[0].hp;
  } else if (enemyHpElement) {
    enemyHpElement.textContent = "0";
  }

  // Nonaktifkan tombol jika game over
  const addCardBtn = document.getElementById("addCardBtn");
  if (addCardBtn) addCardBtn.disabled = gameState.gameOver;
  if (spawnEnemyBtn) {
    spawnEnemyBtn.disabled =
      gameState.gameOver || gameState.enemy.characters.length > 0;
  }
}

export function addBattleLog(message) {
  const battleLog = document.querySelector(".battle-log .log-content");
  if (!battleLog) return;

  const logEntry = document.createElement("div");
  logEntry.className = "log-entry";
  logEntry.textContent = `[Turn ${gameState.turn}] ${message}`;

  battleLog.appendChild(logEntry);
  battleLog.scrollTop = battleLog.scrollHeight;
}

// Fungsi untuk membuat elemen kartu karakter
export function createCharacterCardElement(card) {
  const characterDeck = document.getElementById("characterDeck");
  const cardElement = document.createElement("div");
  cardElement.className = `card ${card.type}`;
  cardElement.id = card.id;
  cardElement.draggable = true;

  cardElement.innerHTML = `
        <div class="mana-cost">${card.cost}</div>
        <div class="card-header">
            <span>${card.name}</span>
        </div>
        <div class="card-body">
            ${card.symbol}
        </div>
        <div class="card-footer">
            <span>HP: ${card.hp}</span>
            <span>ATK: ${card.attack}</span>
        </div>
    `;

  characterDeck.appendChild(cardElement);
}

export function createCharacter(cardData, x, y) {
  const playerBoard = document.getElementById("playerBoard");
  const characterId = `char-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  const character = {
    id: characterId,
    type: cardData.type,
    name: cardData.name,
    hp: cardData.hp,
    maxHp: cardData.hp,
    attack: cardData.attack,
    symbol: cardData.symbol,
    heal: cardData.heal || 0,
    x: x,
    y: y,
  };

  gameState.player.characters.push(character);
  createCharacterElement(character, playerBoard);
}

// Fungsi untuk membuat elemen kartu spesial
export function createSpecialCardElement(card) {
  const specialDeck = document.getElementById("specialDeck");
  const cardElement = document.createElement("div");
  cardElement.className = `card ${card.type}`;
  cardElement.id = card.id;
  cardElement.draggable = true;

  cardElement.innerHTML = `
        <div class="spell-cost">${card.cost}</div>
        <div class="card-header">
            <span>${card.name}</span>
        </div>
        <div class="card-body">
            ${card.symbol}
        </div>
        <div class="card-footer">
            <span>Spell</span>
        </div>
    `;

  specialDeck.appendChild(cardElement);
}

// Fungsi untuk membuat elemen kartu musuh
export function createEnemyCardElement(card) {
  const enemyDeck = document.getElementById("enemyDeck");
  const cardElement = document.createElement("div");
  cardElement.className = `card enemy-card`;
  cardElement.id = card.id;
  cardElement.draggable = true;

  cardElement.innerHTML = `
        <div class="enemy-cost">${card.cost}</div>
        <div class="card-header">
            <span>${card.name}</span>
        </div>
        <div class="card-body">
            ${card.symbol}
        </div>
        <div class="card-footer">
            <span>HP: ${card.hp}</span>
            <span>ATK: ${card.attack}</span>
        </div>
    `;

  enemyDeck.appendChild(cardElement);
}

// Fungsi untuk membuat elemen karakter di papan
export function createCharacterElement(character, board) {
  const characterElement = document.createElement("div");
  characterElement.className = `character ${character.type}`;
  characterElement.id = character.id;

  characterElement.style.left = `${character.x}px`;
  characterElement.style.top = `${character.y}px`;

  characterElement.innerHTML = `
        <div class="character-name">${character.name}</div>
        <div class="character-stats">ATK: ${character.attack}</div>
        <div class="health-bar">
            <div class="health-fill" id="health-${character.id}" style="width: 100%"></div>
        </div>
    `;

  characterElement.draggable = true;
  board.appendChild(characterElement);
}

// Fungsi untuk membuat elemen musuh di papan
export function createEnemyElement(enemy) {
  const enemyBoard = document.getElementById("enemyBoard");
  const enemySlot = document.getElementById("enemySlot");
  const enemyElement = document.createElement("div");
  enemyElement.className = "character enemy";
  enemyElement.id = enemy.id;

  // Posisi di tengah enemy slot
  const slotRect = enemySlot.getBoundingClientRect();
  const boardRect = enemyBoard.getBoundingClientRect();
  const x = slotRect.left - boardRect.left + (slotRect.width - 100) / 2;
  const y = slotRect.top - boardRect.top + (slotRect.height - 120) / 2;

  enemyElement.style.left = `${x}px`;
  enemyElement.style.top = `${y}px`;

  enemyElement.innerHTML = `
        <div class="character-name">${enemy.name}</div>
        <div class="character-stats">ATK: ${enemy.attack}</div>
        <div class="health-bar">
            <div class="health-fill" id="health-${enemy.id}" style="width: 100%"></div>
        </div>
    `;

  enemyElement.draggable = true;
  enemyBoard.appendChild(enemyElement);
}
