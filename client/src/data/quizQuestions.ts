export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Apa fungsi utama dari saklar listrik?",
    options: ["Memutus dan menyambung arus listrik", "Menambah daya listrik", "Menyimpan energi listrik"],
    correctIndex: 0,
    explanation: "Saklar berfungsi untuk memutus dan menyambung aliran arus listrik dalam rangkaian."
  },
  {
    question: "Rumus untuk menghitung energi listrik (kWh) yang benar adalah:",
    options: ["Energi = Tegangan × Arus", "Energi = (Daya × Waktu) / 1000", "Energi = Daya / Waktu"],
    correctIndex: 1,
    explanation: "Energi dalam kWh dihitung dengan rumus: (Daya dalam Watt × Waktu dalam jam) / 1000"
  },
  {
    question: "Alat rumah tangga mana yang paling boros energi jika dibiarkan menyala 24 jam?",
    options: ["Lampu LED 10W", "AC 1000W", "Kulkas 150W"],
    correctIndex: 1,
    explanation: "AC dengan daya 1000W akan mengonsumsi energi paling besar dibanding lampu LED atau kulkas."
  },
  {
    question: "Rangkaian listrik tertutup berarti:",
    options: ["Ada aliran arus dari positif ke negatif", "Tidak ada aliran arus", "Hanya ada di baterai"],
    correctIndex: 0,
    explanation: "Rangkaian tertutup memungkinkan arus mengalir dari kutub positif ke negatif melalui komponen."
  },
  {
    question: "Cara paling efisien menggunakan kulkas adalah:",
    options: ["Buka pintu selama mungkin", "Tutup pintu dengan cepat setelah digunakan", "Matikan saat tidak digunakan"],
    correctIndex: 1,
    explanation: "Menutup pintu kulkas dengan cepat mencegah udara dingin keluar dan mengurangi konsumsi energi."
  },
  {
    question: "Lampu LED lebih hemat energi dibanding lampu pijar karena:",
    options: ["Menghasilkan cahaya lebih terang", "Mengubah energi listrik menjadi cahaya lebih efisien", "Harganya lebih murah"],
    correctIndex: 1,
    explanation: "LED mengubah lebih banyak energi listrik menjadi cahaya dan lebih sedikit menjadi panas."
  },
  {
    question: "Satuan untuk mengukur daya listrik adalah:",
    options: ["Volt", "Watt", "Ampere"],
    correctIndex: 1,
    explanation: "Watt adalah satuan untuk mengukur daya listrik, sedangkan Volt untuk tegangan dan Ampere untuk arus."
  },
  {
    question: "Memanfaatkan cahaya matahari di siang hari dapat mengurangi penggunaan:",
    options: ["AC", "Kulkas", "Lampu"],
    correctIndex: 2,
    explanation: "Cahaya alami dari matahari dapat menggantikan lampu di siang hari untuk menghemat energi."
  },
  {
    question: "Mode hemat energi pada rice cooker berfungsi untuk:",
    options: ["Memasak lebih cepat", "Mengurangi konsumsi daya saat memanaskan", "Menambah porsi nasi"],
    correctIndex: 1,
    explanation: "Mode hemat energi mengurangi daya yang digunakan untuk menjaga nasi tetap hangat."
  },
  {
    question: "Jika tagihan listrik rumah melebihi target, hal yang harus dilakukan adalah:",
    options: ["Biarkan saja", "Matikan perangkat yang tidak digunakan", "Tambah daya listrik"],
    correctIndex: 1,
    explanation: "Mematikan perangkat yang tidak perlu adalah cara efektif mengurangi konsumsi dan tagihan listrik."
  },
  {
    question: "Komponen yang menyimpan energi listrik dalam rangkaian adalah:",
    options: ["Baterai", "Saklar", "Lampu"],
    correctIndex: 0,
    explanation: "Baterai menyimpan energi kimia dan mengubahnya menjadi energi listrik."
  },
  {
    question: "Penggunaan setrika yang efisien adalah:",
    options: ["Nyalakan sepanjang hari", "Gunakan hanya saat diperlukan", "Gunakan dengan daya maksimal terus-menerus"],
    correctIndex: 1,
    explanation: "Setrika harus digunakan hanya saat diperlukan untuk menghemat energi."
  },
  {
    question: "Alat pengukur konsumsi energi listrik di rumah adalah:",
    options: ["Termometer", "kWh meter", "Voltmeter"],
    correctIndex: 1,
    explanation: "kWh meter mengukur total energi listrik yang dikonsumsi dalam kilowatt-hour."
  },
  {
    question: "Tarif listrik biasanya dihitung per:",
    options: ["kWh (kilowatt-hour)", "Watt", "Volt"],
    correctIndex: 0,
    explanation: "Tagihan listrik dihitung berdasarkan konsumsi energi dalam satuan kWh."
  },
  {
    question: "Mengapa penting menghemat energi listrik?",
    options: ["Hanya untuk menghemat uang", "Untuk menjaga lingkungan dan mengurangi emisi", "Tidak penting"],
    correctIndex: 1,
    explanation: "Menghemat listrik membantu mengurangi emisi karbon dan menjaga keberlanjutan lingkungan."
  },
  {
    question: "Rangkaian seri berbeda dengan paralel karena:",
    options: ["Arus mengalir melalui satu jalur", "Tegangan sama di semua komponen", "Lebih hemat energi"],
    correctIndex: 0,
    explanation: "Dalam rangkaian seri, arus mengalir melalui satu jalur melewati semua komponen."
  },
  {
    question: "Jika satu lampu mati dalam rangkaian seri, yang terjadi adalah:",
    options: ["Semua lampu mati", "Lampu lain tetap menyala", "Lampu menjadi lebih terang"],
    correctIndex: 0,
    explanation: "Dalam rangkaian seri, jika satu komponen mati, seluruh rangkaian terputus."
  },
  {
    question: "Perangkat elektronik dalam mode standby tetap mengonsumsi energi:",
    options: ["Benar", "Salah", "Hanya pada TV"],
    correctIndex: 0,
    explanation: "Mode standby tetap menggunakan daya listrik meskipun kecil, yang disebut vampire power."
  },
  {
    question: "Cara terbaik menggunakan kipas angin untuk efisiensi energi:",
    options: ["Nyalakan di semua ruangan", "Gunakan hanya di ruangan yang ditempati", "Nyalakan 24 jam"],
    correctIndex: 1,
    explanation: "Kipas hanya efektif jika ada orang di ruangan tersebut, jadi gunakan hanya saat diperlukan."
  },
  {
    question: "Target tagihan listrik yang efisien untuk laboratorium dalam game ini adalah:",
    options: ["≤ Rp 300.000", "≥ Rp 500.000", "Tidak ada target"],
    correctIndex: 0,
    explanation: "Dalam Level 3, target efisiensi adalah menjaga tagihan tetap di bawah atau sama dengan Rp 300.000."
  }
];
