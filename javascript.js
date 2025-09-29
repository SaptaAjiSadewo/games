document.addEventListener('DOMContentLoaded', function() {
    // Element references
    const characterDeck = document.getElementById('characterDeck');
    const specialDeck = document.getElementById('specialDeck');
    const enemyDeck = document.getElementById('enemyDeck');
    const playerBoard = document.getElementById('playerBoard');
    const enemyBoard = document.getElementById('enemyBoard');
    const enemySlot = document.getElementById('enemySlot');
    const enemyReturnArea = document.getElementById('enemyReturnArea');
    const resetBtn = document.getElementById('resetBtn');
    const addCardBtn = document.getElementById('addCardBtn');
    const spawnEnemyBtn = document.getElementById('spawnEnemyBtn');
    const endTurnBtn = document.getElementById('endTurnBtn');
    const addEnemyCardBtn = document.getElementById('addEnemyCardBtn');
    const playerHpElement = document.getElementById('playerHp');
    const playerManaElement = document.getElementById('playerMana');
    const enemyHpElement = document.getElementById('enemyHp');
    const battleLog = document.querySelector('.battle-log .log-content');
    
    // Game state
    let gameState = {
        player: {
            hp: 100,
            maxHp: 100,
            mana: 50,
            maxMana: 50,
            characters: []
        },
        enemy: {
            hp: 100,
            maxHp: 100,
            characters: [],
            poisoned: false,
            poisonTurns: 0
        },
        characterCards: [],
        specialCards: [],
        enemyCards: [],
        turn: 1,
        gameOver: false
    };
    
    // Data untuk kartu karakter
    const characterCardTypes = [
        { 
            type: 'warrior', 
            name: 'Warrior', 
            hp: 100, 
            attack: 15, 
            cost: 20,
            color: '#FF6B6B',
            symbol: '⚔️',
            description: 'Tank dengan HP tinggi'
        },
        { 
            type: 'archer', 
            name: 'Archer', 
            hp: 70, 
            attack: 25, 
            cost: 25,
            color: '#4ECDC4',
            symbol: '🏹',
            description: 'Serangan jarak jauh tinggi'
        },
        { 
            type: 'healer', 
            name: 'Healer', 
            hp: 80, 
            attack: 5, 
            cost: 30,
            color: '#FFE66D',
            symbol: '❤️',
            description: 'Memulihkan HP sekutu',
            heal: 20
        }
    ];
    
    // Data untuk kartu spesial
    const specialCardTypes = [
        { 
            type: 'heal-spell', 
            name: 'Heal', 
            cost: 15,
            symbol: '💚',
            description: 'Memulihkan 30 HP semua karakter',
            effect: 'heal'
        },
        { 
            type: 'poison-spell', 
            name: 'Poison', 
            cost: 20,
            symbol: '💜',
            description: 'Racuni musuh selama 3 giliran',
            effect: 'poison'
        }
    ];
    
    // Data untuk kartu musuh
    const enemyCardTypes = [
        { name: 'Goblin', hp: 60, attack: 10, symbol: '👺', cost: 10 },
        { name: 'Orc', hp: 100, attack: 15, symbol: '👹', cost: 15 },
        { name: 'Skeleton', hp: 50, attack: 20, symbol: '💀', cost: 12 },
        { name: 'Troll', hp: 120, attack: 18, symbol: '🧌', cost: 20 },
        { name: 'Wolf', hp: 40, attack: 25, symbol: '🐺', cost: 8 }
    ];
    
    // Inisialisasi game
    initializeGame();
    
    // Event listeners untuk tombol
    resetBtn.addEventListener('click', resetGame);
    addCardBtn.addEventListener('click', addRandomCharacterCard);
    spawnEnemyBtn.addEventListener('click', spawnEnemy);
    endTurnBtn.addEventListener('click', endTurn);
    addEnemyCardBtn.addEventListener('click', addRandomEnemyCard);
    
    function initializeGame() {
        // Buat 5 kartu karakter awal
        for (let i = 0; i < 5; i++) {
            addRandomCharacterCard();
        }
        
        // Buat 2 kartu spesial awal
        for (let i = 0; i < 2; i++) {
            addRandomSpecialCard();
        }
        
        // Buat 3 kartu musuh awal
        for (let i = 0; i < 3; i++) {
            addRandomEnemyCard();
        }
        
        // Update UI
        updateGameUI();
        
        // Log awal
        addBattleLog("Game dimulai! Seret kartu karakter ke area pemain untuk memanggil karakter.");
    }
    
    function addRandomCharacterCard() {
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
            heal: cardType.heal || 0
        };
        
        gameState.characterCards.push(card);
        createCharacterCardElement(card);
    }
    
    function addRandomSpecialCard() {
        const cardType = specialCardTypes[Math.floor(Math.random() * specialCardTypes.length)];
        const cardId = `special-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const card = {
            id: cardId,
            type: cardType.type,
            name: cardType.name,
            cost: cardType.cost,
            symbol: cardType.symbol,
            effect: cardType.effect
        };
        
        gameState.specialCards.push(card);
        createSpecialCardElement(card);
    }
    
    function addRandomEnemyCard() {
        const cardType = enemyCardTypes[Math.floor(Math.random() * enemyCardTypes.length)];
        const cardId = `enemy-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const card = {
            id: cardId,
            type: 'enemy',
            name: cardType.name,
            hp: cardType.hp,
            attack: cardType.attack,
            cost: cardType.cost,
            symbol: cardType.symbol
        };
        
        gameState.enemyCards.push(card);
        createEnemyCardElement(card);
    }
    
    function createCharacterCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.type}`;
        cardElement.id = card.id;
        cardElement.draggable = true;
        
        // Isi konten kartu
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
        
        // Tambahkan event listeners untuk drag & drop
        cardElement.addEventListener('dragstart', dragCharacterCardStart);
        cardElement.addEventListener('dragend', dragCharacterCardEnd);
        
        characterDeck.appendChild(cardElement);
    }
    
    function createSpecialCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${card.type}`;
        cardElement.id = card.id;
        cardElement.draggable = true;
        
        // Isi konten kartu
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
        
        // Tambahkan event listeners untuk drag & drop
        cardElement.addEventListener('dragstart', dragSpecialCardStart);
        cardElement.addEventListener('dragend', dragSpecialCardEnd);
        
        specialDeck.appendChild(cardElement);
    }
    
    function createEnemyCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = `card enemy-card`;
        cardElement.id = card.id;
        cardElement.draggable = true;
        
        // Isi konten kartu
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
        
        // Tambahkan event listeners untuk drag & drop
        cardElement.addEventListener('dragstart', dragEnemyCardStart);
        cardElement.addEventListener('dragend', dragEnemyCardEnd);
        
        enemyDeck.appendChild(cardElement);
    }
    
    function dragCharacterCardStart(e) {
        // Cek apakah player punya cukup mana
        const cardId = e.target.id;
        const card = gameState.characterCards.find(c => c.id === cardId);
        
        if (card && gameState.player.mana >= card.cost) {
            e.dataTransfer.setData('text/plain', cardId);
            e.dataTransfer.setData('type', 'character');
            e.target.style.opacity = '0.7';
        } else {
            e.preventDefault();
            if (card) {
                addBattleLog(`Tidak cukup mana! Butuh ${card.cost} mana.`);
            }
        }
    }
    
    function dragCharacterCardEnd(e) {
        e.target.style.opacity = '1';
    }
    
    function dragSpecialCardStart(e) {
        // Cek apakah player punya cukup mana
        const cardId = e.target.id;
        const card = gameState.specialCards.find(c => c.id === cardId);
        
        if (card && gameState.player.mana >= card.cost) {
            e.dataTransfer.setData('text/plain', cardId);
            e.dataTransfer.setData('type', 'special');
            e.target.style.opacity = '0.7';
        } else {
            e.preventDefault();
            if (card) {
                addBattleLog(`Tidak cukup mana! Butuh ${card.cost} mana.`);
            }
        }
    }
    
    function dragSpecialCardEnd(e) {
        e.target.style.opacity = '1';
    }
    
    function dragEnemyCardStart(e) {
        const cardId = e.target.id;
        const card = gameState.enemyCards.find(c => c.id === cardId);
        
        if (card) {
            e.dataTransfer.setData('text/plain', cardId);
            e.dataTransfer.setData('type', 'enemy');
            e.target.style.opacity = '0.7';
        }
    }
    
    function dragEnemyCardEnd(e) {
        e.target.style.opacity = '1';
    }
    
    // Event listeners untuk area drop (player board)
    playerBoard.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    playerBoard.addEventListener('drop', function(e) {
        e.preventDefault();
        
        const cardId = e.dataTransfer.getData('text/plain');
        const cardType = e.dataTransfer.getData('type');
        
        if (cardType === 'character') {
            const card = gameState.characterCards.find(c => c.id === cardId);
            
            if (card && gameState.player.mana >= card.cost) {
                // Hitung posisi drop relatif terhadap player board
                const boardRect = playerBoard.getBoundingClientRect();
                const x = e.clientX - boardRect.left - 50;
                const y = e.clientY - boardRect.top - 60;
                
                // Pindahkan kartu ke player board dan buat karakter
                const cardElement = document.getElementById(cardId);
                cardElement.remove();
                
                // Kurangi mana
                gameState.player.mana -= card.cost;
                
                // Buat karakter
                createCharacter(card, x, y);
                
                // Hapus kartu dari deck
                gameState.characterCards = gameState.characterCards.filter(c => c.id !== cardId);
                
                // Update UI
                updateGameUI();
                
                // Log
                addBattleLog(`Memanggil ${card.name}! (-${card.cost} mana)`);
                
                // Mulai pertempuran jika ada musuh
                startBattle();
            }
        } else if (cardType === 'special') {
            const card = gameState.specialCards.find(c => c.id === cardId);
            
            if (card && gameState.player.mana >= card.cost) {
                // Gunakan kartu spesial
                useSpecialCard(card);
                
                // Hapus kartu dari deck
                const cardElement = document.getElementById(cardId);
                cardElement.remove();
                gameState.specialCards = gameState.specialCards.filter(c => c.id !== cardId);
                
                // Update UI
                updateGameUI();
            }
        }
    });
    
    // Event listeners untuk area drop (enemy board)
    enemyBoard.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    enemyBoard.addEventListener('drop', function(e) {
        e.preventDefault();
        
        const cardId = e.dataTransfer.getData('text/plain');
        const cardType = e.dataTransfer.getData('type');
        
        if (cardType === 'enemy') {
            const card = gameState.enemyCards.find(c => c.id === cardId);
            
            if (card && gameState.enemy.characters.length === 0) {
                // Pindahkan kartu ke enemy board dan buat musuh
                const cardElement = document.getElementById(cardId);
                cardElement.remove();
                
                // Buat musuh
                spawnEnemyFromCard(card);
                
                // Hapus kartu dari deck
                gameState.enemyCards = gameState.enemyCards.filter(c => c.id !== cardId);
                
                // Update UI
                updateGameUI();
                
                // Log
                addBattleLog(`Memanggil musuh ${card.name}!`);
                
                // Mulai pertempuran jika ada karakter pemain
                startBattle();
            } else if (gameState.enemy.characters.length > 0) {
                addBattleLog("Sudah ada musuh di papan!");
            }
        }
    });
    
    // Event listener untuk area kembali (enemy)
    enemyReturnArea.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    enemyReturnArea.addEventListener('drop', function(e) {
        e.preventDefault();
        
        const characterId = e.dataTransfer.getData('text/plain');
        
        // Cek jika yang di-drop adalah karakter musuh
        if (characterId.startsWith('enemy-')) {
            const enemy = gameState.enemy.characters.find(c => c.id === characterId);
            
            if (enemy) {
                // Hapus musuh dari papan
                const enemyElement = document.getElementById(characterId);
                enemyElement.remove();
                
                // Hapus dari state
                gameState.enemy.characters = gameState.enemy.characters.filter(c => c.id !== characterId);
                
                // Tambahkan kartu musuh baru ke deck
                addRandomEnemyCard();
                
                // Hapus efek poison jika ada
                if (gameState.enemy.poisoned) {
                    gameState.enemy.poisoned = false;
                    gameState.enemy.poisonTurns = 0;
                }
                
                // Update UI
                updateGameUI();
                
                // Log
                addBattleLog(`Mengembalikan ${enemy.name} ke deck musuh.`);
            }
        }
    });
    
    function useSpecialCard(card) {
        // Kurangi mana
        gameState.player.mana -= card.cost;
        
        // Terapkan efek berdasarkan jenis kartu
        if (card.effect === 'heal') {
            // Heal semua karakter pemain
            gameState.player.characters.forEach(character => {
                character.hp = Math.min(character.hp + 30, character.maxHp);
                
                // Update health bar
                const healthBar = document.getElementById(`health-${character.id}`);
                if (healthBar) {
                    const healthPercent = (character.hp / character.maxHp) * 100;
                    healthBar.style.width = `${healthPercent}%`;
                }
                
                // Animasi heal
                const characterElement = document.getElementById(character.id);
                if (characterElement) {
                    characterElement.classList.add('healing');
                    setTimeout(() => {
                        characterElement.classList.remove('healing');
                    }, 500);
                }
            });
            
            addBattleLog(`Menggunakan ${card.name}! Semua karakter dipulihkan 30 HP.`);
        } else if (card.effect === 'poison') {
            // Racuni musuh
            if (gameState.enemy.characters.length > 0) {
                gameState.enemy.poisoned = true;
                gameState.enemy.poisonTurns = 3;
                
                const enemyElement = document.getElementById(gameState.enemy.characters[0].id);
                if (enemyElement) {
                    enemyElement.classList.add('poisoned');
                    
                    // Tambahkan indikator poison
                    const poisonDot = document.createElement('div');
                    poisonDot.className = 'poison-dot';
                    poisonDot.textContent = 'P';
                    poisonDot.id = `poison-${gameState.enemy.characters[0].id}`;
                    enemyElement.appendChild(poisonDot);
                    
                    enemyElement.classList.add('poisoning');
                    setTimeout(() => {
                        enemyElement.classList.remove('poisoning');
                    }, 500);
                }
                
                addBattleLog(`Menggunakan ${card.name}! Musuh diracuni selama 3 giliran.`);
            } else {
                addBattleLog(`Tidak ada musuh untuk diracuni!`);
            }
        }
    }
    
    function createCharacter(cardData, x, y) {
        const characterId = `char-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
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
            y: y
        };
        
        gameState.player.characters.push(character);
        createCharacterElement(character, playerBoard);
    }
    
    function createCharacterElement(character, board) {
        const characterElement = document.createElement('div');
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
        
        // Buat karakter dapat diseret juga
        characterElement.draggable = true;
        characterElement.addEventListener('dragstart', dragCharacterStart);
        characterElement.addEventListener('dragend', dragCharacterEnd);
        
        board.appendChild(characterElement);
    }
    
    function dragCharacterStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.style.opacity = '0.7';
    }
    
    function dragCharacterEnd(e) {
        e.target.style.opacity = '1';
    }
    
    // Event listeners untuk memindahkan karakter di player board
    playerBoard.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    playerBoard.addEventListener('drop', function(e) {
        e.preventDefault();
        
        const characterId = e.dataTransfer.getData('text/plain');
        if (characterId.startsWith('char-')) {
            const characterElement = document.getElementById(characterId);
            const character = gameState.player.characters.find(c => c.id === characterId);
            
            if (characterElement && character) {
                // Hitung posisi baru
                const boardRect = playerBoard.getBoundingClientRect();
                const x = e.clientX - boardRect.left - 50;
                const y = e.clientY - boardRect.top - 60;
                
                // Update posisi
                characterElement.style.left = `${x}px`;
                characterElement.style.top = `${y}px`;
                
                character.x = x;
                character.y = y;
            }
        }
    });
    
    function spawnEnemy() {
        if (gameState.enemy.characters.length >= 1) {
            addBattleLog("Sudah ada musuh di papan!");
            return;
        }
        
        const enemyType = enemyCardTypes[Math.floor(Math.random() * enemyCardTypes.length)];
        spawnEnemyFromCard(enemyType);
        
        // Update UI
        updateGameUI();
        
        // Log
        addBattleLog(`Memanggil musuh ${enemyType.name}!`);
        
        // Mulai pertempuran jika ada karakter pemain
        startBattle();
    }
    
    function spawnEnemyFromCard(cardData) {
        const enemyId = `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        const enemy = {
            id: enemyId,
            name: cardData.name,
            hp: cardData.hp,
            maxHp: cardData.hp,
            attack: cardData.attack,
            symbol: cardData.symbol
        };
        
        gameState.enemy.characters.push(enemy);
        createEnemyElement(enemy);
    }
    
    function createEnemyElement(enemy) {
        const enemyElement = document.createElement('div');
        enemyElement.className = 'character enemy';
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
        
        // Buat musuh dapat diseret
        enemyElement.draggable = true;
        enemyElement.addEventListener('dragstart', dragCharacterStart);
        enemyElement.addEventListener('dragend', dragCharacterEnd);
        
        enemyBoard.appendChild(enemyElement);
    }
    
    function startBattle() {
        if (gameState.player.characters.length === 0 || gameState.enemy.characters.length === 0) {
            return;
        }
        
        // Untuk setiap karakter pemain, lakukan aksi
        gameState.player.characters.forEach(character => {
            if (character.type === 'healer') {
                // Healer memulihkan HP karakter lain yang paling rendah
                healAllies(character);
            } else {
                // Warrior dan Archer menyerang musuh
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
            
            // Update health bar
            const healthBar = document.getElementById(`health-${enemy.id}`);
            if (healthBar) {
                const healthPercent = (enemy.hp / enemy.maxHp) * 100;
                healthBar.style.width = `${healthPercent}%`;
            }
            
            addBattleLog(`Racun menyebabkan 10 damage pada ${enemy.name}!`);
            
            // Cek jika musuh mati karena racun
            if (enemy.hp <= 0) {
                const enemyElement = document.getElementById(enemy.id);
                enemyElement.remove();
                gameState.enemy.characters = [];
                addBattleLog(`${enemy.name} dikalahkan!`);
            }
        }
        
        // Update UI
        updateGameUI();
        
        // Cek kondisi kemenangan
        checkWinCondition();
    }
    
    function attackEnemy(attacker) {
        if (gameState.enemy.characters.length === 0) return;
        
        const enemy = gameState.enemy.characters[0];
        const damage = attacker.attack;
        
        // Kurangi HP musuh
        enemy.hp -= damage;
        
        // Update health bar
        const healthBar = document.getElementById(`health-${enemy.id}`);
        if (healthBar) {
            const healthPercent = (enemy.hp / enemy.maxHp) * 100;
            healthBar.style.width = `${healthPercent}%`;
        }
        
        // Animasi serangan
        const attackerElement = document.getElementById(attacker.id);
        const enemyElement = document.getElementById(enemy.id);
        
        if (attackerElement) attackerElement.classList.add('attacking');
        if (enemyElement) enemyElement.classList.add('taking-damage');
        
        setTimeout(() => {
            if (attackerElement) attackerElement.classList.remove('attacking');
            if (enemyElement) enemyElement.classList.remove('taking-damage');
        }, 500);
        
        // Log
        addBattleLog(`${attacker.name} menyerang ${enemy.name} dan menyebabkan ${damage} damage!`);
        
        // Cek jika musuh mati
        if (enemy.hp <= 0) {
            enemyElement.remove();
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
        
        // Pilih karakter pemain secara acak
        const randomIndex = Math.floor(Math.random() * gameState.player.characters.length);
        const target = gameState.player.characters[randomIndex];
        const damage = attacker.attack;
        
        // Kurangi HP karakter
        target.hp -= damage;
        
        // Update health bar
        const healthBar = document.getElementById(`health-${target.id}`);
        if (healthBar) {
            const healthPercent = (target.hp / target.maxHp) * 100;
            healthBar.style.width = `${healthPercent}%`;
        }
        
        // Animasi serangan
        const attackerElement = document.getElementById(attacker.id);
        const targetElement = document.getElementById(target.id);
        
        if (attackerElement) attackerElement.classList.add('attacking');
        if (targetElement) targetElement.classList.add('taking-damage');
        
        setTimeout(() => {
            if (attackerElement) attackerElement.classList.remove('attacking');
            if (targetElement) targetElement.classList.remove('taking-damage');
        }, 500);
        
        // Log
        addBattleLog(`${attacker.name} menyerang ${target.name} dan menyebabkan ${damage} damage!`);
        
        // Cek jika karakter mati
        if (target.hp <= 0) {
            targetElement.remove();
            gameState.player.characters.splice(randomIndex, 1);
            addBattleLog(`${target.name} dikalahkan!`);
        }
    }
    
    function healAllies(healer) {
        if (gameState.player.characters.length <= 1) return;
        
        // Cari karakter dengan HP terendah (bukan healer sendiri)
        let lowestHp = Infinity;
        let target = null;
        let targetIndex = -1;
        
        gameState.player.characters.forEach((character, index) => {
            if (character.id !== healer.id && character.hp < character.maxHp && character.hp < lowestHp) {
                lowestHp = character.hp;
                target = character;
                targetIndex = index;
            }
        });
        
        if (!target) return;
        
        // Pulihkan HP
        const healAmount = healer.heal;
        target.hp = Math.min(target.hp + healAmount, target.maxHp);
        
        // Update health bar
        const healthBar = document.getElementById(`health-${target.id}`);
        if (healthBar) {
            const healthPercent = (target.hp / target.maxHp) * 100;
            healthBar.style.width = `${healthPercent}%`;
        }
        
        // Animasi heal
        const healerElement = document.getElementById(healer.id);
        const targetElement = document.getElementById(target.id);
        
        if (healerElement) healerElement.classList.add('attacking');
        if (targetElement) targetElement.classList.add('healing');
        
        setTimeout(() => {
            if (healerElement) healerElement.classList.remove('attacking');
            if (targetElement) targetElement.classList.remove('healing');
        }, 500);
        
        // Log
        addBattleLog(`${healer.name} memulihkan ${target.name} sebesar ${healAmount} HP!`);
    }
    
    function endTurn() {
        // Tambah turn
        gameState.turn++;
        
        // Isi ulang mana (50% dari max mana)
        gameState.player.mana = Math.min(gameState.player.mana + Math.floor(gameState.player.maxMana * 0.5), gameState.player.maxMana);
        
        // Tambah kartu karakter baru
        addRandomCharacterCard();
        
        // Tambah kartu spesial baru (kadang-kadang)
        if (Math.random() > 0.5) {
            addRandomSpecialCard();
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
                        enemyElement.classList.remove('poisoned');
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
        
        // Update UI
        updateGameUI();
        
        // Log
        addBattleLog(`Giliran ${gameState.turn} dimulai! Mana diisi ulang.`);
        
        // Musuh melakukan serangan jika ada
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
        if (gameState.enemy.characters.length === 0) {
            addBattleLog("Selamat! Anda menang!");
            gameState.gameOver = true;
            spawnEnemyBtn.disabled = true;
        } else if (gameState.player.characters.length === 0) {
            addBattleLog("Game Over! Anda kalah.");
            gameState.gameOver = true;
            spawnEnemyBtn.disabled = true;
        }
    }
    
    function updateGameUI() {
        playerHpElement.textContent = gameState.player.hp;
        playerManaElement.textContent = gameState.player.mana;
        
        if (gameState.enemy.characters.length > 0) {
            enemyHpElement.textContent = gameState.enemy.characters[0].hp;
        } else {
            enemyHpElement.textContent = "0";
        }
        
        // Nonaktifkan tombol jika game over
        addCardBtn.disabled = gameState.gameOver;
        spawnEnemyBtn.disabled = gameState.gameOver || gameState.enemy.characters.length > 0;
    }
    
    function addBattleLog(message) {
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.textContent = `[Turn ${gameState.turn}] ${message}`;
        
        battleLog.appendChild(logEntry);
        
        // Scroll ke bawah
        battleLog.scrollTop = battleLog.scrollHeight;
    }
    
    function resetGame() {
        // Reset state
        gameState = {
            player: {
                hp: 100,
                maxHp: 100,
                mana: 50,
                maxMana: 50,
                characters: []
            },
            enemy: {
                hp: 100,
                maxHp: 100,
                characters: [],
                poisoned: false,
                poisonTurns: 0
            },
            characterCards: [],
            specialCards: [],
            enemyCards: [],
            turn: 1,
            gameOver: false
        };
        
        // Clear UI
        characterDeck.innerHTML = '';
        specialDeck.innerHTML = '';
        enemyDeck.innerHTML = '';
        playerBoard.innerHTML = '<div class="board-label">Area Pemain</div>';
        enemyBoard.innerHTML = `
            <div class="board-label">Area Musuh</div>
            <div class="enemy-slot" id="enemySlot">Taruh Musuh Di Sini</div>
            <div class="return-area" id="enemyReturnArea">
                <div>⬅ Kembalikan</div>
            </div>
        `;
        battleLog.innerHTML = '';
        
        // Re-get element references
        enemySlot = document.getElementById('enemySlot');
        enemyReturnArea = document.getElementById('enemyReturnArea');
        
        // Re-attach event listeners
        enemyReturnArea.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        enemyReturnArea.addEventListener('drop', function(e) {
            e.preventDefault();
            
            const characterId = e.dataTransfer.getData('text/plain');
            
            // Cek jika yang di-drop adalah karakter musuh
            if (characterId.startsWith('enemy-')) {
                const enemy = gameState.enemy.characters.find(c => c.id === characterId);
                
                if (enemy) {
                    // Hapus musuh dari papan
                    const enemyElement = document.getElementById(characterId);
                    enemyElement.remove();
                    
                    // Hapus dari state
                    gameState.enemy.characters = gameState.enemy.characters.filter(c => c.id !== characterId);
                    
                    // Tambahkan kartu musuh baru ke deck
                    addRandomEnemyCard();
                    
                    // Hapus efek poison jika ada
                    if (gameState.enemy.poisoned) {
                        gameState.enemy.poisoned = false;
                        gameState.enemy.poisonTurns = 0;
                    }
                    
                    // Update UI
                    updateGameUI();
                    
                    // Log
                    addBattleLog(`Mengembalikan ${enemy.name} ke deck musuh.`);
                }
            }
        });
        
        // Initialize kembali
        initializeGame();
        
        // Enable tombol
        spawnEnemyBtn.disabled = false;
    }
});