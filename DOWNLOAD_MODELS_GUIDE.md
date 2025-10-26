# 📥 Panduan Download Model GLTF Realistik untuk Energy Quest

## ⚠️ PENTING
Game **TIDAK AKAN** menggunakan primitive shapes (cylinder, sphere, box) jika model GLTF sudah tersedia. Saat ini menggunakan fallback primitives karena model belum didownload.

## 🎯 Daftar Model yang Harus Didownload

### 1. KARAKTER (WAJIB)
**Japanese High School Girl**
- URL: https://sketchfab.com/3d-models/3d-character-of-a-japanese-high-school-girl-6cb1dd6ce3dc45248687c40947dbb150
- Download: Klik "Download 3D Model" → Pilih "glTF (Binary .glb)"
- Simpan sebagai: `client/public/models/characters/japanese-girl.glb`
- Kegunaan: Karakter player yang beranimasi, interact dengan objects

### 2. LEVEL 1: RUANG TAMU GELAP

**A. Living Room Dark Interior**
- URL: https://sketchfab.com/3d-models/livingroom-dark-interior-design-81a81d33930b4be59f25918e4c66baa8
- Simpan sebagai: `client/public/models/rooms/livingroom-dark.glb`
- Posisi: Background environment

**B. Battery Rack/Shutoff Switch**
- URL: https://sketchfab.com/3d-models/battery-shutoff-switch-3cabc19beae64a81b646d111d31c2db8
- Simpan sebagai: `client/public/models/items/battery-real.glb`
- Posisi Fixed: (-2, 0, 0) - Dekat rak buku di lantai
- **BUKAN cylinder merah** - Harus battery rack metal realistik

**C. Old Light Switch**
- URL: https://sketchfab.com/3d-models/old-light-switch-e25a92428502412d9b3a4a395f74f668
- Simpan sebagai: `client/public/models/items/switch-real.glb`
- Posisi Fixed: (0, 0, 0) - Di dinding
- **BUKAN box sederhana** - Harus saklar logam tua realistik

**D. Vintage Old TV**
- Cari di: https://www.turbosquid.com/Search/3D-Models/free-old-tv
- Pilih model TV tabung klasik Jepang (gratis)
- Simpan sebagai: `client/public/models/items/oldtv-real.glb`
- Posisi Fixed: (4, 0, 0) - Di dinding depan sofa
- **BUKAN box hitam** - Harus TV vintage realistik dengan screen

**E. Lamp Bulb**
- Cari di: https://free3d.com/3d-model/lamp-
- Pilih bohlam kaca nyata/lamp gantung
- Simpan sebagai: `client/public/models/items/lamp-real.glb`
- Posisi Fixed: (2, 0, 0) - Lampu gantung di plafon
- **BUKAN sphere putih** - Harus bulb/lamp realistik

### 3. LEVEL 2: DAPUR

**A. Kitchen Room**
- Cari di: https://www.cgtrader.com/free-3d-models/kitchen-appliance
- Download kitchen environment yang realistik
- Simpan sebagai: `client/public/models/rooms/kitchen-real.glb`

**B. Stainless Steel Fridge**
- URL: https://www.cgtrader.com/free-3d-models/kitchen-appliance (pilih fridge)
- Simpan sebagai: `client/public/models/items/fridge-real.glb`
- Posisi Fixed: (-3, 0, 0) - Pojok dapur
- Specs: 150W, kulkas stainless steel dengan pintu

**C. Rice Cooker**
- Cari di CGTrader: Rice cooker putih bulat realistik
- Simpan sebagai: `client/public/models/items/ricecooker-real.glb`
- Posisi Fixed: (-1, 0, 0) - Di meja dapur
- Specs: 400W

**D. Table Fan**
- Cari di CGTrader: Fan angin meja plastik
- Simpan sebagai: `client/public/models/items/fan-real.glb`
- Posisi Fixed: (1, 0, 0) - Di lantai
- Specs: 50W

**E. Steam Iron**
- Cari di CGTrader: Setrika uap besi
- Simpan sebagai: `client/public/models/items/iron-real.glb`
- Posisi Fixed: (3, 0, 0) - Di rak
- Specs: 1000W

### 4. LEVEL 3: LABORATORIUM

**A. Lab Equipment Room**
- URL: https://www.blenderkit.com/free-lab-equipment
- Download lab environment, export sebagai GLB
- Simpan sebagai: `client/public/models/rooms/lab-real.glb`

**B. Wall Air Conditioner**
- Cari di CGTrader: AC dinding putih realistik
- Simpan sebagai: `client/public/models/items/ac-real.glb`
- Posisi Fixed: (0, 2, 0) - Di dinding lab
- Specs: 1000W

**C. Blueprint Paper Roll**
- Cari di Sketchfab: "blueprint scroll" atau "rolled paper"
- Simpan sebagai: `client/public/models/items/blueprint.glb`
- Posisi: Di meja lab

### 5. LEVEL 4: BASEMENT

**A. Outdoor Cellar Door**
- URL: https://sketchfab.com/3d-models/outdoor-cellar-door-1d8736ede47149c0be75c99e47266047
- Simpan sebagai: `client/public/models/rooms/basement-door.glb`
- Posisi Fixed: (0, 1.5, -6) - Pintu besar di tengah basement

### 6. SPECIAL ITEMS

**Energy Key (Glowing)**
- Buat sphere glowing sederhana di Blender:
  ```
  1. Buat sphere
  2. Add emissive material gold
  3. Export sebagai GLB
  ```
- ATAU cari "glowing key" di Sketchfab
- Simpan sebagai: `client/public/models/items/key-glowing.glb`

## 📋 Cara Download dari Sketchfab

1. Buka link model
2. Login/Sign up (gratis)
3. Klik tombol **"Download 3D Model"**
4. Pilih format **"glTF (Binary .glb)"** atau **"glTF (.gltf + .bin + textures)"**
5. Jika pilih .gltf, convert ke .glb menggunakan:
   ```bash
   npx gltf-pipeline -i model.gltf -o model.glb
   ```
6. Rename file sesuai nama di atas
7. Paste ke folder yang sesuai

## 📋 Cara Download dari CGTrader

1. Buka https://www.cgtrader.com/free-3d-models
2. Search model (contoh: "kitchen fridge")
3. Filter: **Free models only** + **GLTF format**
4. Download dan extract
5. Jika format FBX/OBJ, import ke Blender → Export as GLB

## 📋 Cara Convert Model ke GLB di Blender

Jika model dalam format lain (FBX, OBJ, 3DS):

1. Buka Blender
2. File → Import → pilih format (FBX/OBJ/etc)
3. Select model
4. File → Export → glTF 2.0 (.glb/.gltf)
5. Pilih **glTF Binary (.glb)**
6. Export

## 🎨 Scale dan Positioning

Setelah model didownload, jika terlalu besar/kecil:

Edit di file Level component:
```tsx
<GLTFModel 
  modelPath={MODEL_PATHS.battery} 
  position={[-2, 0, 0]} 
  scale={2}  // Adjust ini jika model terlalu kecil
  // scale={0.5} // Adjust ini jika model terlalu besar
/>
```

## ✅ Checklist Download

Centang setelah download:

### Karakter & Rooms
- [ ] japanese-girl.glb (WAJIB untuk character)
- [ ] livingroom-dark.glb
- [ ] kitchen-real.glb
- [ ] lab-real.glb
- [ ] basement-door.glb

### Level 1 Items
- [ ] battery-real.glb (Metal rack, bukan cylinder merah)
- [ ] switch-real.glb (Saklar logam tua, bukan box)
- [ ] lamp-real.glb (Bohlam/lamp realistik, bukan sphere)
- [ ] oldtv-real.glb (TV vintage, bukan box hitam)

### Level 2 Items
- [ ] fridge-real.glb (Stainless steel dengan pintu)
- [ ] ricecooker-real.glb (Putih bulat)
- [ ] fan-real.glb (Kipas meja plastik)
- [ ] iron-real.glb (Setrika uap besi)

### Level 3 Items
- [ ] ac-real.glb (AC dinding putih)
- [ ] blueprint.glb (Kertas digulung)

### Special
- [ ] key-glowing.glb (Kunci energi)

## 🚀 Setelah Download Semua Models

1. Verify struktur folder:
   ```bash
   ls -R client/public/models/
   ```

2. Test load models di browser console:
   - Buka game
   - Check console untuk error "Failed to load model"
   - Jika ada error, cek nama file dan path

3. Adjust scales jika perlu di component files

## 💡 Tips

- **Prioritas**: Download karakter dan Level 1 items dulu
- **Ukuran**: Pilih model < 10MB untuk performa optimal
- **Textures**: Pilih model dengan embedded textures (GLB format)
- **Free only**: Pastikan model benar-benar gratis untuk pendidikan

---

**STATUS SAAT INI**: Game menggunakan fallback primitives (box, cylinder, sphere) karena model belum didownload. Segera setelah model GLB tersedia di folder yang benar, game akan otomatis menggunakan model realistik.
