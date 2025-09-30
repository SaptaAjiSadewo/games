# 🎮 RPG Card Game - Neo Brutalism

Game Modular Javascript kartu RPG dengan tema neo-brutalism yang memungkinkan pemain untuk mengumpulkan kartu karakter, memanggil musuh, dan bertarung dalam pertempuran strategis dengan neo-brutalism design.

## 🚀 Live Demo
[https://saptaajisadewo.github.io/games/]


## ✨ Fitur Utama - User Feature

- **🎴 Sistem Kartu Dinamis**: Drag & drop kartu karakter dan musuh
- **⚔️ Multiple Character Classes**: Warrior, Archer, dan Healer dengan kemampuan unik
- **👹 Musuh Bervariasi**: Berbagai jenis musuh dengan karakteristik berbeda
- **🔮 Kartu Spesial**: Heal dan Poison dengan efek khusus
- **🎨 Desain Neo Brutalism**: Estetika bold dengan warna kontras dan shadow tegas
- **🔄 Mekanik Pengembalian**: Kembalikan karakter/musuh ke deck
- **📊 Sistem Mana & Giliran**: Manajemen resource strategis

## ✨ Developer Feature
- **Modular ES6 Architecture** - Clean, maintainable code structure
- **Drag & Drop Gameplay** - Intuitive card-based interactions
- **Multiple Character Classes** - Warrior, Archer, Healer with unique abilities
- **Strategic Combat** - Turn-based battles with mana management
- **Special Card Effects** - Heal and Poison spells
- **Neo Brutalism UI** - Bold, high-contrast visual design

## 🛠️ Teknologi yang Digunakan

- **HTML5** dengan Drag & Drop API
- **CSS3** dengan Grid & Flexbox layout
- **JavaScript ES6+** dengan modular game logic
- **Neo Brutalism Design Principles**

## 🚀 Cara Menjalankan

### Opsi 1: Local Development
```bash
# Clone repository
git clone https://github.com/SaptaAjiSadewo/games.git

# Masuk ke direktori project
cd games

# Buka file index.html di browser
dengan live-preview atau live server
```

### Opsi 2: Direct File
1. Download semua file (`index.html`, `style.css`, `script.js`)
2. Buka `index.html` di browser web modern

## 🎯 Cara Bermain

### Basic Gameplay
1. **Memanggil Karakter**: 
   - Seret kartu dari **Deck Karakter** (atas) ke **Area Pemain**
   - Setiap kartu membutuhkan **Mana**

2. **Memanggil Musuh**:
   - Seret kartu dari **Deck Musuh** (bawah) ke **Area Musuh**
   - Gunakan tombol "Panggil Musuh" untuk musuh random

3. **Pertempuran**:
   - Karakter secara otomatis menyerang musuh
   - Healer akan memulihkan HP sekutu
   - Musuh akan membalas serangan

### Jenis Karakter

| Karakter | HP | Attack | Cost | Ability |
|----------|----|--------|------|---------|
| 🗡️ Warrior | 100 | 15 | 20 | Tank dengan HP tinggi |
| 🏹 Archer | 70 | 25 | 25 | Serangan jarak jauh |
| ❤️ Healer | 80 | 5 | 30 | Memulihkan 20 HP sekutu |

### Kartu Spesial

| Kartu | Cost | Effect |
|-------|------|--------|
| 💚 Heal | 15 | Memulihkan 30 HP semua karakter |
| 💜 Poison | 20 | Racun musuh (10 damage/giliran, 3 giliran) |

### Kontrol Game
- **Reset Game**: Mengulang game dari awal
- **Tambah Kartu Karakter**: Menambah kartu karakter ke deck
- **Panggil Musuh**: Memunculkan musuh random
- **Akhir Giliran**: Menyelesaikan giliran, mengisi ulang mana
- **Tambah Kartu Musuh**: Menambah kartu musuh ke deck

## 🗂️ Struktur Project

```
rpg-card-game/
├── index.html        # Main HTML structure
├── style.css         # Neo brutalism styling
├── README.md         # Project documentation
└── js/               # Modular JavaScript
├── main.js           # Application entry point
├── gameState.js      # Game state management
├── cardManager.js    # Card creation & management
├── battleSystem.js   # Combat logic & turn management
├── uiManager.js      # UI rendering & updates
└── dragDrop.js       # Drag and drop handlers
```

### File Structure Details - Old version

- **index.html**: Struktur utama dengan area game terbagi:
  - Header dengan game info
  - Kartu Karakter (atas)
  - Area Musuh & Pemain + Kontrol (tengah)
  - Kartu Musuh & Spesial (bawah)
  - Battle log & instructions

- **style.css**: Implementasi tema neo-brutalism:
  - Color palette bold dengan kontras tinggi
  - Shadow tebal tanpa blur
  - Border hitam tegas
  - Grid & flexbox untuk layout responsif

- **script.js**: Game engine mencakup:
  - Drag & drop system
  - Battle mechanics
  - Character/monster classes
  - Turn-based system
  - Card management

## 🎨 Neo Brutalism Design

Game ini mengimplementasikan prinsip desain neo-brutalism:

- **Warna Kontras Tinggi**: Palette vibrant dengan background terang
- **Shadow Tegas**: Bayangan hitam 8px tanpa blur
- **Border Bold**: Outline hitam 3px pada semua elemen
- **Typography Strong**: Font bold dan uppercase untuk heading
- **Layout Asimetris**: Tata letak dinamis dan eksperimental

## 🔧 Technical Features

### Drag & Drop System
```javascript
// HTML5 Drag & Drop API
cardElement.draggable = true;
cardElement.addEventListener('dragstart', dragStart);
boardElement.addEventListener('drop', handleDrop);
```

### Game State Management
```javascript
let gameState = {
    player: { hp: 100, mana: 50, characters: [] },
    enemy: { hp: 100, characters: [], poisoned: false },
    characterCards: [],
    specialCards: [],
    enemyCards: [],
    turn: 1
};
```

### Battle Mechanics
- Auto-attack system
- Healer AI untuk memulihkan sekutu
- Poison damage over time
- Win/lose conditions

## 🐛 Known Issues & Improvements

### Current Limitations
- Hanya satu musuh yang bisa aktif sekaligus
- Animasi battle masih sederhana
- Tidak ada save/load system

### Potential Enhancements
- [ ] Multiplayer mode
- [ ] Deck building system
- [ ] More character classes
- [ ] Enhanced animations
- [ ] Sound effects
- [ ] Mobile responsiveness improvements

## 🔮 Planned Features
- Deck building system
- More character classes
- Enhanced animations
- Sound effects
- Mobile responsiveness
- Save/load functionality

## 🤝 Kontribusi

Kontribusi dipersilakan! Untuk berkontribusi:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/Feature`)
3. Commit changes (`git commit -m 'Add some Feature'`)
4. Push to branch (`git push origin feature/Feature`)
5. Open Pull Request

## 📝 Commit History

```
feat: initialize project structure with HTML base
feat: implement basic drag-and-drop card system
feat: add character classes (warrior, archer, healer)
feat: implement battle mechanics vs NPC monsters
style: apply neo brutalism theme to board and cards
fix: resolve card stacking and positioning issues
refactor: separate code into three modular files
feat: add special cards (heal, poison) with effects
feat: implement enemy card deck and return mechanics
style: reorganize layout with character cards on top
docs: create comprehensive README documentation
```

## 📄 Lisensi

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Pengembang

Dikembangkan dengan ❤️ menggunakan HTML, CSS, dan JavaScript.

---

**Tips**: Untuk pengalaman terbaik, gunakan browser modern dengan dukungan ES6+ dan pastikan JavaScript diaktifkan.

**👨‍💻 Dibuat oleh**
- Sapta Aji Sadewo - Initial development
- Deepseek - Modular architecture assistance
- Sapta Aji Sadewo dan Deepseek di malah hari.....

📄 License
- This project is licensed under the MIT License - see the LICENSE file for details.