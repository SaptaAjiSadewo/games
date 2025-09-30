import { gameState, enemyCardTypes } from "./gameState.js";
import { addBattleLog, updateGameUI, createEnemyElement } from "./uiManager.js";

export function spawnEnemy() {
  if (gameState.enemy.characters.length >= 1) {
    addBattleLog("Sudah ada musuh di papan!");
    return;
  }

  const enemyType = enemyCardTypes[Math.floor(Math.random() * enemyCardTypes.length)];
  spawnEnemyFromCard(enemyType);

  updateGameUI();
  addBattleLog(`Memanggil musuh ${enemyType.name}!`);
  startBattle();
}

export function spawnEnemyFromCard(cardData) {
  const enemyId = `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const enemy = {
    id: enemyId,
    name: cardData.name,
    hp: cardData.hp,
    maxHp: cardData.hp,
    attack: cardData.attack,
    symbol: cardData.symbol,
  };

  gameState.enemy.characters.push(enemy);
  createEnemyElement(enemy);
}

export function startBattle() {
  if (gameState.player.characters.length === 0 || gameState.enemy.characters.length === 0) {
    return;
  }

  // Untuk setiap karakter pemain, lakukan aksi
  gameState.player.characters.forEach((character) => {
    if (character.type === "healer") {
      healAllies(character);
    } else {
      attackEnemy(character);
    }
  });

  // Musuh menyerang balik
  if (gameState.enemy.characters.length > 0) {
    const enemy = gameState.enemy.characters[0];
    attackPlayer(enemy);
  }

  // Apply poison damage jika musuh diracuni
  if (gameState.enemy.poisoned && gameState.enemy.characters.length > 0) {
    const enemy = gameState.enemy.characters[0];
    enemy.hp -= 10;

    const healthBar = document.getElementById(`health-${enemy.id}`);
    if (healthBar) {
      const healthPercent = (enemy.hp / enemy.maxHp) * 100;
      healthBar.style.width = `${healthPercent}%`;
    }

    addBattleLog(`Racun menyebabkan 10 damage pada ${enemy.name}!`);

    if (enemy.hp <= 0) {
      const enemyElement = document.getElementById(enemy.id);
      if (enemyElement) enemyElement.remove();
      gameState.enemy.characters = [];
      addBattleLog(`${enemy.name} dikalahkan!`);
      
      // Hapus efek poison jika ada
      if (gameState.enemy.poisoned) {
        gameState.enemy.poisoned = false;
        gameState.enemy.poisonTurns = 0;
      }
    }
  }

  updateGameUI();
  checkWinCondition();
}

function attackEnemy(attacker) {
  if (gameState.enemy.characters.length === 0) return;

  const enemy = gameState.enemy.characters[0];
  const damage = attacker.attack;

  enemy.hp -= damage;

  const healthBar = document.getElementById(`health-${enemy.id}`);
  if (healthBar) {
    const healthPercent = (enemy.hp / enemy.maxHp) * 100;
    healthBar.style.width = `${healthPercent}%`;
  }

  // Animasi serangan
  const attackerElement = document.getElementById(attacker.id);
  const enemyElement = document.getElementById(enemy.id);

  if (attackerElement) attackerElement.classList.add("attacking");
  if (enemyElement) enemyElement.classList.add("taking-damage");

  setTimeout(() => {
    if (attackerElement) attackerElement.classList.remove("attacking");
    if (enemyElement) enemyElement.classList.remove("taking-damage");
  }, 500);

  addBattleLog(`${attacker.name} menyerang ${enemy.name} dan menyebabkan ${damage} damage!`);

  if (enemy.hp <= 0) {
    if (enemyElement) enemyElement.remove();
    gameState.enemy.characters = [];

    // Hapus efek poison jika ada
    if (gameState.enemy.poisoned) {
      gameState.enemy.poisoned = false;
      gameState.enemy.poisonTurns = 0;
    }

    addBattleLog(`${enemy.name} dikalahkan!`);
  }
}

function attackPlayer(attacker) {
  if (gameState.player.characters.length === 0) return;

  const randomIndex = Math.floor(Math.random() * gameState.player.characters.length);
  const target = gameState.player.characters[randomIndex];
  const damage = attacker.attack;

  target.hp -= damage;

  const healthBar = document.getElementById(`health-${target.id}`);
  if (healthBar) {
    const healthPercent = (target.hp / target.maxHp) * 100;
    healthBar.style.width = `${healthPercent}%`;
  }

  const attackerElement = document.getElementById(attacker.id);
  const targetElement = document.getElementById(target.id);

  if (attackerElement) attackerElement.classList.add("attacking");
  if (targetElement) targetElement.classList.add("taking-damage");

  setTimeout(() => {
    if (attackerElement) attackerElement.classList.remove("attacking");
    if (targetElement) targetElement.classList.remove("taking-damage");
  }, 500);

  addBattleLog(`${attacker.name} menyerang ${target.name} dan menyebabkan ${damage} damage!`);

  if (target.hp <= 0) {
    if (targetElement) targetElement.remove();
    gameState.player.characters.splice(randomIndex, 1);
    addBattleLog(`${target.name} dikalahkan!`);
  }
}

function healAllies(healer) {
  if (gameState.player.characters.length <= 1) return;

  let lowestHp = Infinity;
  let target = null;

  gameState.player.characters.forEach((character) => {
    if (
      character.id !== healer.id &&
      character.hp < character.maxHp &&
      character.hp < lowestHp
    ) {
      lowestHp = character.hp;
      target = character;
    }
  });

  if (!target) return;

  const healAmount = healer.heal;
  target.hp = Math.min(target.hp + healAmount, target.maxHp);

  const healthBar = document.getElementById(`health-${target.id}`);
  if (healthBar) {
    const healthPercent = (target.hp / target.maxHp) * 100;
    healthBar.style.width = `${healthPercent}%`;
  }

  const healerElement = document.getElementById(healer.id);
  const targetElement = document.getElementById(target.id);

  if (healerElement) healerElement.classList.add("attacking");
  if (targetElement) targetElement.classList.add("healing");

  setTimeout(() => {
    if (healerElement) healerElement.classList.remove("attacking");
    if (targetElement) targetElement.classList.remove("healing");
  }, 500);

  addBattleLog(`${healer.name} memulihkan ${target.name} sebesar ${healAmount} HP!`);
}

export function endTurn() {
  gameState.turn++;

  // Isi ulang mana (50% dari max mana)
  gameState.player.mana = Math.min(
    gameState.player.mana + Math.floor(gameState.player.maxMana * 0.5),
    gameState.player.maxMana
  );

  // Tambah kartu karakter baru - panggil melalui event
  const addCharEvent = new CustomEvent('addCharacterCard');
  document.dispatchEvent(addCharEvent);

  // Tambah kartu spesial baru (kadang-kadang)
  if (Math.random() > 0.5) {
    const addSpecialEvent = new CustomEvent('addSpecialCard');
    document.dispatchEvent(addSpecialEvent);
  }

  // Kurangi durasi poison
  if (gameState.enemy.poisoned) {
    gameState.enemy.poisonTurns--;

    if (gameState.enemy.poisonTurns <= 0) {
      gameState.enemy.poisoned = false;

      // Hapus efek visual poison
      if (gameState.enemy.characters.length > 0) {
        const enemyElement = document.getElementById(gameState.enemy.characters[0].id);
        if (enemyElement) {
          enemyElement.classList.remove("poisoned");
          const poisonDot = document.getElementById(`poison-${gameState.enemy.characters[0].id}`);
          if (poisonDot) {
            poisonDot.remove();
          }
        }
      }

      addBattleLog("Efek racun telah habis!");
    } else {
      addBattleLog(`Racun masih aktif selama ${gameState.enemy.poisonTurns} giliran.`);
    }
  }

  updateGameUI();
  addBattleLog(`Giliran ${gameState.turn} dimulai! Mana diisi ulang.`);

  // Musuh melakukan serangan jika ada (setelah delay)
  if (gameState.enemy.characters.length > 0 && gameState.player.characters.length > 0) {
    setTimeout(() => {
      const enemy = gameState.enemy.characters[0];
      attackPlayer(enemy);
      updateGameUI();
      checkWinCondition();
    }, 1000);
  }
}

function checkWinCondition() {
  const spawnEnemyBtn = document.getElementById("spawnEnemyBtn");
  
  if (gameState.enemy.characters.length === 0) {
    addBattleLog("Selamat! Anda menang!");
    gameState.gameOver = true;
    if (spawnEnemyBtn) spawnEnemyBtn.disabled = true;
  } else if (gameState.player.characters.length === 0) {
    addBattleLog("Game Over! Anda kalah.");
    gameState.gameOver = true;
    if (spawnEnemyBtn) spawnEnemyBtn.disabled = true;
  }
}