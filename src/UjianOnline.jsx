import { useState, useEffect, useCallback, useRef } from "react";

const DURATION = 90 * 60;
const MAX_PELANGGARAN = 3;

const SOAL = [
  {
    bagian: "Penalaran Matematika",
    nomor: 1,
    soal: "Ikram membuat spageti panggang lumer dengan perbandingan massa spageti : adonan saus tomat : keju lumer = 4 : 4 : 2. Jika total massa spageti panggang lumer adalah 2.270 gram, berapakah total massa saus tomat dan keju lumer? (dalam gram)",
    pilihan: ["A. 1.336", "B. 2.337", "C. 1.337", "D. 2.227"],
    kunci: "A",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 2,
    soal: "Seorang tukang jahit mampu menjahit 60 potong kaos dalam 3 hari. Bila ia bekerja selama 2 minggu, berapa potong kaos yang dapat ia kerjakan?",
    pilihan: [
      "A. 210 potong",
      "B. 140 potong",
      "C. 280 potong",
      "D. 350 potong",
    ],
    kunci: "C",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 3,
    soal: "Populasi sapi di kota P adalah 1.600 ekor (naik 25/bulan) dan kota Q 500 ekor (naik 10/bulan). Saat populasi kota P tiga kali kota Q, berapa populasi sapi di kota P?",
    pilihan: ["A. 2.250", "B. 2.400", "C. 2.100", "D. 1.900"],
    kunci: "A",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 4,
    soal: "Berdasarkan grafik jumlah penumpang, pernyataan berikut yang paling tepat adalah ...",
    pilihan: [
      "A. Jumlah penumpang September 2021 lebih dari 2x lipat penumpang Agustus 2021.",
      "B. Selisih jumlah penumpang Desember 2020 dan September 2021 sebanyak 1,96 juta penumpang.",
      "C. Jumlah penumpang Oktober 2020 meningkat 700 ribu dibanding tahun sebelumnya.",
      "D. Penumpang paling sedikit 995.400 terjadi pada bulan Juni 2020.",
    ],
    kunci: "B",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 5,
    soal: "Ramalan cuaca: Moskow (-5°C s/d 18°C), Mexico (17°C s/d 34°C), Paris (-3°C s/d 17°C), Tokyo (-2°C s/d 25°C). Perubahan suhu terbesar terjadi di kota ...",
    pilihan: ["A. Paris", "B. Mexico", "C. Moskow", "D. Tokyo"],
    kunci: "C",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 6,
    soal: "Harga botol minum mewah Rp2.200.000. Tahun depan turun 5%, lalu diskon 10% saat New Year Sale. Berapa yang Bu Syifa bayar?",
    pilihan: [
      "A. Rp2.900.000",
      "B. Rp1.881.000",
      "C. Rp2.090.000",
      "D. Rp1.181.000",
    ],
    kunci: "B",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 7,
    soal: "Peternakan 1: 500 ekor (+10/bulan), Peternakan 2: 300 ekor (+15/bulan). Setelah berapa bulan jumlah ayam keduanya sama?",
    pilihan: ["A. 67", "B. 53", "C. 50", "D. 40"],
    kunci: "D",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 8,
    soal: "Berdasarkan grafik populasi penduduk, manakah pernyataan berikut yang SALAH?",
    pilihan: [
      "A. Penduduk usia di bawah 20 tahun berjumlah 3,9 juta orang.",
      "B. Penduduk usia 40-44 tahun lebih banyak dari usia 0-4 tahun.",
      "C. Selisih penduduk usia 45-49 tahun dan 0-4 tahun berjumlah 190.270 orang.",
      "D. Penduduk usia 55-59 tahun sekitar setengah dari penduduk usia 35-39 tahun.",
    ],
    kunci: "B",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 9,
    soal: "Perbandingan kayu jati Pak Ahmad:Pak Nadhim = 7:8 dan Pak Nadhim:Pak Chafidz = 9:10. Total 2,15 ton. Massa kayu jati masing-masing (kg) secara berurutan adalah ...",
    pilihan: [
      "A. 63, 72, 80",
      "B. 720, 630, 800",
      "C. 72, 63, 80",
      "D. 630, 720, 800",
    ],
    kunci: "D",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 10,
    soal: "Pak Nosyan ingin mendapat keuntungan 35% dari penjualan TV. Harga beli TV Rp1.400.000. Berapa harga jual yang tepat?",
    pilihan: [
      "A. Rp1.870.000",
      "B. Rp1.980.000",
      "C. Rp1.890.000",
      "D. Rp1.872.000",
    ],
    kunci: "C",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 11,
    soal: "Banyak bilangan kurang dari 1000 yang disusun dari angka 1, 2, 3, 4, 5, dan 6 adalah ...",
    pilihan: ["A. 120", "B. 156", "C. 216", "D. 258"],
    kunci: "D",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 12,
    soal: "Tika membawa uang n. Beli 4 bungkus mie kembalian Rp900. Beli 5 bungkus mie kurang Rp1.500. Berapa uang yang dibawa Tika?",
    pilihan: ["A. Rp10.500", "B. Rp16.000", "C. Rp14.000", "D. Rp12.000"],
    kunci: "D",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 13,
    soal: "Tabel nilai Matematika kelas 9C: Nilai 5(3 siswa), 6(7), 7(8), 8(4), 9(3), 10(1). Berapa jumlah siswa yang nilainya di bawah rata-rata?",
    pilihan: ["A. 18", "B. 10", "C. 3", "D. 22"],
    kunci: "B",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 14,
    soal: "Organisasi 22 anggota, dipilih 4 pengurus secara acak. Jika 1 sudah terpilih, peluang anggota lain TIDAK terpilih menjadi pengurus adalah ...",
    pilihan: ["A. 1/9", "B. 1/7", "C. 7/9", "D. 6/7"],
    kunci: "D",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 15,
    soal: "Perbandingan panjang dan lebar persegi panjang 7:4. Keliling 66 cm. Berapa luasnya?",
    pilihan: ["A. 218 cm²", "B. 198 cm²", "C. 132 cm²", "D. 252 cm²"],
    kunci: "B",
  },
  {
    bagian: "Penalaran Matematika",
    nomor: 16,
    soal: "Mobil antik Rp54.000.000 diskon 10%, lalu diskon lagi 15% via ATM Salcen. Berapa harga yang dibayar?",
    pilihan: [
      "A. Rp52.500.000",
      "B. Rp41.310.000",
      "C. Rp40.500.000",
      "D. Rp54.500.000",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 1,
    soal: "Adam membaca ayat sajdah, lalu menghadap kiblat, niat, takbir, sujud, dan salam. Hal yang dilakukan Adam adalah contoh dari sujud ...",
    pilihan: ["A. Tilawah", "B. Wajib", "C. Syukur", "D. Sahwi"],
    kunci: "A",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 2,
    soal: "Dalam hadis yang tercantum, terdapat amalan salat sunah ghairu muakkad, yaitu ...",
    pilihan: [
      "A. Salat Istisqa'",
      "B. Salat Idul Fitri",
      "C. Salat Idul Adha",
      "D. Salat Istikharah",
    ],
    kunci: "A",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 3,
    soal: "Dalil menyebutkan dua bangkai yang halal untuk dimakan, yaitu ...",
    pilihan: [
      "A. Ikan dan belalang",
      "B. Kambing dan sapi",
      "C. Unta dan sapi",
      "D. Ikan dan unta",
    ],
    kunci: "A",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 4,
    soal: "Yang termasuk syarat wajib zakat fitrah dari daftar ketentuan adalah ...",
    pilihan: [
      "A. a, d, dan g",
      "B. c, d, dan h",
      "C. a, b, dan g",
      "D. b, e, dan f",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 5,
    soal: "Berikut adalah syarat yang berhubungan dengan barang yang digadaikan dalam ar-Rahn, KECUALI ...",
    pilihan: [
      "A. Barang berharga yang dapat menutup hutangnya.",
      "B. Barang yang tidak boleh diperjualbelikan.",
      "C. Milik orang yang menggadaikan.",
      "D. Diketahui ukuran, jenis, dan sifatnya.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 6,
    soal: "Dari daftar: (1) Ibu, (2) Saudara perempuan sebapak, (3) Istri, (4) Cucu perempuan dari anak laki-laki, (5) Anak perempuan, (6) Cucu perempuan dari anak perempuan. Yang termasuk ahli waris perempuan adalah ...",
    pilihan: [
      "A. 1, 2, 3, 4, 5",
      "B. 1, 2, 3, 5, 6",
      "C. 1, 2, 4, 5, 6",
      "D. 1, 3, 4, 5, 6",
    ],
    kunci: "D",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 7,
    soal: "Allah membuka jalan bagi manusia untuk menggali karunia-Nya dan membuka pintu kemenangan. Sifat Allah yang sesuai adalah ...",
    pilihan: ["A. Ar-Rauf", "B. Al-Aziz", "C. Al-Fattah", "D. Al-Qayyum"],
    kunci: "C",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 8,
    soal: "Berikut yang BUKAN adab ketika membaca al-Qur'an adalah ...",
    pilihan: [
      "A. Membaguskan suara ketika membacanya.",
      "B. Membaca dalam keadaan suci.",
      "C. Memulai bacaan dengan isti'azah.",
      "D. Membacanya dengan cepat dan terburu-buru.",
    ],
    kunci: "D",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 9,
    soal: "Esensi sebenarnya dari moderasi beragama adalah ...",
    pilihan: [
      "A. Menggabungkan ajaran berbagai agama agar tercipta perdamaian universal.",
      "B. Mengurangi ketaatan pada ritual agama demi menyesuaikan diri dengan tren modern.",
      "C. Cara pandang, sikap, dan praktik dalam kehidupan beragama yang melindungi martabat kemanusiaan.",
      "D. Menjadikan rasio sebagai satu-satunya tolok ukur kebenaran dalam memahami teks suci.",
    ],
    kunci: "C",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 10,
    soal: "Siswa merasa peraturan menyanyikan lagu Indonesia Raya bertentangan dengan kemurnian ibadah. Sikap moderat yang seharusnya diambil adalah ...",
    pilihan: [
      "A. Melakukan protes terbuka dan mengajak memboikot upacara.",
      "B. Memahami bahwa mencintai tanah air adalah bagian dari nilai agama yang bersifat muamalah.",
      "C. Pura-pura mengikuti aturan tetapi dalam hati membenci otoritas sekolah.",
      "D. Keluar dari sekolah dan mencari sekolah tanpa aturan kebangsaan.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 11,
    soal: "Bahaya algoritma media sosial yang menciptakan echo chamber bagi moderasi beragama adalah ...",
    pilihan: [
      "A. Mempercepat penyebaran informasi keagamaan yang valid.",
      "B. Memperkuat konfirmasi bias sehingga menutup diri dari kebenaran lain.",
      "C. Memudahkan koordinasi kegiatan bakti sosial lintas agama.",
      "D. Mengurangi minat generasi muda mempelajari sejarah agama.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 12,
    soal: "Dalam diskusi penggunaan AI untuk menjawab persoalan fikih, sikap Tawasuth ditunjukkan oleh ...",
    pilihan: [
      "A. Kelompok yang menggunakan AI sebagai alat bantu, namun tetap verifikasi ke guru/ulama.",
      "B. Kelompok yang memilih tidak ikut campur karena takut salah.",
      "C. Kelompok yang menyarankan AI dilarang di lingkungan sekolah.",
      "D. Kelompok yang meminta pemerintah membuat AI agama yang bersifat wajib.",
    ],
    kunci: "A",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 13,
    soal: "Toleransi yang salah kaprah adalah jika seseorang ...",
    pilihan: [
      "A. Membiarkan tetangga berbeda agama merayakan hari besarnya dengan tenang.",
      "B. Mengikuti ritual ibadah agama lain karena merasa semua agama sama saja.",
      "C. Memberikan bantuan logistik kepada korban bencana tanpa melihat latar belakang agama.",
      "D. Menjaga keamanan tempat ibadah agama lain saat sedang digunakan.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 14,
    soal: "Sebagai ketua OSIS yang moderat (prinsip I'tidal), jika ada dua ekskul agama mengajukan dana bersamaan, tindakan paling tepat adalah ...",
    pilihan: [
      "A. Memberikan dana lebih besar kepada ekskul dengan anggota paling banyak.",
      "B. Memberikan dana hanya kepada ekskul yang seagama dengannya.",
      "C. Membagi dana secara proporsional dan adil sesuai kebutuhan objektif masing-masing.",
      "D. Menolak keduanya agar tidak terjadi kecemburuan sosial.",
    ],
    kunci: "C",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 15,
    soal: "Mengapa sikap anti-kekerasan verbal menjadi syarat mutlak moderasi beragama di media sosial?",
    pilihan: [
      "A. Karena dapat menurunkan peringkat akun media sosial.",
      "B. Karena kekerasan verbal adalah pintu masuk menuju kekerasan fisik dan perpecahan sosial.",
      "C. Karena aturan hukum di Indonesia sangat ketat.",
      "D. Karena tokoh agama tidak boleh dikritik sama sekali.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Keislaman",
    nomor: 16,
    soal: "Di sebuah daerah terdapat tradisi sedekah bumi sebagai bentuk syukur. Sikap seorang siswa moderat terhadap tradisi tersebut adalah ...",
    pilihan: [
      "A. Mengharamkan secara mutlak tanpa mempelajari filosofinya.",
      "B. Menerima tradisi sebagai kekayaan budaya dan menyisipkan nilai syukur tanpa merusak ajaran agama.",
      "C. Memaksa mengubah seluruh tata cara adat menjadi ritual agama murni.",
      "D. Menjauhi masyarakat yang masih mempraktikkan tradisi tersebut.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 1,
    soal: "[Teks: Aktivitas Fisik & PTM] Berikut yang TIDAK termasuk manfaat dari aktivitas fisik adalah ...",
    pilihan: [
      "A. Menurunkan risiko penyakit jantung kronis.",
      "B. Meningkatkan risiko terjangkit PTM.",
      "C. Mencegah penyakit tidak menular.",
      "D. Meningkatkan sistem kekebalan tubuh.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 2,
    soal: "[Teks: Kompetisi Robotik Madrasah] Pernyataan yang SALAH dari teks berita KRM adalah ...",
    pilihan: [
      "A. KRM digelar dengan dua kategori: Rancang Bangun dan Robot Mobile.",
      "B. KRM diikuti murid madrasah dari jenjang SD hingga SMA.",
      "C. Kemenag sudah memberikan media untuk anak-anak madrasah berkreasi dalam robotika.",
      "D. Teknologi robot penting dipelajari karena berguna di masa depan.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 3,
    soal: "[Teks: Kompetisi Robotik Madrasah] Makna istilah kontemporer pada teks KRM adalah ...",
    pilihan: ["A. Masa lalu", "B. Masa depan", "C. Masa kini", "D. Kuno"],
    kunci: "C",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 4,
    soal: "[Teks: Pertemuan Bilateral Indonesia-Kolombia] Istilah memorandum pada teks memiliki makna ...",
    pilihan: [
      "A. Catatan berisi penjelasan",
      "B. Ketentuan tambahan",
      "C. Penyerahan persoalan yang diputuskan dengan pemungutan suara",
      "D. Surat pernyataan dalam hubungan diplomasi",
    ],
    kunci: "D",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 5,
    soal: "[Teks: Pertemuan Bilateral Indonesia-Kolombia] Pernyataan yang BENAR dari teks adalah ...",
    pilihan: [
      "A. Kolombia adalah partner investasi keenam terbesar bagi Indonesia.",
      "B. Penandatanganan pada pertemuan ini pertama kalinya diselenggarakan secara virtual.",
      "C. Menlu Indonesia dan Menlu Kolombia bertemu secara tatap muka pada 5 Agustus 2020.",
      "D. Pertemuan bilateral diisi dengan penandatanganan satu perjanjian.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 6,
    soal: "[Teks: Kota Tua] Berikut pernyataan yang BENAR dari teks Kota Tua, KECUALI ...",
    pilihan: [
      "A. Pencanangan Kota Tua merupakan hasil kerja sama Kemendikbud dengan Pemprov DKI Jakarta.",
      "B. Penggunaan bahasa Indonesia diperkuat dengan undang-undang dan peraturan presiden.",
      "C. Kawasan penggunaan bahasa negara dibuat untuk melestarikan bahasa-bahasa di dunia.",
      "D. Aspek historis, strategis, rekreasi, dan edukasi termasuk alasan dipilihnya Kota Tua.",
    ],
    kunci: "C",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 7,
    soal: "[Teks: Kota Tua] Arti kata situs pada teks adalah ...",
    pilihan: [
      "A. Daerah temuan benda-benda purbakala",
      "B. Daerah perlindungan untuk melestarikan tumbuhan dan binatang",
      "C. Program komputer yang menjalankan peladen untuk menyediakan akses laman",
      "D. Tempat sakral bagi masyarakat lokal",
    ],
    kunci: "A",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 8,
    soal: "[Teks: Korupsi] Pernyataan berikut yang TIDAK termasuk alasan mengapa korupsi harus diberantas adalah ...",
    pilihan: [
      "A. Merugikan Indonesia secara ekonomi.",
      "B. Mencoreng nama baik Indonesia di dunia internasional.",
      "C. Menimbulkan ketidakpercayaan rakyat kepada pemerintah.",
      "D. Melestarikan dan mempertahankan jati diri bangsa.",
    ],
    kunci: "D",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 9,
    soal: "[Text: Letter from Marshel] What is the purpose of the letter above?",
    pilihan: [
      "A. To remind Juley not to flash himself.",
      "B. To wish Juley a lovely day.",
      "C. To inform Juley of Marshel's recent work.",
      "D. To urge Juley and Yatson to meet Marshel.",
    ],
    kunci: "D",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 10,
    soal: "[Text: Letter from Marshel] The statements below are TRUE, EXCEPT ...",
    pilihan: [
      "A. The thief was from Germany.",
      "B. Marshel is seeking for the culprit.",
      "C. Marshel and Juley are to meet next to an abandoned cinema.",
      "D. Attached to the letter are plane tickets and passports.",
    ],
    kunci: "A",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 11,
    soal: "[Text: The Pot - Birbal] Below are the steps Birbal took to accomplish the task, EXCEPT ...",
    pilihan: [
      "A. Birbal selected a watermelon to be placed in the pot.",
      "B. Birbal cut open the watermelon.",
      "C. Birbal provided water and fertilizer.",
      "D. Birbal sent the pot away.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 12,
    soal: "[Text: The Pot - Birbal] The conclusion from The Pot story is ...",
    pilihan: [
      "A. Emperor Akmal and Birbal made peace.",
      "B. Birbal stayed at the Emperor's side for the rest of his life.",
      "C. Birbal lived happily ever after with the Emperor.",
      "D. Birbal regrets his decision of going away.",
    ],
    kunci: "A",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 13,
    soal: "[Text: The Pot - Birbal] Which of the following is FALSE, according to the passage?",
    pilihan: [
      "A. Emperor Akmal knows Birbal very well.",
      "B. Birbal is easily trusted.",
      "C. Birbal is a trickster, posing as a watermelon as wit.",
      "D. Birbal went back to the Emperor's side.",
    ],
    kunci: "C",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 14,
    soal: "Everyone trusted Birbal... The word trusted CANNOT be replaced with ...",
    pilihan: ["A. Counted on", "B. Doubted", "C. Confided in", "D. Believed"],
    kunci: "B",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 15,
    soal: "[Text: Library Announcement] From the announcement, we can conclude that ...",
    pilihan: [
      "A. Wishing them a safe trip and happy new year.",
      "B. A warning for students who have not returned their book yet.",
      "C. Notifying students about the fines by the librarian.",
      "D. The announcement is made to remind students for returning schoolbooks.",
    ],
    kunci: "B",
  },
  {
    bagian: "Literasi Membaca",
    nomor: 16,
    soal: "[Text: Library Announcement] What will happen to students who fail to return the books before the deadline?",
    pilihan: [
      "A. The students are to replace the books.",
      "B. The students will receive a written reminder.",
      "C. The students will be given a fine.",
      "D. Nothing will happen.",
    ],
    kunci: "C",
  },
];

const BAGIAN_LIST = [
  "Penalaran Matematika",
  "Literasi Keislaman",
  "Literasi Membaca",
];
const WARNA_BAGIAN = {
  "Penalaran Matematika": {
    bg: "#e8f4fd",
    accent: "#2980b9",
    light: "#d0e8f8",
  },
  "Literasi Keislaman": { bg: "#eafaf1", accent: "#27ae60", light: "#c8f0d8" },
  "Literasi Membaca": { bg: "#fef9e7", accent: "#d4a017", light: "#fdedc8" },
};

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxJuRRkoHAMZNRlCzCJJEKSC13hBYG4o4xXRlkfZhLcdglKbubs7XrdEA4qmGhkKopBaA/exec";

function formatWaktu(secs) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function UjianOnline() {
  const [tahap, setTahap] = useState("identitas");
  const [identitas, setIdentitas] = useState({
    nama: "",
    kelas: "",
    nis: "",
    sekolah: "",
  });
  const [jawaban, setJawaban] = useState({});
  const [waktu, setWaktu] = useState(DURATION);
  const [bagianAktif, setBagianAktif] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasil, setHasil] = useState(null);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [pelanggaran, setPelanggaran] = useState(0);
  const [showPeringatan, setShowPeringatan] = useState(false);
  const [pesanPeringatan, setPesanPeringatan] = useState("");
  const [didiskualifikasi, setDidiskualifikasi] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timerRef = useRef(null);
  const submitDoneRef = useRef(false);
  const pelanggaranRef = useRef(0);
  const jawabanRef = useRef({});
  const waktuRef = useRef(DURATION);
  const identitasRef = useRef({ nama: "", kelas: "", nis: "", sekolah: "" });

  // Sinkronisasi ref supaya event listener selalu baca nilai terkini
  useEffect(() => {
    jawabanRef.current = jawaban;
  }, [jawaban]);
  useEffect(() => {
    waktuRef.current = waktu;
  }, [waktu]);
  useEffect(() => {
    identitasRef.current = identitas;
  }, [identitas]);

  const STORAGE_KEY = `ujian_submitted_${identitas.nis}`;

  // ── Hitung skor ──
  const hitungSkorDariRef = useCallback(() => {
    let benar = 0;
    SOAL.forEach((s, i) => {
      if (jawabanRef.current[i] === s.kunci) benar++;
    });
    return {
      benar,
      total: SOAL.length,
      persen: Math.round((benar / SOAL.length) * 100),
    };
  }, []);

  // ── Kirim ke Google Sheet ──
  const kirimKeSheet = useCallback(
    async (alasan = "Normal") => {
      if (submitDoneRef.current) return;
      submitDoneRef.current = true;
      clearInterval(timerRef.current);
      setLoading(true);
      const skor = hitungSkorDariRef();
      const id = identitasRef.current;
      const payload = {
        nama: id.nama,
        kelas: id.kelas,
        nis: id.nis,
        sekolah: id.sekolah,
        waktuSelesai: new Date().toLocaleString("id-ID"),
        sisaWaktu: formatWaktu(waktuRef.current),
        skorBenar: skor.benar,
        skorTotal: skor.total,
        persenSkor: skor.persen,
        jawaban: SOAL.map((s, i) => jawabanRef.current[i] || "-").join("|"),
        keterangan: alasan,
      };
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (_) {}
      localStorage.setItem(
        `ujian_submitted_${id.nis}`,
        JSON.stringify({
          nama: id.nama,
          waktu: new Date().toLocaleString("id-ID"),
        })
      );
      setHasil(skor);
      setLoading(false);
      setTahap("selesai");
    },
    [hitungSkorDariRef]
  );

  // ── Timer countdown ──
  useEffect(() => {
    if (tahap !== "pengerjaan") return;
    timerRef.current = setInterval(() => {
      setWaktu((w) => {
        if (w <= 1) {
          clearInterval(timerRef.current);
          kirimKeSheet("Waktu habis");
          return 0;
        }
        return w - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [tahap, kirimKeSheet]);

  // ── Anti-cheat: deteksi pindah tab / minimize ──
  useEffect(() => {
    if (tahap !== "pengerjaan") return;

    const tangkapPindahTab = () => {
      if (!document.hidden) return;
      pelanggaranRef.current += 1;
      const jumlah = pelanggaranRef.current;
      setPelanggaran(jumlah);

      if (jumlah >= MAX_PELANGGARAN) {
        setDidiskualifikasi(true);
        setShowPeringatan(false);
        kirimKeSheet(`Diskualifikasi - pindah tab ${jumlah}x`);
      } else {
        setPesanPeringatan(
          `Kamu terdeteksi meninggalkan halaman ujian!\n\nIni adalah pelanggaran ke-${jumlah} dari ${MAX_PELANGGARAN}.\nJika mencapai ${MAX_PELANGGARAN}x, jawaban otomatis dikumpulkan dan kamu DISKUALIFIKASI.`
        );
        setShowPeringatan(true);
      }
    };

    // Blokir klik kanan
    const blokKanan = (e) => e.preventDefault();

    // Blokir shortcut DevTools & curang
    const blokKeyboard = (e) => {
      const k = e.key.toLowerCase();
      if (
        e.key === "F12" ||
        (e.ctrlKey && k === "u") ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c", "k"].includes(k)) ||
        (e.ctrlKey && k === "s") ||
        (e.ctrlKey && k === "p") ||
        (e.altKey && k === "tab")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Blokir copy paste
    const blokCopy = (e) => e.preventDefault();

    document.addEventListener("visibilitychange", tangkapPindahTab);
    document.addEventListener("contextmenu", blokKanan);
    document.addEventListener("keydown", blokKeyboard);
    document.addEventListener("copy", blokCopy);
    document.addEventListener("cut", blokCopy);

    return () => {
      document.removeEventListener("visibilitychange", tangkapPindahTab);
      document.removeEventListener("contextmenu", blokKanan);
      document.removeEventListener("keydown", blokKeyboard);
      document.removeEventListener("copy", blokCopy);
      document.removeEventListener("cut", blokCopy);
    };
  }, [tahap, kirimKeSheet]);

  // ── Sinkron status fullscreen ──
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const masukFullscreen = () => {
    document.documentElement.requestFullscreen().catch(() => {});
  };

  // ── Mulai ujian ──
  const mulaiUjian = () => {
    if (
      !identitas.nama.trim() ||
      !identitas.kelas.trim() ||
      !identitas.nis.trim() ||
      !identitas.sekolah.trim()
    ) {
      setError("Semua field wajib diisi!");
      return;
    }
    const sudah = localStorage.getItem(`ujian_submitted_${identitas.nis}`);
    if (sudah) {
      setTahap("sudahSubmit");
      return;
    }
    setError("");
    document.documentElement.requestFullscreen().catch(() => {});
    setTahap("pengerjaan");
  };

  const soalBagian = SOAL.filter((s) => s.bagian === BAGIAN_LIST[bagianAktif]);
  const indeksGlobal = (i) => SOAL.findIndex((s) => s === soalBagian[i]);
  const totalDijawab = Object.keys(jawaban).length;
  const persen = waktu / DURATION;
  const warnaTimer =
    waktu < 300 ? "#e74c3c" : waktu < 900 ? "#f39c12" : "#27ae60";

  // ══════════════════════
  // RENDER: Sudah submit
  // ══════════════════════
  if (tahap === "sudahSubmit")
    return (
      <div style={S.fullCenter}>
        <div style={S.card}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔒</div>
          <h2 style={{ ...S.h2, color: "#e74c3c" }}>Sudah Pernah Submit</h2>
          <p style={S.muted}>
            NIS ini sudah pernah mengerjakan ujian. Setiap peserta hanya boleh
            submit satu kali.
          </p>
          <p style={{ ...S.muted, fontWeight: 600 }}>
            Hubungi pengawas jika ada masalah.
          </p>
        </div>
      </div>
    );

  // ══════════════════════
  // RENDER: Selesai
  // ══════════════════════
  if (tahap === "selesai") {
    const predikat =
      hasil.persen >= 80
        ? { label: "Sangat Baik", color: "#27ae60" }
        : hasil.persen >= 65
        ? { label: "Baik", color: "#2980b9" }
        : hasil.persen >= 50
        ? { label: "Cukup", color: "#f39c12" }
        : { label: "Perlu Bimbingan", color: "#e74c3c" };
    const rincian = BAGIAN_LIST.map((b) => {
      const soalB = SOAL.filter((s) => s.bagian === b);
      const benar = soalB.filter(
        (s, li) => jawaban[SOAL.findIndex((x) => x === soalB[li])] === s.kunci
      ).length;
      return { bagian: b, benar, total: soalB.length };
    });
    return (
      <div style={S.fullCenter}>
        <div style={{ ...S.card, maxWidth: 520 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>
            {didiskualifikasi ? "🚫" : "🎉"}
          </div>
          <h2
            style={{ ...S.h2, color: didiskualifikasi ? "#e74c3c" : "#1a1a2e" }}
          >
            {didiskualifikasi ? "Ujian Dihentikan" : "Ujian Selesai!"}
          </h2>
          {didiskualifikasi && (
            <p
              style={{
                color: "#e74c3c",
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              Terdeteksi meninggalkan halaman ujian {pelanggaran}x.
            </p>
          )}
          <p style={S.muted}>Jawaban kamu telah berhasil dikirim.</p>
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: 16,
              padding: "24px 32px",
              margin: "24px 0",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                color: predikat.color,
                lineHeight: 1,
              }}
            >
              {hasil.persen}
              <span style={{ fontSize: 28 }}>%</span>
            </div>
            <div style={{ fontSize: 18, color: "#555", marginTop: 4 }}>
              {hasil.benar} / {hasil.total} soal benar
            </div>
            <div
              style={{
                display: "inline-block",
                background: predikat.color,
                color: "#fff",
                borderRadius: 20,
                padding: "4px 20px",
                marginTop: 12,
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              {predikat.label}
            </div>
          </div>
          <div style={{ width: "100%" }}>
            {rincian.map((r) => (
              <div
                key={r.bagian}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ fontSize: 14, color: "#444" }}>{r.bagian}</span>
                <span
                  style={{
                    fontWeight: 700,
                    color: WARNA_BAGIAN[r.bagian].accent,
                  }}
                >
                  {r.benar}/{r.total}
                </span>
              </div>
            ))}
          </div>
          <p style={{ ...S.muted, marginTop: 20, fontSize: 13 }}>
            Terima kasih, <strong>{identitas.nama}</strong>!
          </p>
        </div>
      </div>
    );
  }

  // ══════════════════════
  // RENDER: Identitas
  // ══════════════════════
  if (tahap === "identitas")
    return (
      <div style={S.fullCenter}>
        <div style={{ ...S.card, maxWidth: 460 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 48 }}>📝</div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#1a1a2e",
                margin: "8px 0 4px",
              }}
            >
              Ujian Online
            </h1>
            <p style={S.muted}>48 soal • 3 bagian • 90 menit</p>
          </div>
          {["nama", "kelas", "nis", "sekolah"].map((field) => (
            <div key={field} style={{ marginBottom: 16 }}>
              <label style={S.label}>
                {field === "nis"
                  ? "NIS"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                style={S.input}
                placeholder={`Masukkan ${field === "nis" ? "NIS" : field}...`}
                value={identitas[field]}
                onChange={(e) =>
                  setIdentitas((p) => ({ ...p, [field]: e.target.value }))
                }
              />
            </div>
          ))}
          {error && <div style={S.errorBox}>{error}</div>}
          <div
            style={{
              background: "#fff8e1",
              border: "1px solid #ffe082",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 10,
              fontSize: 13,
              color: "#795548",
            }}
          >
            ⚠️ Setiap NIS hanya dapat submit <strong>satu kali</strong>.
          </div>
          <div
            style={{
              background: "#fdecea",
              border: "1px solid #ffcdd2",
              borderRadius: 10,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 13,
              color: "#b71c1c",
              lineHeight: 1.6,
            }}
          >
            🔒 Ujian berjalan dalam <strong>mode layar penuh</strong>.<br />
            Dilarang: pindah tab, minimize, klik kanan, copy-paste, buka
            DevTools.
            <br />
            Pelanggaran <strong>{MAX_PELANGGARAN}x</strong> → jawaban otomatis
            dikumpulkan & <strong>DISKUALIFIKASI</strong>.
          </div>
          <button style={S.btnPrimary} onClick={mulaiUjian}>
            Mulai Ujian (Layar Penuh) →
          </button>
        </div>
      </div>
    );

  // ══════════════════════════════════════
  // RENDER: Pengerjaan Soal
  // ══════════════════════════════════════
  return (
    <div
      style={{
        fontFamily: "'Segoe UI', sans-serif",
        minHeight: "100vh",
        background: "#f0f2f5",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Overlay Peringatan */}
      {showPeringatan && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.80)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 36,
              maxWidth: 420,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontSize: 60 }}>🚨</div>
            <h3
              style={{
                color: "#e74c3c",
                fontSize: 20,
                fontWeight: 800,
                margin: "14px 0 10px",
              }}
            >
              Peringatan!
            </h3>
            <p
              style={{
                whiteSpace: "pre-line",
                fontSize: 14,
                color: "#444",
                lineHeight: 1.8,
                marginBottom: 16,
              }}
            >
              {pesanPeringatan}
            </p>
            <div
              style={{
                background: "#fdecea",
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13,
                color: "#c62828",
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              Sisa toleransi: {MAX_PELANGGARAN - pelanggaran}x lagi
            </div>
            <button
              onClick={() => {
                setShowPeringatan(false);
                masukFullscreen();
              }}
              style={{ ...S.btnPrimary, background: "#e74c3c" }}
            >
              Saya Mengerti — Lanjutkan Ujian
            </button>
          </div>
        </div>
      )}

      {/* Overlay Diskualifikasi */}
      {didiskualifikasi && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.90)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 36,
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 60 }}>🚫</div>
            <h3
              style={{
                color: "#e74c3c",
                fontSize: 22,
                fontWeight: 800,
                margin: "14px 0 10px",
              }}
            >
              DISKUALIFIKASI
            </h3>
            <p style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>
              Terdeteksi meninggalkan halaman sebanyak{" "}
              <strong>{pelanggaran}x</strong>.<br />
              Jawaban sedang dikirim secara otomatis...
            </p>
          </div>
        </div>
      )}

      {/* Banner peringatan keluar fullscreen */}
      {!isFullscreen && !showPeringatan && !didiskualifikasi && (
        <div
          style={{
            background: "#e74c3c",
            color: "#fff",
            textAlign: "center",
            padding: "10px 16px",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          ⚠️ Kamu keluar dari mode layar penuh!{" "}
          <span
            onClick={masukFullscreen}
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            Klik di sini untuk kembali
          </span>
        </div>
      )}

      {/* Header Sticky */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#1a1a2e",
          color: "#fff",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Ujian Online</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>
            {identitas.nama} • {identitas.kelas}
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: warnaTimer,
              letterSpacing: 2,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {formatWaktu(waktu)}
          </div>
          <div
            style={{
              height: 4,
              width: 110,
              background: "#333",
              borderRadius: 4,
              marginTop: 4,
              margin: "4px auto 0",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${persen * 100}%`,
                background: warnaTimer,
                borderRadius: 4,
                transition: "width 1s linear, background 0.5s",
              }}
            />
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontSize: 11,
              color: pelanggaran > 0 ? "#e74c3c" : "#aaa",
            }}
          >
            🚨 {pelanggaran}/{MAX_PELANGGARAN} pelanggaran
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>
            {totalDijawab}
            <span style={{ opacity: 0.6, fontSize: 11 }}>
              /{SOAL.length} dijawab
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px" }}>
        {/* Tab Bagian */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {BAGIAN_LIST.map((b, i) => {
            const soalB = SOAL.filter((s) => s.bagian === b);
            const dijawabB = soalB.filter(
              (s, li) =>
                jawaban[SOAL.findIndex((x) => x === soalB[li])] !== undefined
            ).length;
            const aktif = i === bagianAktif;
            return (
              <button
                key={b}
                onClick={() => setBagianAktif(i)}
                style={{
                  flex: 1,
                  padding: "10px 6px",
                  borderRadius: 10,
                  border: aktif
                    ? `2px solid ${WARNA_BAGIAN[b].accent}`
                    : "2px solid #ddd",
                  background: aktif ? WARNA_BAGIAN[b].bg : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: aktif ? WARNA_BAGIAN[b].accent : "#999",
                  }}
                >
                  {b}
                </div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                  {dijawabB}/{soalB.length}
                </div>
              </button>
            );
          })}
        </div>

        {/* Daftar Soal */}
        {soalBagian.map((s, li) => {
          const gi = indeksGlobal(li);
          const dipilih = jawaban[gi];
          const warna = WARNA_BAGIAN[s.bagian];
          return (
            <div
              key={gi}
              style={{
                background: "#fff",
                borderRadius: 14,
                marginBottom: 16,
                overflow: "hidden",
                boxShadow: dipilih
                  ? `0 0 0 2px ${warna.accent}`
                  : "0 1px 4px rgba(0,0,0,0.08)",
                transition: "box-shadow 0.2s",
              }}
            >
              <div
                style={{
                  background: warna.bg,
                  padding: "12px 18px",
                  borderBottom: `1px solid ${warna.light}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    background: warna.accent,
                    color: "#fff",
                    borderRadius: 8,
                    padding: "2px 10px",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  No. {s.nomor}
                </span>
                <span
                  style={{ fontSize: 12, color: warna.accent, fontWeight: 600 }}
                >
                  {s.bagian}
                </span>
                {dipilih && (
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 12,
                      color: warna.accent,
                    }}
                  >
                    ✓ Dijawab
                  </span>
                )}
              </div>
              <div style={{ padding: "16px 18px" }}>
                <p
                  style={{
                    fontSize: 15,
                    color: "#222",
                    lineHeight: 1.7,
                    marginBottom: 14,
                  }}
                >
                  {s.soal}
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {s.pilihan.map((p) => {
                    const hrf = p.charAt(0);
                    const terpilih = dipilih === hrf;
                    return (
                      <button
                        key={p}
                        onClick={() =>
                          setJawaban((prev) => ({ ...prev, [gi]: hrf }))
                        }
                        style={{
                          textAlign: "left",
                          padding: "10px 14px",
                          borderRadius: 10,
                          border: terpilih
                            ? `2px solid ${warna.accent}`
                            : "1.5px solid #e0e0e0",
                          background: terpilih ? warna.bg : "#fafafa",
                          cursor: "pointer",
                          fontSize: 14,
                          color: terpilih ? warna.accent : "#333",
                          fontWeight: terpilih ? 600 : 400,
                          transition: "all 0.15s",
                        }}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Navigasi & Submit */}
        <div
          style={{ display: "flex", gap: 10, marginTop: 8, marginBottom: 32 }}
        >
          {bagianAktif > 0 && (
            <button
              onClick={() => setBagianAktif((p) => p - 1)}
              style={S.btnSec}
            >
              ← Sebelumnya
            </button>
          )}
          {bagianAktif < 2 && (
            <button
              onClick={() => setBagianAktif((p) => p + 1)}
              style={{ ...S.btnSec, marginLeft: "auto" }}
            >
              Berikutnya →
            </button>
          )}
          {bagianAktif === 2 && (
            <button
              onClick={() => setKonfirmasi(true)}
              style={{
                ...S.btnPrimary,
                marginLeft: "auto",
                width: "auto",
                padding: "12px 28px",
              }}
            >
              Kumpulkan Jawaban ✓
            </button>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Submit */}
      {konfirmasi && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 20,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 18,
              padding: 32,
              maxWidth: 400,
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: 48 }}>⚠️</div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                margin: "12px 0 8px",
                color: "#1a1a2e",
              }}
            >
              Konfirmasi Submit
            </h3>
            <p style={S.muted}>
              Kamu sudah menjawab{" "}
              <strong>
                {totalDijawab} dari {SOAL.length}
              </strong>{" "}
              soal.
            </p>
            {totalDijawab < SOAL.length && (
              <p style={{ color: "#e74c3c", fontSize: 14, fontWeight: 600 }}>
                {SOAL.length - totalDijawab} soal belum dijawab!
              </p>
            )}
            <p style={{ ...S.muted, fontSize: 13 }}>
              Setelah dikumpulkan, <strong>tidak bisa diubah lagi</strong>.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setKonfirmasi(false)}
                style={{ ...S.btnSec, flex: 1 }}
              >
                Kembali
              </button>
              <button
                onClick={() => {
                  setKonfirmasi(false);
                  kirimKeSheet("Submit manual");
                }}
                disabled={loading}
                style={{ ...S.btnPrimary, flex: 1, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Mengirim..." : "Ya, Kumpulkan!"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const S = {
  fullCenter: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f5",
    padding: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: "36px 32px",
    width: "100%",
    maxWidth: 420,
    boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
    textAlign: "center",
  },
  h2: { fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "8px 0 8px" },
  muted: { fontSize: 14, color: "#666", margin: "4px 0" },
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#444",
    marginBottom: 6,
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1.5px solid #ddd",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
    background: "#fafafa",
  },
  btnPrimary: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "none",
    background: "#1a1a2e",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  btnSec: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "1.5px solid #ddd",
    background: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    color: "#444",
  },
  errorBox: {
    background: "#fdecea",
    color: "#c62828",
    borderRadius: 8,
    padding: "10px 14px",
    marginBottom: 14,
    fontSize: 13,
    textAlign: "left",
  },
};
