export let gameState = {
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
export const characterCardTypes = [
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
export const specialCardTypes = [
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
export const enemyCardTypes = [
    { name: 'Goblin', hp: 60, attack: 10, symbol: '👺', cost: 10 },
    { name: 'Orc', hp: 100, attack: 15, symbol: '👹', cost: 15 },
    { name: 'Skeleton', hp: 50, attack: 20, symbol: '💀', cost: 12 },
    { name: 'Troll', hp: 120, attack: 18, symbol: '🧌', cost: 20 },
    { name: 'Wolf', hp: 40, attack: 25, symbol: '🐺', cost: 8 }
];

export function initializeGame() {
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
}

export function resetGame() {
    initializeGame();
    // Clear UI elements
    document.getElementById('characterDeck').innerHTML = '';
    document.getElementById('specialDeck').innerHTML = '';
    document.getElementById('enemyDeck').innerHTML = '';
    document.getElementById('playerBoard').innerHTML = '<div class="board-label">Area Pemain</div>';
    document.getElementById('enemyBoard').innerHTML = `
        <div class="board-label">Area Musuh</div>
        <div class="enemy-slot" id="enemySlot">Taruh Musuh Di Sini</div>
        <div class="return-area" id="enemyReturnArea">
            <div>⬅ Kembalikan</div>
        </div>
    `;
    document.querySelector('.battle-log .log-content').innerHTML = '';
    
    // Reinitialize
    setTimeout(() => {
        // Tambahkan kartu awal langsung dari main.js
        const event = new Event('reinitializeGame');
        document.dispatchEvent(event);
    }, 100);
}