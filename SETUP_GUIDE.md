# Energy Quest: Misteri Hemat Listrik - Setup Guide

## 📋 Ringkasan Game
Game edukasi 3D berbasis web tentang penghematan energi listrik dengan 4 level interaktif:
- **Level 1**: Ruang Tamu Gelap - Perbaiki rangkaian listrik
- **Level 2**: Dapur - Kelola efisiensi perangkat
- **Level 3**: Laboratorium - Simulasi tagihan listrik dengan rumus real
- **Level 4**: Quiz - 10 soal acak dari 20 soal tentang kelistrikan

## 🎯 Spesifikasi Game Ready

### Fixed Positions (Tidak Random)
Semua objek menggunakan koordinat fixed sesuai spesifikasi:

**Level 1:**
- Battery: (-2, 0, 0)
- Switch: (0, 0, 0)
- Lamp: (2, 0, 0)
- Old TV: (4, 0, 0)

**Level 2:**
- Fridge: (-3, 0, 0) - 150W
- Rice Cooker: (-1, 0, 0) - 400W
- Fan: (1, 0, 0) - 50W
- Iron: (3, 0, 0) - 1000W

**Level 3:**
- AC: (0, 2, 0) - 1000W
- TV: (2, 0, 0) - 100W
- Lamp: (-2, 0, 0) - 15W
- Fridge: (-4, 0, 0) - 150W

### Collision Detection
- Menggunakan `THREE.Box3` untuk collision check
- Tolerance: 0.1 unit untuk snap detection
- Jika posisi salah, objek kembali ke posisi awal

### Rumus Energi Real
```javascript
// Rumus Energi (kWh)
E = (P × t) / 1000
// E = Energi (kWh)
// P = Daya (Watt)
// t = Waktu (jam)

// Rumus Tagihan
Tagihan = E × Tarif per kWh
// Tarif default: Rp 1.500/kWh
// Target Level 3: ≤ Rp 300.000
```

### Fisher-Yates Shuffle
Quiz menggunakan Fisher-Yates shuffle algorithm untuk randomize 10 dari 20 soal:
```javascript
function shuffle(array) {
  let currentIndex = array.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}
```

## 📦 Download GLTF Models

### Step 1: Download Models dari URLs
Lihat file `client/public/models/README.md` untuk daftar lengkap URLs.

**Prioritas Download:**
1. **Japanese Schoolgirl Character** (karakter utama)
2. **Living Room Dark** (Level 1 environment)
3. **Kitchen Appliances** (Level 2: fridge, rice cooker, fan, iron)
4. **Lab Equipment** (Level 3)
5. **Electrical Items** (battery, switch, lamp, old TV)

### Step 2: Konversi ke GLB
Jika model dalam format `.gltf` + textures:
```bash
# Install gltf-pipeline
npm install -g gltf-pipeline

# Convert to GLB
gltf-pipeline -i model.gltf -o model.glb
```

### Step 3: Optimize Models
```bash
# Install gltf-transform
npm install -g @gltf-transform/cli

# Optimize size
gltf-transform optimize input.glb output.glb
```

### Step 4: Place Files
```
client/public/models/
├── characters/
│   └── japanese-girl.glb
├── rooms/
│   ├── livingroom-dark.glb
│   ├── kitchen-real.glb
│   ├── lab-real.glb
│   └── basement-door.glb
├── items/
│   ├── battery-real.glb
│   ├── switch-real.glb
│   ├── lamp-real.glb
│   ├── oldtv-real.glb
│   ├── fridge-real.glb
│   ├── ricecooker-real.glb
│   ├── fan-real.glb
│   ├── iron-real.glb
│   ├── ac-real.glb
│   └── key-glowing.glb
└── sounds/
    ├── click.mp3
    ├── buzz.mp3
    ├── music.mp3
    ├── reporter.mp3
    └── ilmuwan.mp3
```

## 🎮 Cara Menjalankan Game

### Development Mode
```bash
# Install dependencies (sudah dilakukan)
npm install

# Run development server (sudah berjalan)
npm run dev

# Game akan tersedia di http://localhost:5000
```

### Menggunakan Updated Levels
Untuk menggunakan level yang sudah di-update dengan GLTF models dan fixed positions:

1. **Replace Level Components:**
   ```bash
   # Backup existing levels
   mv client/src/components/game/Level1.tsx client/src/components/game/Level1.backup.tsx
   mv client/src/components/game/Level2.tsx client/src/components/game/Level2.backup.tsx
   mv client/src/components/game/Level3.tsx client/src/components/game/Level3.backup.tsx
   
   # Use updated versions
   mv client/src/components/game/Level1Updated.tsx client/src/components/game/Level1.tsx
   mv client/src/components/game/Level2Updated.tsx client/src/components/game/Level2.tsx
   mv client/src/components/game/Level3Updated.tsx client/src/components/game/Level3.tsx
   ```

2. **Restart Development Server:**
   Workflow akan auto-restart setelah file changes.

## 🔧 Fallback System
Game sudah dilengkapi dengan fallback geometries jika GLTF models belum tersedia:
- Battery: Box dengan terminal merah/biru
- Switch: Box dengan toggle indicator
- Lamp: Sphere dengan emissive material
- TV: Box dengan screen effect
- Kitchen/Lab devices: Colored boxes dengan LED indicators

**Models akan otomatis di-load jika tersedia, fallback jika tidak.**

## 📊 Fitur Game Ready

### ✅ Sudah Diimplementasikan:
- [x] Fixed positions untuk semua objek (tidak random)
- [x] Collision detection dengan THREE.Box3
- [x] Energy calculation formula: E = (P × t) / 1000
- [x] Billing system dengan tarif Rp 1.500/kWh
- [x] Fisher-Yates shuffle untuk quiz
- [x] 20 soal quiz tentang kelistrikan
- [x] Power meter visual (Level 2)
- [x] Bill meter visual (Level 3)
- [x] Fallback geometries untuk development
- [x] GLTF Model loader utility
- [x] OrbitControls dengan damping
- [x] Shadow casting & receiving
- [x] Emissive materials untuk efek lighting
- [x] State management dengan Zustand
- [x] LocalStorage untuk save/load progress
- [x] Audio system (background music, SFX)

### 📋 TODO untuk Production:
- [ ] Download semua GLTF models dari URLs
- [ ] Test dan optimize model scales
- [ ] Add character animation dengan AnimationMixer
- [ ] Add drag/drop interaction untuk character
- [ ] Record voice narration untuk reporter dan ilmuwan
- [ ] Add particle effects untuk kunci energi
- [ ] Mobile touch controls optimization
- [ ] Performance optimization untuk low-end devices

## 🎓 Educational Content

### Level 1: Rangkaian Listrik
**Konsep:** Rangkaian tertutup, aliran arus dari positif ke negatif

### Level 2: Efisiensi Energi  
**Konsep:** Power meter, device management, efficiency calculation

### Level 3: Tagihan Listrik
**Konsep:** kWh calculation, billing system, real-world energy cost
**Formula:** E = (P × t) / 1000, Tagihan = E × 1500

### Level 4: Quiz
**Konsep:** 20 soal tentang dasar listrik, efisiensi, tagihan, rangkaian

## 🚀 Next Steps

1. **Download Models:** Mulai dari character dan room models
2. **Test Game:** Jalankan dan test semua 4 levels
3. **Adjust Scales:** Sesuaikan scale models jika terlalu besar/kecil
4. **Add Sounds:** Download dan tambahkan sound effects
5. **Polish:** Add visual effects, animations, polish UI

## 📞 Support

Jika ada error atau pertanyaan:
- Check browser console untuk error messages
- Verify model paths di `client/public/models/`
- Check network tab untuk failed model loads
- Review fallback geometries jika models tidak load

---

**Game Status:** ✅ Migration Complete - Ready for model integration

Semua level sudah game ready dengan:
- Fixed positions ✓
- Real formulas ✓
- Collision detection ✓
- Fisher-Yates shuffle ✓
- Fallback system ✓
