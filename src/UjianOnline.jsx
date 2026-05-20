import { useState, useEffect, useCallback, useRef } from "react";

const DURATION_SESI = 60 * 60; // 60 menit per sesi
const MAX_PELANGGARAN = 3;

// ══════════════════════════════════════
// SOAL SESI 1: TES POTENSI BELAJAR (TPB)
// ══════════════════════════════════════
const SOAL_TPB = [
  // BAGIAN I: KEMAMPUAN VERBAL
  { bagian: "Kemampuan Verbal", nomor: 1, soal: "Penulisan partikel dalam kalimat berikut ini yang benar adalah ..", pilihan: ["A. Apa kah aku boleh memakan buahmu?", "B. Murid memasuki ruangan satu persatu", "C. Apa pun yang dia inginkan selalu terpenuhi.", "D. Ada pun penyebab kemacetan itu belum diketahui."], kunci: "C" },
  { bagian: "Kemampuan Verbal", nomor: 2, soal: "Kata ganti 'itu' pada tulisan bercetak tebal dalam berita John Wick 4 mengacu pada ...", pilihan: ["A. John Wick 4", "B. Clancy Brown", "C. Donnie Yen", "D. Aktor asal Hong Kong"], kunci: "B" },
  { bagian: "Kemampuan Verbal", nomor: 3, soal: "Penulisan partikel /per/ berikut ini yang tepat adalah ...", pilihan: ["A. Persekian menit", "B. Perahu nelayan", "C. Per akaran tumbuhan", "D. Per satu detik"], kunci: "D" },
  { bagian: "Kemampuan Verbal", nomor: 4, soal: "WAHANA — Sinonim?", pilihan: ["A. Sarana", "B. Ide", "C. Dunia", "D. Planet"], kunci: "A" },
  { bagian: "Kemampuan Verbal", nomor: 5, soal: "DOGMA — Sinonim?", pilihan: ["A. Agama", "B. Ideologi", "C. Ajaran", "D. Keyakinan", "E. Kendaraan"], kunci: "C" },
  { bagian: "Kemampuan Verbal", nomor: 6, soal: "Penulisan kata ganti -nya pada kata bercetak tebal 'musnahnya' dalam teks perubahan iklim mengacu pada ...", pilihan: ["A. pantai berpasir", "B. Nature Climate Change", "C. perubahan iklim", "D. garis tepi pantai", "E. bahan bakar fosil"], kunci: "A" },
  { bagian: "Kemampuan Verbal", nomor: 7, soal: "Berikut ini pernyataan yang benar mengenai gabungan kata adalah ...", pilihan: ["A. Gabungan kata yang merupakan istilah lazim atau kata majemuk ditulis serangkai.", "B. Gabungan kata yang menimbulkan salah pengertian ditulis menggunakan tanda hubung (-). Contoh: anak-istri pejabat", "C. Gabungan kata ditulis serangkai dengan catatan mendapatkan awalan.", "D. Gabungan kata yang sudah padu tidak perlu ditulis serangkai.", "E. Gabungan kata ditulis terpisah apabila terdiri dari bentuk terikat dan kata dasar."], kunci: "B" },
  { bagian: "Kemampuan Verbal", nomor: 8, soal: "Manakah pembentukan kata yang tepat dalam kalimat berikut?", pilihan: ["A. Tidak ada yang lebih memesona selain keberhasilan siswa", "B. Penerapan kurikulum baru mempengaruhi kinerja guru", "C. Kita jangan hanya memerhatikan bagaimana guru bekerja", "D. Penggunaan smartphone dapat memer-mudah manusia dalam berkomunikasi.", "E. Apakah semua kurikulum mampu merubah dunia pendidikan?"], kunci: "A" },
  { bagian: "Kemampuan Verbal", nomor: 9, soal: "Kata ulang bermakna 'paling' terdapat pada kalimat ...", pilihan: ["A. Pemain-pemain sepakbola itu berkumpul di rumahnya.", "B. Mereka berusaha belajar sebaik-baiknya", "C. Ia hanya membaca buku-buku LKS", "D. Dia mendengarkan musik sambil tidur-tiduran", "E. Adi menggebu-gebu ingin masuk perwira."], kunci: "B" },
  { bagian: "Kemampuan Verbal", nomor: 10, soal: "Penulisan kata depan yang sesuai berdasarkan paragraf tentang pengendara wanita adalah ...", pilihan: ["A. (3) dan (5)", "B. Semuanya benar", "C. (2) dan (4)", "D. Semuanya salah", "E. (1) dan (3)"], kunci: "B" },
  { bagian: "Kemampuan Verbal", nomor: 11, soal: "Imbuhan pe-an dalam kata pemandian memiliki makna ...", pilihan: ["A. Kegiatan", "B. Alat", "C. Suasana", "D. Tempat", "E. Keadaan"], kunci: "D" },
  { bagian: "Kemampuan Verbal", nomor: 12, soal: "Tim public relation sedang ... tempat yang akan dijadikan sebagai sasaran kegiatan. Kata berimbuhan yang tepat untuk mengisi titik-titik di atas adalah ...", pilihan: ["A. Mesurvei", "B. Memsurvei", "C. Mensurvei", "D. Menyurvei", "E. Menyurveikan"], kunci: "D" },
  { bagian: "Kemampuan Verbal", nomor: 13, soal: "AKTUAL — Antonim?", pilihan: ["A. Fiktif", "B. Modern", "C. Sebenarnya", "D. Kadaluarsa", "E. Baru"], kunci: "D" },
  { bagian: "Kemampuan Verbal", nomor: 14, soal: "DEPENDEN — Antonim?", pilihan: ["A. Interaksi", "B. Korelasi", "C. Animasi", "D. Invalid", "E. Mandiri"], kunci: "E" },
  { bagian: "Kemampuan Verbal", nomor: 15, soal: "Berikut ini kalimat yang menerapkan kaidah penulisan angka yang tidak tepat adalah ...", pilihan: ["A. Seperempat gajiku selalu aku tabung untuk membeli rumah", "B. Harga parkir motor di Pakuwon Mall adalah Rp5.000,-", "C. Pedagang kaki lima sering ditemukan dengan kawasan simpang 5", "D. Total hadiah yang didapatkan dari lomba karate adalah 10 juta.", "E. Dua belas rumah rusak akibat tanah longsor yang terjadi di Lombok."], kunci: "D" },
  // BAGIAN II: KEMAMPUAN NUMERIK
  { bagian: "Kemampuan Numerik", nomor: 16, soal: "Gaza memiliki operasi matematika: 10 + 3 - 7 × 5. Jika Gaza mengacak urutan operasi tersebut, berapakah selisih antara bilangan terbesar dan terkecil yang dapat dihasilkan?", pilihan: ["A. 52", "B. 12", "C. 32", "D. 2"], kunci: "A" },
  { bagian: "Kemampuan Numerik", nomor: 17, soal: "Jika x = -y dan x ≠ 0, ada berapa pernyataan berikut yang benar? 1) x²y² < 0, 2) (x+y)² = 0, 3) xy < 0", pilihan: ["A. 0", "B. 3", "C. 2", "D. 1"], kunci: "C" },
  { bagian: "Kemampuan Numerik", nomor: 18, soal: "2 - 20% - 2% - 0,2% - 0,02% = ...", pilihan: ["A. 0,1777", "B. 1,7778", "C. 17,778", "D. 0,1778"], kunci: "B" },
  { bagian: "Kemampuan Numerik", nomor: 19, soal: "Jika x² + y² = 10 dan xy = 3, maka x + y = ...", pilihan: ["A. 4 atau -4", "B. 4", "C. -4", "D. 0"], kunci: "A" },
  { bagian: "Kemampuan Numerik", nomor: 20, soal: "Penjumlahan digit terakhir dan digit pertama dari 3^20 adalah ...", pilihan: ["A. 9", "B. 3", "C. 7", "D. 10"], kunci: "C" },
  { bagian: "Kemampuan Numerik", nomor: 21, soal: "x, 2x, 7, 17, 14, 29, 26, 46, y. Nilai dari x + y adalah ...", pilihan: ["A. 51", "B. 61", "C. 91", "D. 48"], kunci: "B" },
  { bagian: "Kemampuan Numerik", nomor: 22, soal: "3, 7, 11, 15, ... Suku ke-100 dari barisan tersebut adalah ...", pilihan: ["A. 396", "B. 297", "C. 399", "D. 1188"], kunci: "C" },
  { bagian: "Kemampuan Numerik", nomor: 23, soal: "4, 5, 7, 10, 11, 13, 16, 17, ...", pilihan: ["A. 20", "B. 19", "C. 18", "D. 21"], kunci: "B" },
  { bagian: "Kemampuan Numerik", nomor: 24, soal: "3, 4, 7, 2, -5, 4, 15, ...", pilihan: ["A. 2 dan 13", "B. -2 dan -13", "C. -2 dan 13", "D. 2 dan -13"], kunci: "D" },
  { bagian: "Kemampuan Numerik", nomor: 25, soal: "Toni membeli bakso per porsi Rp9.800 dan menginginkan untung 33%. Berapa harga per porsi yang harus dijual?", pilihan: ["A. 11.024", "B. 10.034", "C. 13.034", "D. 15.024"], kunci: "C" },
  { bagian: "Kemampuan Numerik", nomor: 26, soal: "c berbanding lurus dengan x. Bila c = 8,4 dan x = 3,6, berapakah nilai c jika x = 3,336?", pilihan: ["A. 7,774", "B. 4,777", "C. 4,874", "D. 7,784"], kunci: "D" },
  { bagian: "Kemampuan Numerik", nomor: 27, soal: "107% dari 2009 adalah ...", pilihan: ["A. 2491,6", "B. 2149,6", "C. 2419,6", "D. 2194,6"], kunci: "B" },
  { bagian: "Kemampuan Numerik", nomor: 28, soal: "Pak Tono memiliki lahan 412 ha, membeli lagi 256 ha. 316 ha adalah lahan perkebunan, sisanya pertanian. Jika 12% lahan pertanian rusak, berapakah luas lahan yang rusak?", pilihan: ["A. 2,47 hektar", "B. 0,5 hektar", "C. 0,38 hektar", "D. 3,25 hektar"], kunci: "A" },
  { bagian: "Kemampuan Numerik", nomor: 29, soal: "Perusahaan memiliki 8 mesin yang mencapai target dalam 1 bulan. Bulan depan harus selesai 20 hari. Berapa mesin yang perlu dibeli lagi?", pilihan: ["A. 8", "B. 4", "C. 2", "D. 12"], kunci: "B" },
  { bagian: "Kemampuan Numerik", nomor: 30, soal: "Kereta cepat menempuh 3 km dalam 45 detik. Kecepatan dalam km/jam adalah ...", pilihan: ["A. 44", "B. 72", "C. 80", "D. 240"], kunci: "D" },
  // BAGIAN III: PENALARAN LOGIS DAN ANALITIK
  { bagian: "Penalaran Logis", nomor: 31, soal: "Semua siswa MAN 5 Bogor rajin belajar. Budi adalah siswa MAN 5 Bogor. Kesimpulan yang tepat adalah ...", pilihan: ["A. Budi mungkin rajin belajar.", "B. Budi pasti rajin belajar.", "C. Budi tidak rajin belajar.", "D. Semua siswa bernama Budi rajin belajar.", "E. Tidak dapat disimpulkan."], kunci: "B" },
  { bagian: "Penalaran Logis", nomor: 32, soal: "Jika hari ini adalah hari Senin, maka dua hari lagi adalah hari Rabu. Hari ini bukan hari Senin. Kesimpulan yang tepat adalah ...", pilihan: ["A. Dua hari lagi pasti hari Rabu.", "B. Dua hari lagi bukan hari Rabu.", "C. Tidak dapat disimpulkan apakah dua hari lagi Rabu atau bukan.", "D. Hari ini adalah hari Minggu.", "E. Hari ini adalah hari Selasa."], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 33, soal: "Di sebuah kelas, semua yang menyukai matematika juga menyukai fisika. Rini menyukai fisika. Kesimpulan yang tepat adalah ...", pilihan: ["A. Rini pasti menyukai matematika.", "B. Rini tidak menyukai matematika.", "C. Rini mungkin menyukai matematika, mungkin tidak.", "D. Semua yang menyukai fisika menyukai matematika.", "E. Fisika dan matematika selalu berhubungan."], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 34, soal: "Lima orang (A, B, C, D, E) duduk dalam satu baris. A duduk di sebelah kiri B. C duduk di antara D dan E. B duduk paling kanan. Siapakah yang duduk paling kiri?", pilihan: ["A. A", "B. C", "C. D", "D. E", "E. Tidak dapat ditentukan"], kunci: "E" },
  { bagian: "Penalaran Logis", nomor: 35, soal: "Jika tidak ada yang berani, maka tidak ada yang sukses. Andi sukses. Kesimpulan yang tepat adalah ...", pilihan: ["A. Andi tidak berani.", "B. Andi pasti berani.", "C. Semua yang sukses berani.", "D. Andi mungkin berani.", "E. Tidak dapat disimpulkan."], kunci: "B" },
  { bagian: "Penalaran Logis", nomor: 36, soal: "Semua tanaman membutuhkan air. Semua yang membutuhkan air akan layu jika kekeringan. Kesimpulan yang tepat adalah ...", pilihan: ["A. Semua tanaman akan layu jika kekeringan.", "B. Hanya tanaman yang layu jika kekeringan.", "C. Air menyebabkan tanaman layu.", "D. Kekeringan baik untuk tanaman.", "E. Tidak semua tanaman membutuhkan air."], kunci: "A" },
  { bagian: "Penalaran Logis", nomor: 37, soal: "Perhatikan pola gambar: ○ △ □ ○ △ □ ○ △ ... Bentuk apa yang seharusnya mengisi titik-titik?", pilihan: ["A. ○", "B. △", "C. □", "D. ◇", "E. ★"], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 38, soal: "Premis 1: Semua buku memiliki halaman. Premis 2: Novel adalah buku. Manakah kesimpulan yang VALID?", pilihan: ["A. Semua halaman ada di dalam novel.", "B. Novel memiliki halaman.", "C. Buku selalu berisi cerita.", "D. Halaman adalah bagian dari buku saja.", "E. Novel adalah satu-satunya buku."], kunci: "B" },
  { bagian: "Penalaran Logis", nomor: 39, soal: "Kotak A berisi apel atau mangga. Kotak B berisi mangga. Kotak C berisi jeruk. Jika Kotak B dan C digabung, hasilnya berisi ...", pilihan: ["A. Apel dan mangga", "B. Mangga dan jeruk", "C. Apel dan jeruk", "D. Apel, mangga, dan jeruk", "E. Jeruk saja"], kunci: "B" },
  { bagian: "Penalaran Logis", nomor: 40, soal: "Ani lebih tinggi dari Budi, dan Budi lebih tinggi dari Citra, maka ...", pilihan: ["A. Citra lebih tinggi dari Ani.", "B. Budi paling tinggi.", "C. Ani paling tinggi di antara ketiganya.", "D. Citra dan Ani sama tinggi.", "E. Urutan tidak dapat ditentukan."], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 41, soal: "Manakah pernyataan yang PASTI BENAR jika: 'Beberapa siswa rajin, dan semua siswa rajin mendapat beasiswa'?", pilihan: ["A. Semua siswa mendapat beasiswa.", "B. Beberapa siswa mendapat beasiswa.", "C. Siswa yang tidak rajin tidak mendapat beasiswa.", "D. Semua siswa yang mendapat beasiswa adalah rajin.", "E. Tidak ada siswa yang mendapat beasiswa."], kunci: "B" },
  { bagian: "Penalaran Logis", nomor: 42, soal: "Tim X bermain 5 kali: menang 3 kali (3 poin), seri 1 kali (1 poin), kalah 1 kali (0 poin). Berapa total poin tim X?", pilihan: ["A. 8", "B. 9", "C. 10", "D. 11", "E. 12"], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 43, soal: "P lebih besar dari Q. R lebih kecil dari Q. S sama dengan P. Urutan dari terbesar ke terkecil adalah ...", pilihan: ["A. P, Q, R, S", "B. S, P, Q, R", "C. P = S > Q > R", "D. Q > P = S > R", "E. R > Q > P = S"], kunci: "C" },
  { bagian: "Penalaran Logis", nomor: 44, soal: "Alif membeli makanan paling dahulu. Bela mengantre setelah Caca. Doni mengantre sebelum Caca. Bagaimana urutan antrean yang sebenarnya?", pilihan: ["A. Alif, Doni, Bela, Caca", "B. Alif, Bela, Caca, Doni", "C. Alif, Caca, Bela, Doni", "D. Alif, Doni, Caca, Bela"], kunci: "D" },
  { bagian: "Penalaran Logis", nomor: 45, soal: "Umi duduk di sebelah kiri Vina. Vina duduk di belakang Yuli. Siapakah yang duduk di kiri pada baris depan roller coaster?", pilihan: ["A. Vina", "B. Wulan", "C. Tidak dapat dipastikan", "D. Yuli"], kunci: "D" },
  // BAGIAN IV: KEPRIBADIAN DAN MINAT BAKAT (15 soal — tidak ada benar/salah)
  { bagian: "Kepribadian & Minat Bakat", nomor: 46, soal: "Ketika menghadapi tugas kelompok yang sulit, apa yang biasanya kamu lakukan?", pilihan: ["A. Menunggu teman lain memulai agar bisa mengikuti arahannya.", "B. Langsung membagi tugas dan memimpin kelompok agar efisien.", "C. Mengerjakan bagian sendiri tanpa berdiskusi dengan yang lain.", "D. Menyerahkan semua pekerjaan kepada teman yang paling pintar.", "E. Meminta guru menyelesaikan masalah kelompok."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 47, soal: "Saat kamu mendapat nilai ujian yang buruk, reaksi pertamamu adalah ...", pilihan: ["A. Menyalahkan guru karena soal terlalu sulit.", "B. Tidak peduli dan berharap nilai berikutnya lebih baik.", "C. Menganalisis kesalahanmu dan membuat rencana perbaikan.", "D. Mencontek pada ujian berikutnya agar nilainya bagus.", "E. Menyerah dan menganggap diri tidak mampu."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 48, soal: "Temanmu menunjukkan cara menyelesaikan soal matematika yang berbeda dari caramu, padahal keduanya benar. Sikapmu adalah ...", pilihan: ["A. Mempertahankan cara sendiri dan mengabaikan cara temanmu.", "B. Mengatakan cara temanmu salah meskipun jawabannya benar.", "C. Mempelajari cara temanmu dan menggabungkan dengan pemahamanmu.", "D. Langsung meniru cara temanmu tanpa memahaminya.", "E. Merasa cemburu karena cara temanmu lebih efisien."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 49, soal: "Kamu diminta mewakili sekolah dalam lomba debat, tetapi kurang percaya diri. Apa yang akan kamu lakukan?", pilihan: ["A. Menolak karena takut kalah dan mempermalukan sekolah.", "B. Menerima dengan semangat dan berlatih keras.", "C. Menerima tapi tidak belajar sama sekali karena yakin menang.", "D. Meminta teman lain menggantikanmu.", "E. Berpura-pura sakit agar tidak perlu mengikutinya."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 50, soal: "Ketika ada teman yang sedang kesulitan memahami pelajaran, kamu akan ...", pilihan: ["A. Pura-pura tidak tahu agar tidak perlu membantunya.", "B. Membantu menjelaskan sampai ia mengerti.", "C. Memberinya contekan saat ujian agar cepat selesai.", "D. Menyuruhnya bertanya ke guru saja.", "E. Merasa senang karena nilaimu bisa lebih tinggi dari temanmu."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 51, soal: "Bagaimana kamu mengatur waktu belajar selama di asrama?", pilihan: ["A. Belajar hanya saat menjelang ujian saja.", "B. Belajar sesuka hati tanpa jadwal yang jelas.", "C. Membuat jadwal belajar rutin dan mengikutinya dengan disiplin.", "D. Belajar hanya jika ada teman yang mengajak.", "E. Tidak belajar karena menganggap diri sudah cukup pintar."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 52, soal: "Jika kamu menemukan dompet berisi uang di lingkungan sekolah, apa yang akan kamu lakukan?", pilihan: ["A. Mengambil uangnya dan membuang dompetnya.", "B. Menyimpannya karena tidak ada yang melihat.", "C. Menyerahkan kepada guru atau petugas sekolah.", "D. Menunggu pemiliknya datang tanpa melakukan apa-apa.", "E. Memberikannya kepada teman untuk dibagi bersama."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 53, soal: "Kamu tidak setuju dengan keputusan yang diambil oleh ketua kelas. Apa yang akan kamu lakukan?", pilihan: ["A. Diam-diam tidak mematuhi keputusan tersebut.", "B. Menyampaikan pendapat secara santun dan konstruktif di forum diskusi.", "C. Menghasut teman-teman lain untuk menolak keputusan tersebut.", "D. Marah-marah di depan kelas.", "E. Keluar dari kelas karena tidak sepakat."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 54, soal: "Setelah masuk MAN IC, jadwal harian sangat padat: shalat berjamaah, belajar, ekstrakurikuler, dan mengaji. Bagaimana sikapmu?", pilihan: ["A. Mengeluh terus-menerus kepada orang tua agar dipindahkan.", "B. Hanya mengikuti kegiatan yang kamu sukai.", "C. Mengikuti semua kegiatan dengan penuh tanggung jawab dan adaptif.", "D. Menghindari kegiatan yang dianggap melelahkan.", "E. Tidur saat kegiatan berlangsung agar tetap segar."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 55, soal: "Saat kamu berhasil meraih prestasi, reaksimu adalah ...", pilihan: ["A. Menyombongkan diri kepada teman-teman.", "B. Bersyukur dan menjadikannya motivasi untuk terus berkembang.", "C. Merasa sudah cukup dan berhenti berusaha.", "D. Merendahkan teman yang tidak berprestasi.", "E. Menyembunyikan prestasi karena takut diiri."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 56, soal: "Bagaimana perasaanmu jika harus tinggal jauh dari orang tua di asrama?", pilihan: ["A. Sangat tidak mau dan akan pulang tanpa izin.", "B. Sedih tapi siap karena ini demi masa depan yang lebih baik.", "C. Tidak peduli sama sekali.", "D. Takut dan tidak bisa mandiri.", "E. Menyesal mendaftar ke MAN IC."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 57, soal: "Dalam kegiatan diskusi kelompok, kamu lebih suka ...", pilihan: ["A. Diam dan membiarkan orang lain berbicara.", "B. Mendominasi pembicaraan tanpa memberi kesempatan orang lain.", "C. Aktif berbicara, mendengarkan, dan merangkum pendapat bersama.", "D. Keluar dari diskusi jika pendapatmu tidak disetujui.", "E. Hanya setuju dengan semua pendapat agar cepat selesai."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 58, soal: "Kamu melihat teman satu kamar asrama membuang sampah sembarangan. Kamu akan ...", pilihan: ["A. Pura-pura tidak melihat.", "B. Ikut membuang sampah sembarangan karena teman melakukannya.", "C. Mengingatkan dengan cara yang baik dan mencontohkan membuang sampah di tempatnya.", "D. Melaporkan langsung ke kepala asrama tanpa menegurnya terlebih dahulu.", "E. Membersihkan sampahnya diam-diam tanpa menegur."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 59, soal: "Kamu mendapat tugas membaca satu buku tebal dalam seminggu. Cara terbaik yang kamu lakukan adalah ...", pilihan: ["A. Membaca semuanya di hari terakhir sebelum deadline.", "B. Membagi jumlah halaman per hari dan membaca rutin setiap hari.", "C. Hanya membaca bagian kesimpulan saja.", "D. Meminta teman merangkumkan untuk kamu.", "E. Tidak membaca dan mengarang saja saat ditanya."] },
  { bagian: "Kepribadian & Minat Bakat", nomor: 60, soal: "Motivasi utamamu mendaftar ke MAN 5 Bogor adalah ...", pilihan: ["A. Karena dipaksa orang tua.", "B. Agar terlihat keren di mata teman-teman.", "C. Karena ingin mendapatkan pendidikan berkualitas yang mengintegrasikan IPTEK dan nilai Islam.", "D. Karena tidak ada pilihan sekolah lain.", "E. Karena ingin jauh dari orang tua."] },

  // BAGIAN V: MINAT BAKAT (40 soal — tidak ada benar/salah, profil dominan)
  // A=Investigatif, B=Sosial, C=Artistik, D=Teknis, E=Kinestetik
  { bagian: "Minat Bakat", nomor: 1, soal: "Ketika mempelajari konsep yang sangat kompleks, pendekatan yang paling kamu sukai adalah...", pilihan: ["A. Membaca referensi mendalam dan menganalisis teorinya", "B. Mendiskusikan dengan orang lain", "C. Mengubahnya menjadi bentuk Visual/karya", "D. Mencoba eksperimen teknis", "E. Mempraktikkan langsung"] },
  { bagian: "Minat Bakat", nomor: 2, soal: "Jika diberi proyek sekolah besar, kamu paling tertarik mengerjakan...", pilihan: ["A. Analisis data & laporan", "B. Koordinasi tim", "C. Desain visual", "D. Perancangan teknis", "E. Implementasi lapangan"] },
  { bagian: "Minat Bakat", nomor: 3, soal: "Saat menghadapi masalah sulit..", pilihan: ["A. Menguraikan logika", "B. Bertanya pada orang", "C. Mencari ide kreatif", "D. Trial & error", "E. Bertindak cepat"] },
  { bagian: "Minat Bakat", nomor: 4, soal: "Topik yang paling menarik perhatianmu...", pilihan: ["A. Ilmu pengetahuan", "B. Interaksi manusia", "C. Seni & warna", "D. Mesin", "E. Aktivitas fisik"] },
  { bagian: "Minat Bakat", nomor: 5, soal: "Keberhasilan paling membanggakan bagimu...", pilihan: ["A. Prestasi akademik", "B. Pengakuan sosial", "C. Apresiasi karya", "D. Alat berhasil dibuat", "E. Juara olahraga"] },
  { bagian: "Minat Bakat", nomor: 6, soal: "Dalam kerja kelompok kamu biasanya...", pilihan: ["A. Dokumentasi", "B. Pemimpin diskusi", "C. Desainer ide", "D. Teknisi", "E. Pelaksana"] },
  { bagian: "Minat Bakat", nomor: 7, soal: "Waktu luang kamu lebih sering...", pilihan: ["A. Membaca", "B. Bersosialisasi", "C. Berkarya", "D. Eksperimen", "E. Olahraga"] },
  { bagian: "Minat Bakat", nomor: 8, soal: "Orang lain melihatmu sebagai...", pilihan: ["A. Analitis", "B. Ramah", "C. Imajinatif", "D. Teknis", "E. Enerjik"] },
  { bagian: "Minat Bakat", nomor: 9, soal: "Pelajaran favoritmu..", pilihan: ["A. Matematika", "B. Sosiologi", "C. Seni", "D. Fisika", "E. PJOK"] },
  { bagian: "Minat Bakat", nomor: 10, soal: "Pekerjaan impian..", pilihan: ["A. Peneliti", "B. Konselor", "C. Seniman", "D. Engineer", "E. Atlet"] },
  { bagian: "Minat Bakat", nomor: 11, soal: "Saat memahami sistem baru...", pilihan: ["A. Analisis konsep", "B. Diskusi", "C. Visualisasi", "D. Simulasi alat", "E. Praktik"] },
  { bagian: "Minat Bakat", nomor: 12, soal: "Jika ikut lomba...", pilihan: ["A. Olimpiade sains", "B. Debat", "C. Desain", "D. Robotik", "E. Atletik"] },
  { bagian: "Minat Bakat", nomor: 13, soal: "Tugas paling kamu nikmati...", pilihan: ["A. Konseptual", "B. Interaktif", "C. Ekspresif", "D. Mekanis", "E. Fisik"] },
  { bagian: "Minat Bakat", nomor: 14, soal: "Jika mengajari teman...", pilihan: ["A. Jelaskan teori", "B. Tanya jawab", "C. Gambar ilustrasi", "D. Demonstrasi", "E. Praktik"] },
  { bagian: "Minat Bakat", nomor: 15, soal: "Ekstrakurikuler pilihan...", pilihan: ["A. Klub sains", "B. Organisasi", "C. Seni", "D. Teknologi", "E. Olahraga"] },
  { bagian: "Minat Bakat", nomor: 16, soal: "Saat membaca informasi..", pilihan: ["A. Analisis detail", "B. Bahas bersama", "C. Visualisasikan", "D. Uji teknis", "E. Terapkan"] },
  { bagian: "Minat Bakat", nomor: 17, soal: "Saat membuat proyek...", pilihan: ["A. Riset", "B. Kolaborasi", "C. Estetika", "D. Fungsi teknis", "E. Eksekusi"] },
  { bagian: "Minat Bakat", nomor: 18, soal: "Motivasi belajar terbesar...", pilihan: ["A. Pengetahuan", "B. Relasi", "C. Ekspresi", "D. Inovasi", "E. Tantangan fisik"] },
  { bagian: "Minat Bakat", nomor: 19, soal: "Cara mengatasi stres...", pilihan: ["A. Membaca", "B. Curhat", "C. Berkarya", "D. Merakit", "E. Olahraga"] },
  { bagian: "Minat Bakat", nomor: 20, soal: "Lingkungan favorit...", pilihan: ["A. Perpustakaan", "B. Komunitas", "C. Studio seni", "D. Lab", "E. Lapangan"] },
  { bagian: "Minat Bakat", nomor: 21, soal: "Saat menghadapi tantangan..", pilihan: ["A. Strategi logis", "B. Dukungan sosial", "C. Kreativitas", "D. Eksperimen", "E. Aksi"] },
  { bagian: "Minat Bakat", nomor: 22, soal: "Peran saat presentasi...", pilihan: ["A. Penyusun materi", "B. Pembicara", "C. Desain slide", "D. Demo alat", "E. Simulasi"] },
  { bagian: "Minat Bakat", nomor: 23, soal: "Kegiatan menyenangkan...", pilihan: ["A. Analisis", "B. Diskusi", "C. Menggambar", "D. Membongkar alat", "E. Bergerak"] },
  { bagian: "Minat Bakat", nomor: 24, soal: "Jika punya ide...", pilihan: ["A. Tulis konsep", "B. Bahas", "C. Visualkan", "D. Prototipe", "E. Uji"] },
  { bagian: "Minat Bakat", nomor: 25, soal: "Cara belajar favorit..", pilihan: ["A. Buku", "B. Kelompok", "C. Visual", "D. Praktikum", "E. Aktivitas"] },
  { bagian: "Minat Bakat", nomor: 26, soal: "Tujuan utama belajar...", pilihan: ["A. Pengetahuan", "B. Relasi", "C. Kreativitas", "D. Teknologi", "E. Kebugaran"] },
  { bagian: "Minat Bakat", nomor: 27, soal: "Jika memimpin proyek...", pilihan: ["A. Strategi", "B. Motivasi tim", "C. Konsep desain", "D. Sistem teknis", "E. Eksekusi"] },
  { bagian: "Minat Bakat", nomor: 28, soal: "Hal yang membuat penasaran...", pilihan: ["A. Teori", "B. Perilaku manusia", "C. Estetika", "D. Mekanik", "E. Performa tubuh"] },
  { bagian: "Minat Bakat", nomor: 29, soal: "Media ekspresi diri...", pilihan: ["A. Tulisan ilmiah", "B. Percakapan", "C. Seni", "D. Rekayasa", "E. Gerak"] },
  { bagian: "Minat Bakat", nomor: 30, soal: "Aktivitas akhir pekan...", pilihan: ["A. Membaca", "B. Nongkrong", "C. Berkarya", "D. Eksperimen", "E. Olahraga"] },
  { bagian: "Minat Bakat", nomor: 31, soal: "Jika menghadapi konflik...", pilihan: ["A. Analisis", "B. Mediasi", "C. Ide kreatif", "D. Uji solusi", "E. Aksi"] },
  { bagian: "Minat Bakat", nomor: 32, soal: "Kamu bangga jika...", pilihan: ["A. Nilai tinggi", "B. Banyak teman", "C. Karya dipuji", "D. Alat berhasil", "E. Menang lomba"] },
  { bagian: "Minat Bakat", nomor: 33, soal: "Saat berpikir...", pilihan: ["A. Logis", "B. Sosial", "C. Imajinatif", "D. Teknis", "E. Praktis"] },
  { bagian: "Minat Bakat", nomor: 34, soal: "Lingkungan kerja ideal...", pilihan: ["A. Akademik", "B. Sosial", "C. Artistik", "D. Teknologi", "E. Aktif"] },
  { bagian: "Minat Bakat", nomor: 35, soal: "Jika diberi dana proyek...", pilihan: ["A. Riset", "B. Event sosial", "C. Seni", "D. Alat", "E. Pelatihan fisik"] },
  { bagian: "Minat Bakat", nomor: 36, soal: "Saat melihat masalah dunia...", pilihan: ["A. Analisis ilmiah", "B. Dampak sosial", "C. Solusi kreatif", "D. Teknologi", "E. Aksi nyata"] },
  { bagian: "Minat Bakat", nomor: 37, soal: "Bentuk kontribusi favorit...", pilihan: ["A. Ide", "B. Hubungan", "C. Desain", "D. Sistem", "E. Tenaga"] },
  { bagian: "Minat Bakat", nomor: 38, soal: "Saat belajar cepat...", pilihan: ["A. Membaca", "B. Diskusi", "C. Visual", "D. Praktikum", "E. Praktik"] },
  { bagian: "Minat Bakat", nomor: 39, soal: "Nilai penting bagimu..", pilihan: ["A. Logika", "B. Empati", "C. Ekspresi", "D. Inovasi", "E. Ketahanan"] },
  { bagian: "Minat Bakat", nomor: 40, soal: "Masa depan impian...", pilihan: ["A. Akademisi", "B. Sosial", "C. Kreatif", "D. Teknologi", "E. Atletik"] },
];

// ══════════════════════════════════════
// SOAL SESI 2: TES POTENSI AKADEMIK (TPA)
// ══════════════════════════════════════
const SOAL_TPA = [
  { bagian: "Penalaran Matematika", nomor: 1, soal: "Ikram membuat spageti panggang lumer dengan perbandingan massa spageti : adonan saus tomat : keju lumer = 4 : 4 : 2. Jika total massa spageti panggang lumer adalah 2.270 gram, berapakah total massa saus tomat dan keju lumer? (dalam gram)", pilihan: ["A. 1.336", "B. 2.337", "C. 1.337", "D. 2.227"], kunci: "A" },
  { bagian: "Penalaran Matematika", nomor: 2, soal: "Seorang tukang jahit mampu menjahit 60 potong kaos dalam 3 hari. Bila ia bekerja selama 2 minggu, berapa potong kaos yang dapat ia kerjakan?", pilihan: ["A. 210 potong", "B. 140 potong", "C. 280 potong", "D. 350 potong"], kunci: "C" },
  { bagian: "Penalaran Matematika", nomor: 3, soal: "Populasi sapi di kota P adalah 1.600 ekor (naik 25/bulan) dan kota Q 500 ekor (naik 10/bulan). Saat populasi kota P tiga kali kota Q, berapa populasi sapi di kota P?", pilihan: ["A. 2.250", "B. 2.400", "C. 2.100", "D. 1.900"], kunci: "A" },
  { bagian: "Penalaran Matematika", nomor: 4, soal: "Perhatikan grafik berikut! Berdasarkan grafik jumlah penumpang di bawah, pernyataan berikut yang paling tepat adalah ...", gambar: "/images/1.jpeg", pilihan: ["A. Jumlah penumpang September 2021 lebih dari 2x lipat penumpang Agustus 2021.", "B. Selisih jumlah penumpang Desember 2020 dan September 2021 sebanyak 1,96 juta penumpang.", "C. Jumlah penumpang Oktober 2020 meningkat 700 ribu dibanding tahun sebelumnya.", "D. Penumpang paling sedikit 995.400 terjadi pada bulan Juni 2020."], kunci: "B" },
  { bagian: "Penalaran Matematika", nomor: 5, soal: "Ramalan cuaca: Moskow (-5°C s/d 18°C), Mexico (17°C s/d 34°C), Paris (-3°C s/d 17°C), Tokyo (-2°C s/d 25°C). Perubahan suhu terbesar terjadi di kota ...", pilihan: ["A. Paris", "B. Mexico", "C. Moskow", "D. Tokyo"], kunci: "C" },
  { bagian: "Penalaran Matematika", nomor: 6, soal: "Harga botol minum mewah Rp2.200.000. Tahun depan turun 5%, lalu diskon 10% saat New Year Sale. Berapa yang Bu Syifa bayar?", pilihan: ["A. Rp2.900.000", "B. Rp1.881.000", "C. Rp2.090.000", "D. Rp1.181.000"], kunci: "B" },
  { bagian: "Penalaran Matematika", nomor: 7, soal: "Peternakan 1: 500 ekor (+10/bulan), Peternakan 2: 300 ekor (+15/bulan). Setelah berapa bulan jumlah ayam keduanya sama?", pilihan: ["A. 67", "B. 53", "C. 50", "D. 40"], kunci: "D" },
  { bagian: "Penalaran Matematika", nomor: 8, soal: "Perhatikan grafik berikut! Berdasarkan grafik populasi penduduk di bawah, manakah pernyataan berikut yang SALAH?", gambar: "/images/2.jpeg", pilihan: ["A. Penduduk usia di bawah 20 tahun berjumlah 3,9 juta orang.", "B. Penduduk usia 40-44 tahun lebih banyak dari usia 0-4 tahun.", "C. Selisih penduduk usia 45-49 tahun dan 0-4 tahun berjumlah 190.270 orang.", "D. Penduduk usia 55-59 tahun sekitar setengah dari penduduk usia 35-39 tahun."], kunci: "B" },
  { bagian: "Penalaran Matematika", nomor: 9, soal: "Perbandingan kayu jati Pak Ahmad:Pak Nadhim = 7:8 dan Pak Nadhim:Pak Chafidz = 9:10. Total 2,15 ton. Massa kayu jati masing-masing (kg) secara berurutan adalah ...", pilihan: ["A. 63, 72, 80", "B. 720, 630, 800", "C. 72, 63, 80", "D. 630, 720, 800"], kunci: "D" },
  { bagian: "Penalaran Matematika", nomor: 10, soal: "Pak Nosyan ingin mendapat keuntungan 35% dari penjualan TV. Harga beli TV Rp1.400.000. Berapa harga jual yang tepat?", pilihan: ["A. Rp1.870.000", "B. Rp1.980.000", "C. Rp1.890.000", "D. Rp1.872.000"], kunci: "C" },
  { bagian: "Penalaran Matematika", nomor: 11, soal: "Banyak bilangan kurang dari 1000 yang disusun dari angka 1, 2, 3, 4, 5, dan 6 adalah ...", pilihan: ["A. 120", "B. 156", "C. 216", "D. 258"], kunci: "D" },
  { bagian: "Penalaran Matematika", nomor: 12, soal: "Tika membawa uang n. Beli 4 bungkus mie kembalian Rp900. Beli 5 bungkus mie kurang Rp1.500. Berapa uang yang dibawa Tika?", pilihan: ["A. Rp10.500", "B. Rp16.000", "C. Rp14.000", "D. Rp12.000"], kunci: "D" },
  { bagian: "Penalaran Matematika", nomor: 13, soal: "Tabel nilai Matematika kelas 9C: Nilai 5(3 siswa), 6(7), 7(8), 8(4), 9(3), 10(1). Berapa jumlah siswa yang nilainya di bawah rata-rata?", gambar: "/images/3.jpeg", pilihan: ["A. 18", "B. 10", "C. 3", "D. 22"], kunci: "B" },
  { bagian: "Penalaran Matematika", nomor: 14, soal: "Organisasi 22 anggota, dipilih 4 pengurus secara acak. Jika 1 sudah terpilih, peluang anggota lain TIDAK terpilih menjadi pengurus adalah ...", pilihan: ["A. 1/9", "B. 1/7", "C. 7/9", "D. 6/7"], kunci: "D" },
  { bagian: "Penalaran Matematika", nomor: 15, soal: "Perbandingan panjang dan lebar persegi panjang 7:4. Keliling 66 cm. Berapa luasnya?", pilihan: ["A. 218 cm²", "B. 198 cm²", "C. 132 cm²", "D. 252 cm²"], kunci: "B" },
  { bagian: "Penalaran Matematika", nomor: 16, soal: "Mobil antik Rp54.000.000 diskon 10%, lalu diskon lagi 15% via ATM Salcen. Berapa harga yang dibayar?", pilihan: ["A. Rp52.500.000", "B. Rp41.310.000", "C. Rp40.500.000", "D. Rp54.500.000"], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 1, soal: "Adam membaca ayat sajdah, lalu menghadap kiblat, niat, takbir, sujud, dan salam. Hal yang dilakukan Adam adalah contoh dari sujud ...", pilihan: ["A. Tilawah", "B. Wajib", "C. Syukur", "D. Sahwi"], kunci: "A" },
  { bagian: "Literasi Keislaman", nomor: 2, soal: "Perhatikan hadis berikut! Dalam hadis yang tercantum di bawah, terdapat amalan salat sunah ghairu muakkad, yaitu ...", gambar: "/images/4.jpeg", pilihan: ["A. Salat Istisqa'", "B. Salat Idul Fitri", "C. Salat Idul Adha", "D. Salat Istikharah"], kunci: "A" },
  { bagian: "Literasi Keislaman", nomor: 3, soal: "Perhatikan dalil berikut! Dalil di bawah menyebutkan dua bangkai yang halal untuk dimakan, yaitu ...", gambar: "/images/5.jpeg", pilihan: ["A. Ikan dan belalang", "B. Kambing dan sapi", "C. Unta dan sapi", "D. Ikan dan unta"], kunci: "A" },
  { bagian: "Literasi Keislaman", nomor: 4, soal: "Yang termasuk syarat wajib zakat fitrah dari daftar ketentuan adalah ...", pilihan: ["A. a, d, dan g", "B. c, d, dan h", "C. a, b, dan g", "D. b, e, dan f"], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 5, soal: "Berikut adalah syarat yang berhubungan dengan barang yang digadaikan dalam ar-Rahn, KECUALI ...", pilihan: ["A. Barang berharga yang dapat menutup hutangnya.", "B. Barang yang tidak boleh diperjualbelikan.", "C. Milik orang yang menggadaikan.", "D. Diketahui ukuran, jenis, dan sifatnya."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 6, soal: "Dari daftar: (1) Ibu, (2) Saudara perempuan sebapak, (3) Istri, (4) Cucu perempuan dari anak laki-laki, (5) Anak perempuan, (6) Cucu perempuan dari anak perempuan. Yang termasuk ahli waris perempuan adalah ...", pilihan: ["A. 1, 2, 3, 4, 5", "B. 1, 2, 3, 5, 6", "C. 1, 2, 4, 5, 6", "D. 1, 3, 4, 5, 6"], kunci: "D" },
  { bagian: "Literasi Keislaman", nomor: 7, soal: "Allah membuka jalan bagi manusia untuk menggali karunia-Nya dan membuka pintu kemenangan. Sifat Allah yang sesuai adalah ...", pilihan: ["A. Ar-Rauf", "B. Al-Aziz", "C. Al-Fattah", "D. Al-Qayyum"], kunci: "C" },
  { bagian: "Literasi Keislaman", nomor: 8, soal: "Berikut yang BUKAN adab ketika membaca al-Qur'an adalah ...", pilihan: ["A. Membaguskan suara ketika membacanya.", "B. Membaca dalam keadaan suci.", "C. Memulai bacaan dengan isti'azah.", "D. Membacanya dengan cepat dan terburu-buru."], kunci: "D" },
  { bagian: "Literasi Keislaman", nomor: 9, soal: "Esensi sebenarnya dari moderasi beragama adalah ...", pilihan: ["A. Menggabungkan ajaran berbagai agama agar tercipta perdamaian universal.", "B. Mengurangi ketaatan pada ritual agama demi menyesuaikan diri dengan tren modern.", "C. Cara pandang, sikap, dan praktik dalam kehidupan beragama yang melindungi martabat kemanusiaan.", "D. Menjadikan rasio sebagai satu-satunya tolok ukur kebenaran dalam memahami teks suci."], kunci: "C" },
  { bagian: "Literasi Keislaman", nomor: 10, soal: "Siswa merasa peraturan menyanyikan lagu Indonesia Raya bertentangan dengan kemurnian ibadah. Sikap moderat yang seharusnya diambil adalah ...", pilihan: ["A. Melakukan protes terbuka dan mengajak memboikot upacara.", "B. Memahami bahwa mencintai tanah air adalah bagian dari nilai agama yang bersifat muamalah.", "C. Pura-pura mengikuti aturan tetapi dalam hati membenci otoritas sekolah.", "D. Keluar dari sekolah dan mencari sekolah tanpa aturan kebangsaan."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 11, soal: "Bahaya algoritma media sosial yang menciptakan echo chamber bagi moderasi beragama adalah ...", pilihan: ["A. Mempercepat penyebaran informasi keagamaan yang valid.", "B. Memperkuat konfirmasi bias sehingga menutup diri dari kebenaran lain.", "C. Memudahkan koordinasi kegiatan bakti sosial lintas agama.", "D. Mengurangi minat generasi muda mempelajari sejarah agama."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 12, soal: "Dalam diskusi penggunaan AI untuk menjawab persoalan fikih, sikap Tawasuth ditunjukkan oleh ...", pilihan: ["A. Kelompok yang menggunakan AI sebagai alat bantu, namun tetap verifikasi ke guru/ulama.", "B. Kelompok yang memilih tidak ikut campur karena takut salah.", "C. Kelompok yang menyarankan AI dilarang di lingkungan sekolah.", "D. Kelompok yang meminta pemerintah membuat AI agama yang bersifat wajib."], kunci: "A" },
  { bagian: "Literasi Keislaman", nomor: 13, soal: "Toleransi yang salah kaprah adalah jika seseorang ...", pilihan: ["A. Membiarkan tetangga berbeda agama merayakan hari besarnya dengan tenang.", "B. Mengikuti ritual ibadah agama lain karena merasa semua agama sama saja.", "C. Memberikan bantuan logistik kepada korban bencana tanpa melihat latar belakang agama.", "D. Menjaga keamanan tempat ibadah agama lain saat sedang digunakan."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 14, soal: "Sebagai ketua OSIS yang moderat (prinsip I'tidal), jika ada dua ekskul agama mengajukan dana bersamaan, tindakan paling tepat adalah ...", pilihan: ["A. Memberikan dana lebih besar kepada ekskul dengan anggota paling banyak.", "B. Memberikan dana hanya kepada ekskul yang seagama dengannya.", "C. Membagi dana secara proporsional dan adil sesuai kebutuhan objektif masing-masing.", "D. Menolak keduanya agar tidak terjadi kecemburuan sosial."], kunci: "C" },
  { bagian: "Literasi Keislaman", nomor: 15, soal: "Mengapa sikap anti-kekerasan verbal menjadi syarat mutlak moderasi beragama di media sosial?", pilihan: ["A. Karena dapat menurunkan peringkat akun media sosial.", "B. Karena kekerasan verbal adalah pintu masuk menuju kekerasan fisik dan perpecahan sosial.", "C. Karena aturan hukum di Indonesia sangat ketat.", "D. Karena tokoh agama tidak boleh dikritik sama sekali."], kunci: "B" },
  { bagian: "Literasi Keislaman", nomor: 16, soal: "Di sebuah daerah terdapat tradisi sedekah bumi sebagai bentuk syukur. Sikap seorang siswa moderat terhadap tradisi tersebut adalah ...", pilihan: ["A. Mengharamkan secara mutlak tanpa mempelajari filosofinya.", "B. Menerima tradisi sebagai kekayaan budaya dan menyisipkan nilai syukur tanpa merusak ajaran agama.", "C. Memaksa mengubah seluruh tata cara adat menjadi ritual agama murni.", "D. Menjauhi masyarakat yang masih mempraktikkan tradisi tersebut."], kunci: "B" },
  {
    bagian: "Literasi Membaca", nomor: 1,
    teksJudul: "Teks 1: Aktivitas Fisik dan PTM",
    teks: "Menurut Kemenkes, aktivitas fisik merupakan setiap gerakan tubuh yang diakibatkan kerja otot rangka dan meningkatkan pengeluaran tenaga serta energi. Data menunjukkan kesadaran masyarakat Indonesia dalam mementingkan aktivitas fisik harian dinilai masih rendah. Kurangnya aktivitas fisik merupakan salah satu penyebab cukup tingginya PTM (penyakit tidak menular) di Indonesia.\n\nBerdasarkan data Riskesdas tahun 2013, tingginya PTM di Indonesia menjadi salah satu penyebab mayoritas kematian di Indonesia. Penyakit yang umum dialami oleh masyarakat Indonesia adalah diabetes, hipertensi, obesitas, stroke, penyakit jantung kronis, dan gagal ginjal. Pemerintah pun menemukan bahwa dari sekian jumlah penderita PTM di Indonesia, tidak lagi diisi oleh orang dengan usia yang sudah lanjut. Mulai banyak ditemukan penderita PTM dengan usia produktif 15–65 tahun, bahkan di usia muda, yaitu 0–15 tahun. Oleh karena itu, penting untuk mengimbau masyarakat agar rajin beraktivitas fisik guna menunjang kesehatan individu.\n\n(Sumber: kemkes.go.id)",
    soal: "Berikut yang TIDAK termasuk manfaat dari aktivitas fisik adalah ...",
    pilihan: ["A. Menurunkan risiko penyakit jantung kronis.", "B. Meningkatkan risiko terjangkit PTM.", "C. Mencegah penyakit tidak menular.", "D. Meningkatkan sistem kekebalan tubuh."], kunci: "B"
  },
  {
    bagian: "Literasi Membaca", nomor: 2,
    teksJudul: "Teks 2: Kompetisi Robotik Madrasah (KRM)",
    teks: "Dirjen Pendidikan Islam M Nanda Abdullah berkomitmen untuk terus mengembangkan Kompetisi Robotik Madrasah (KRM). Hal ini disampaikan pria yang akrab disapa Nanda ini saat memberikan sambutan pada penutupan KRM 2021 di Banten, Minggu (17/10/2021). Ajang ini digelar dalam dua kategori, Rancang Bangun dan Robot Mobile, untuk jenjang Madrasah Ibtidaiyah (MI), Madrasah Tsanawiyah (MTs), dan Madrasah Aliyah (MA).\n\nMenurut M Nanda Abdullah, KRM dirancang untuk memberi wahana kepada anak-anak madrasah dalam hal kreativitas robotik. \"Kita meyakini bentuk pendidikan terbaik bagi putra-putri kita saat ini adalah madrasah. Dengan ini kita lengkapi mereka dengan ilmu kontemporer,\" katanya. Di masa depan, lanjut Abdullah, bangsa yang sukses adalah yang memiliki, menguasai, dan mengendalikan teknologi. \"Robotika adalah cabang sains yang akan memegang peran sentral di masa depan yang trennya mengandalkan teknologi digital dan automasi,\" tegasnya.\n\nKompetisi robotik ini ditutup oleh Sekretaris Jenderal Kementerian Agama Ali Nursyah. Dalam sambutannya, Nursyah mengapresiasi madrasah yang menunjukkan performa luar biasa dalam mengikuti tren kekinian, di samping belajar ilmu pengetahuan dan Agama. Teknologi robot kini telah mencakup artificial intelligence, machine learning, cyber security, dan internet of things.\n\n(Sumber: kemenag.go.id)",
    soal: "Pernyataan yang SALAH dari teks berita di atas adalah ...",
    pilihan: ["A. KRM digelar dengan dua kategori: Rancang Bangun dan Robot Mobile.", "B. KRM diikuti murid madrasah dari jenjang SD hingga SMA.", "C. Kemenag sudah memberikan media untuk anak-anak madrasah berkreasi dalam robotika.", "D. Teknologi robot penting dipelajari karena berguna di masa depan."], kunci: "B"
  },
  {
    bagian: "Literasi Membaca", nomor: 3,
    teksJudul: "Teks 2: Kompetisi Robotik Madrasah (KRM)",
    soal: "Makna istilah \"kontemporer\" pada teks di atas adalah ...",
    pilihan: ["A. Masa lalu", "B. Masa depan", "C. Masa kini", "D. Kuno"], kunci: "C"
  },
  {
    bagian: "Literasi Membaca", nomor: 4,
    teksJudul: "Teks 3: Pertemuan Bilateral Indonesia-Kolombia",
    teks: "Menteri Luar Negeri Indonesia Retno L.P. Marsudi menyelenggarakan pertemuan bilateral secara virtual dengan Menlu Kolombia, Claudia Blum De Barberí, pada Rabu (05/08/2020). Pertemuan tersebut diikuti dengan penandatanganan dua perjanjian. Perjanjian ini merupakan penandatanganan pertama yang dilakukan secara virtual oleh kedua negara.\n\n\"Kami membicarakan beberapa isu untuk semakin meningkatkan kerja sama bilateral, termasuk penandatanganan Persetujuan Pembebasan Visa bagi Pemegang Paspor Biasa dan Memorandum Saling Pengertian (MSP) tentang Konsultasi Politik antara Kementerian Luar Negeri kedua negara,\" tutur Menlu Retno.\n\nPertemuan virtual diselenggarakan dalam konteks peringatan 40 tahun hubungan diplomatik kedua negara pada 15 September 2020. Kolombia merupakan negara sahabat penting bagi Indonesia, yaitu sebagai partner perdagangan terbesar keenam di Amerika Selatan pada tahun 2019, juga partner investasi kedua terbesar di kawasan pada tahun yang sama.\n\n(Sumber: kemlu.go.id)",
    soal: "Istilah \"memorandum\" pada teks di atas memiliki makna ...",
    pilihan: ["A. Catatan berisi penjelasan", "B. Ketentuan tambahan", "C. Penyerahan persoalan yang diputuskan dengan pemungutan suara", "D. Surat pernyataan dalam hubungan diplomasi"], kunci: "D"
  },
  {
    bagian: "Literasi Membaca", nomor: 5,
    teksJudul: "Teks 3: Pertemuan Bilateral Indonesia-Kolombia",
    soal: "Pernyataan yang BENAR dari teks di atas adalah ...",
    pilihan: ["A. Kolombia adalah partner investasi keenam terbesar bagi Indonesia.", "B. Penandatanganan pada pertemuan ini pertama kalinya diselenggarakan secara virtual.", "C. Menlu Indonesia dan Menlu Kolombia bertemu secara tatap muka pada 5 Agustus 2020.", "D. Pertemuan bilateral diisi dengan penandatanganan satu perjanjian."], kunci: "B"
  },
  {
    bagian: "Literasi Membaca", nomor: 6,
    teksJudul: "Teks 4: Kota Tua sebagai Kawasan Bahasa Negara",
    teks: "Kementerian Pendidikan dan Kebudayaan (Kemendikbud) mencanangkan Kota Tua sebagai kawasan praktik baik penggunaan bahasa negara di ruang publik pada Rabu (9/9/2020) di Museum Seni dan Keramik, Kota Tua. Pencanangan tersebut merupakan kerja sama antara Badan Pengembangan dan Pembinaan Bahasa Kemendikbud dengan Pemerintah Provinsi DKI Jakarta.\n\n\"Melalui kesempatan ini, dengan sukacita saya tetapkan Kota Tua Jakarta sebagai kawasan praktik baik pengutamaan bahasa negara di ruang publik,\" ucap Mendikbud Nadiem Makarim saat memberikan sambutan secara daring. Menurut Mendikbud, kegiatan ini merupakan contoh baik dari upaya gotong royong untuk menjaga dan merawat penggunaan bahasa Indonesia di masyarakat luas.\n\nKepala Badan Pengembangan dan Pembinaan Bahasa Kemendikbud Aminuddin Aziz mengungkap salah satu alasan dipilihnya Kota Tua sebagai kawasan penggunaan bahasa negara di ruang publik, yaitu karena adanya aspek historis. Kota Tua Jakarta dianggap menyimpan banyak rekaman sejarah penting bagi Jakarta dan Indonesia. Selain itu, aspek strategis Kota Tua Jakarta juga menjadi alasannya — kawasan ini memiliki potensi besar sebagai tempat wisata keluarga, wisata belanja, serta wisata sejarah. Tak hanya sebatas ikon situs sejarah dan rekreasi, Kota Tua juga dianggap sebagai wahana edukasi untuk masyarakat.\n\n(Sumber: kemdikbud.go.id)",
    soal: "Berikut termasuk pernyataan yang BENAR dari teks di atas, KECUALI ...",
    pilihan: ["A. Pencanangan Kota Tua merupakan hasil kerja sama Kemendikbud dengan Pemprov DKI Jakarta.", "B. Penggunaan bahasa Indonesia diperkuat dengan undang-undang dan peraturan presiden.", "C. Kawasan penggunaan bahasa negara dibuat untuk melestarikan bahasa-bahasa di dunia.", "D. Aspek historis, strategis, rekreasi, dan edukasi termasuk alasan dipilihnya Kota Tua."], kunci: "C"
  },
  {
    bagian: "Literasi Membaca", nomor: 7,
    teksJudul: "Teks 4: Kota Tua sebagai Kawasan Bahasa Negara",
    soal: "Arti kata \"situs\" pada teks di atas adalah ...",
    pilihan: ["A. Daerah temuan benda-benda purbakala", "B. Daerah perlindungan untuk melestarikan tumbuhan dan binatang", "C. Program komputer yang menjalankan peladen untuk menyediakan akses laman", "D. Tempat sakral bagi masyarakat lokal"], kunci: "A"
  },
  {
    bagian: "Literasi Membaca", nomor: 8,
    teksJudul: "Teks 5: Korupsi di Indonesia",
    teks: "Korupsi bukan hal yang baru bagi bangsa Indonesia. Tanpa disadari, korupsi muncul dari kebiasaan yang dianggap lumrah dan wajar oleh masyarakat umum. Seperti memberi hadiah kepada pejabat, pegawai negeri, atau keluarganya sebagai imbal jasa sebuah pelayanan. Secara umum, tindak pidana ini tidak hanya mengakibatkan kerugian keuangan negara, tetapi juga dapat mengakibatkan dampak yang sangat luas, baik di bidang sosial, ekonomi, keamanan, politik, dan budaya. Korupsi juga merupakan tindak pidana yang dapat merusak nilai-nilai demokrasi dan moralitas suatu bangsa.\n\nSulitnya pemberantasan tindak pidana korupsi dikarenakan permasalahan korupsi bukan hanya terjadi di lingkungan birokrasi, tetapi juga pada sektor swasta, dunia usaha, dan lembaga-lembaga dalam masyarakat pada umumnya. Pemerintah menyadari bahwa usaha pemberantasan korupsi tidak semata-mata merupakan persoalan hukum, tetapi juga merupakan persoalan sosial, ekonomi dan politik. Oleh karena itu, upaya pemberantasannya pun harus bersifat komprehensif dan multidisipliner.\n\n(Sumber: dipb.kemenkeu.go.id)",
    soal: "Pernyataan berikut yang TIDAK termasuk alasan mengapa korupsi harus diberantas adalah ...",
    pilihan: ["A. Merugikan Indonesia secara ekonomi.", "B. Mencoreng nama baik Indonesia di dunia internasional.", "C. Menimbulkan ketidakpercayaan rakyat kepada pemerintah.", "D. Melestarikan dan mempertahankan jati diri bangsa."], kunci: "D"
  },
  {
    bagian: "Literasi Membaca", nomor: 9,
    teksJudul: "Text 6: A Letter from Marshel",
    teks: "This is Marshel, I was working on a case involving a thief from Morocco in Germany (they stole the biggest jewelry from the richest man alive, Richie Rich). When I'm seeking the culprit, it leads me to a treasure in North Sumatra with a woman called \"Carmen\" as her codename. Attached to this letter, I assume, would be two plane tickets and two fake passports for you and Yatson. Do pack your bags and let's meet at \"Junkie Bar\" next to the abandoned cinema. Don't flash yourself or you'll cause some unnecessary trouble again.\n\nHave a lovely day,\nJuley.",
    soal: "What is the purpose of the text above?",
    pilihan: ["A. To remind Juley not to flash himself.", "B. To wish Juley a lovely day.", "C. To inform Juley of Marshel's recent work.", "D. To urge Juley and Yatson to meet Marshel."], kunci: "D"
  },
  {
    bagian: "Literasi Membaca", nomor: 10,
    teksJudul: "Text 6: A Letter from Marshel",
    soal: "The statements below are TRUE according to the text above, EXCEPT ...",
    pilihan: ["A. The thief was from Germany.", "B. Marshel is seeking for the culprit.", "C. Marshel and Juley are to meet next to an abandoned cinema.", "D. Attached to the letter are plane tickets and passports."], kunci: "A"
  },
  {
    bagian: "Literasi Membaca", nomor: 11,
    teksJudul: "Text 7: The Pot (Story of Birbal)",
    teks: "Once Emperor Akmal became very angry at his favorite minister Birbal. He asked Birbal to leave the kingdom and go away. Accepting the command of the Emperor, Birbal left the kingdom and started working in a farmer's farm in an unknown village far away under a different identity.\n\nAs months passed, Akmal started to miss Birbal. He was struggling to solve many issues in the empire without Birbal's advice. He regretted the decision, asking Birbal to leave the empire in anger. So Akmal sent his soldiers to find Birbal, but they failed to find him. Akmal finally found a trick. He sent a message to the head of every village to send a pot full of wit to the Emperor. If the pot full of wit could not be sent, fill the pot with diamonds and jewels.\n\nThis message also reached Birbal, who lived in one of the villages. Birbal took the pot and went back to the farm. He had planted watermelons on his farm. He selected a small watermelon and without cutting it from the plant, he put that in the pot. He started looking after it by providing water and fertilizer regularly. Within a few days, the watermelon grew into a pot so much that it was impossible to get it out of the pot. Birbal then cut the watermelon from the vine and sent a pot to Emperor Akmal with a message: \"Please remove the wit without cutting it from the pot and without breaking the pot.\"\n\nAkmal watched the watermelon in the pot and realized that this could only be Birbal's work. Akmal himself came to the village and took Birbal back with him.",
    soal: "Below are the steps Birbal took to accomplish the task of giving a pot full of wit to the Emperor, EXCEPT ...",
    pilihan: ["A. Birbal selected a watermelon to be placed in the pot.", "B. Birbal cut open the watermelon.", "C. Birbal provided water and fertilizer.", "D. Birbal sent the pot away."], kunci: "B"
  },
  {
    bagian: "Literasi Membaca", nomor: 12,
    teksJudul: "Text 7: The Pot (Story of Birbal)",
    soal: "The conclusion from the story is ...",
    pilihan: ["A. Emperor Akmal and Birbal made peace.", "B. Birbal stayed at the Emperor's side for the rest of his life.", "C. Birbal lived happily ever after with the Emperor.", "D. Birbal regrets his decision of going away."], kunci: "A"
  },
  {
    bagian: "Literasi Membaca", nomor: 13,
    teksJudul: "Text 7: The Pot (Story of Birbal)",
    soal: "Which of the following is FALSE, according to the passage?",
    pilihan: ["A. Emperor Akmal knows Birbal very well.", "B. Birbal is easily trusted.", "C. Birbal is a trickster, posing as a watermelon as wit.", "D. Birbal went back to the Emperor's side."], kunci: "C"
  },
  {
    bagian: "Literasi Membaca", nomor: 14,
    teksJudul: "Text 7: The Pot (Story of Birbal)",
    soal: "Everyone trusted Birbal and agreed to give him a chance. The word \"trusted\" CANNOT be replaced with ...",
    pilihan: ["A. Counted on", "B. Doubted", "C. Confided in", "D. Believed"], kunci: "B"
  },
  {
    bagian: "Literasi Membaca", nomor: 15,
    teksJudul: "Text 8: Library Announcement",
    teks: "ANNOUNCEMENT\n\nNotice to all students of Esan Cendana Seruni Islamic SHS who haven't returned the library's book, we are urged to return it before the last day of examination on December 15, 2020. For those who haven't returned the library's book until that specified deadline, we will apply the fines according to the applicable regulation. Thank you for your understanding and cooperation. Have a safe trip and happy new year!\n\nSigned,\nHead of Librarian of Esan Cendana Seruni Islamic SHS\nYunika Thesa",
    soal: "From the passage above, we can conclude that ...",
    pilihan: ["A. Wishing them a safe trip and happy new year.", "B. A warning for students who have not returned their book yet.", "C. Notifying students about the fines by the librarian.", "D. The announcement is made to remind students for returning schoolbooks."], kunci: "B"
  },
  {
    bagian: "Literasi Membaca", nomor: 16,
    teksJudul: "Text 8: Library Announcement",
    soal: "According to the passage above, what will happen to students who fail to return the books before the specified deadline?",
    pilihan: ["A. The students are to replace the books.", "B. The students will receive a written reminder.", "C. The students will be given a fine.", "D. Nothing will happen."], kunci: "C"
  },
];

const BAGIAN_LIST_TPB = ["Kemampuan Verbal", "Kemampuan Numerik", "Penalaran Logis", "Kepribadian & Minat Bakat", "Minat Bakat"];
const BAGIAN_LIST_TPA = ["Penalaran Matematika", "Literasi Keislaman", "Literasi Membaca"];

const WARNA_BAGIAN = {
  "Kemampuan Verbal":        { bg: "#e8f4fd", accent: "#2980b9", light: "#d0e8f8" },
  "Kemampuan Numerik":       { bg: "#fef9e7", accent: "#d4a017", light: "#fdedc8" },
  "Penalaran Logis":         { bg: "#f3e5f5", accent: "#8e44ad", light: "#e1bee7" },
  "Kepribadian & Minat Bakat": { bg: "#e8f5e9", accent: "#27ae60", light: "#c8f0d8" },
  "Penalaran Matematika":    { bg: "#e8f4fd", accent: "#2980b9", light: "#d0e8f8" },
  "Literasi Keislaman":      { bg: "#eafaf1", accent: "#27ae60", light: "#c8f0d8" },
  "Literasi Membaca":        { bg: "#fef9e7", accent: "#d4a017", light: "#fdedc8" },
};

const GOOGLE_SCRIPT_URL_TPB =
  "https://script.google.com/macros/s/AKfycbzWwDhRU2-JnOjRKrYPlW7C11hOvhF59URRZ_vRyzzuS9psDqscMcgtzRBV04jY1uArlQ/exec";
const GOOGLE_SCRIPT_URL_TPA =
  "https://script.google.com/macros/s/AKfycbzWwDhRU2-JnOjRKrYPlW7C11hOvhF59URRZ_vRyzzuS9psDqscMcgtzRBV04jY1uArlQ/exec";

function formatWaktu(secs) {
  const m = Math.floor(secs / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Bagian yang tidak dihitung benar/salah
const BAGIAN_TANPA_KUNCI = ["Kepribadian & Minat Bakat", "Minat Bakat"];

function hitungSkor(soalList, jawabanObj) {
  // Hitung total (exclude bagian tanpa kunci)
  const soalDinilai = soalList.filter((s) => !BAGIAN_TANPA_KUNCI.includes(s.bagian));
  let benar = 0;
  soalDinilai.forEach((s, _) => {
    const gi = soalList.indexOf(s);
    if (jawabanObj[gi] === s.kunci) benar++;
  });
  return {
    benar,
    total: soalDinilai.length,
    persen: soalDinilai.length > 0 ? Math.round((benar / soalDinilai.length) * 100) : 0,
  };
}

function hitungSkorPerBagian(soalList, jawabanObj) {
  const bagianMap = {};
  soalList.forEach((s, i) => {
    if (!bagianMap[s.bagian]) bagianMap[s.bagian] = { soal: [], idx: [] };
    bagianMap[s.bagian].soal.push(s);
    bagianMap[s.bagian].idx.push(i);
  });
  const result = {};
  Object.entries(bagianMap).forEach(([bagian, data]) => {
    if (BAGIAN_TANPA_KUNCI.includes(bagian)) {
      const dijawab = data.idx.filter((i) => jawabanObj[i] !== undefined).length;
      result[bagian] = { benar: "-", total: data.soal.length, dijawab, persen: "-", catatan: "Tidak dinilai" };
    } else {
      let benar = 0;
      data.idx.forEach((i, j) => { if (jawabanObj[i] === data.soal[j].kunci) benar++; });
      result[bagian] = { benar, total: data.soal.length, persen: Math.round((benar / data.soal.length) * 100) };
    }
  });
  return result;
}

export default function UjianOnline() {
  // tahap: "identitas" | "pengerjaan" | "skorSesi1" | "pengerjaanSesi2" | "skorSesi2" | "sudahSubmit"
  const [tahap, setTahap] = useState("identitas");
  const [sesiAktif, setSesiAktif] = useState(1);
  const [identitas, setIdentitas] = useState({ nama: "", kelas: "", nis: "", sekolah: "" });
  const [jawabanSesi1, setJawabanSesi1] = useState({});
  const [jawabanSesi2, setJawabanSesi2] = useState({});
  const [waktu, setWaktu] = useState(DURATION_SESI);
  const [bagianAktif, setBagianAktif] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [konfirmasi, setKonfirmasi] = useState(false);
  const [pelanggaran, setPelanggaran] = useState(0);
  const [showPeringatan, setShowPeringatan] = useState(false);
  const [pesanPeringatan, setPesanPeringatan] = useState("");
  const [didiskualifikasi, setDidiskualifikasi] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timerRef = useRef(null);
  const submitDoneRef = useRef(false);
  const pelanggaranRef = useRef(0);
  const jawabanSesi1Ref = useRef({});
  const jawabanSesi2Ref = useRef({});
  const waktuRef = useRef(DURATION_SESI);
  const identitasRef = useRef(identitas);
  const tahapRef = useRef(tahap);

  useEffect(() => { jawabanSesi1Ref.current = jawabanSesi1; }, [jawabanSesi1]);
  useEffect(() => { jawabanSesi2Ref.current = jawabanSesi2; }, [jawabanSesi2]);
  useEffect(() => { waktuRef.current = waktu; }, [waktu]);
  useEffect(() => { identitasRef.current = identitas; }, [identitas]);
  useEffect(() => { tahapRef.current = tahap; }, [tahap]);

  // ── Kirim Sesi 1 ke Google Sheet ──
  const kirimSesi1 = useCallback(async (alasan = "Normal") => {
    if (submitDoneRef.current) return;
    submitDoneRef.current = true;
    clearInterval(timerRef.current);
    setLoading(true);
    const skor = hitungSkor(SOAL_TPB, jawabanSesi1Ref.current);
    const skorBagian = hitungSkorPerBagian(SOAL_TPB, jawabanSesi1Ref.current);
    const id = identitasRef.current;
    const payload = {
      sesi: "TPB - Tes Potensi Belajar",
      nama: id.nama, kelas: id.kelas, nis: id.nis, sekolah: id.sekolah,
      waktuSelesai: new Date().toLocaleString("id-ID"),
      sisaWaktu: formatWaktu(waktuRef.current),
      // Skor total (exclude minat bakat)
      skorBenar: skor.benar, skorTotal: skor.total, persenSkor: skor.persen,
      // Skor per sub-bagian
      verbal_benar: skorBagian["Kemampuan Verbal"]?.benar ?? "-",
      verbal_total: skorBagian["Kemampuan Verbal"]?.total ?? 0,
      verbal_persen: skorBagian["Kemampuan Verbal"]?.persen ?? "-",
      numerik_benar: skorBagian["Kemampuan Numerik"]?.benar ?? "-",
      numerik_total: skorBagian["Kemampuan Numerik"]?.total ?? 0,
      numerik_persen: skorBagian["Kemampuan Numerik"]?.persen ?? "-",
      logis_benar: skorBagian["Penalaran Logis"]?.benar ?? "-",
      logis_total: skorBagian["Penalaran Logis"]?.total ?? 0,
      logis_persen: skorBagian["Penalaran Logis"]?.persen ?? "-",
      // Kepribadian (tidak dinilai, simpan jawaban mentah)
      kepribadian_dijawab: skorBagian["Kepribadian & Minat Bakat"]?.dijawab ?? 0,
      kepribadian_total: skorBagian["Kepribadian & Minat Bakat"]?.total ?? 0,
      kepribadian_jawaban: SOAL_TPB.filter(s => s.bagian === "Kepribadian & Minat Bakat")
        .map(s => jawabanSesi1Ref.current[SOAL_TPB.indexOf(s)] || "-").join("|"),
      // Minat Bakat 40 soal (tidak dinilai, hitung profil dominan di Apps Script)
      minat_dijawab: skorBagian["Minat Bakat"]?.dijawab ?? 0,
      minat_total: skorBagian["Minat Bakat"]?.total ?? 0,
      minat_jawaban: SOAL_TPB.filter(s => s.bagian === "Minat Bakat")
        .map(s => jawabanSesi1Ref.current[SOAL_TPB.indexOf(s)] || "-").join("|"),
      // Jawaban per bagian (raw)
      jawaban_verbal: SOAL_TPB.filter(s => s.bagian === "Kemampuan Verbal")
        .map(s => jawabanSesi1Ref.current[SOAL_TPB.indexOf(s)] || "-").join("|"),
      jawaban_numerik: SOAL_TPB.filter(s => s.bagian === "Kemampuan Numerik")
        .map(s => jawabanSesi1Ref.current[SOAL_TPB.indexOf(s)] || "-").join("|"),
      jawaban_logis: SOAL_TPB.filter(s => s.bagian === "Penalaran Logis")
        .map(s => jawabanSesi1Ref.current[SOAL_TPB.indexOf(s)] || "-").join("|"),
      semua_jawaban: SOAL_TPB.map((s, i) => jawabanSesi1Ref.current[i] || "-").join("|"),
      keterangan: alasan,
    };
    try {
      const params = new URLSearchParams();
      Object.entries(payload).forEach(([k, v]) => params.append(k, v ?? ""));
      await fetch(GOOGLE_SCRIPT_URL_TPB + "?" + params.toString(), { method: "GET", mode: "no-cors" });
    } catch (_) {}
    setLoading(false);
    // Langsung lanjut ke Sesi 2 tanpa halaman perantara
    submitDoneRef.current = false;
    pelanggaranRef.current = 0;
    setPelanggaran(0);
    setWaktu(DURATION_SESI);
    setBagianAktif(0);
    setSesiAktif(2);
    document.documentElement.requestFullscreen().catch(() => {});
    setTahap("pengerjaanSesi2");
  }, []);

  // ── Kirim Sesi 2 ke Google Sheet ──
  const kirimSesi2 = useCallback(async (alasan = "Normal") => {
    if (submitDoneRef.current) return;
    submitDoneRef.current = true;
    clearInterval(timerRef.current);
    setLoading(true);
    const skor = hitungSkor(SOAL_TPA, jawabanSesi2Ref.current);
    const skorBagian = hitungSkorPerBagian(SOAL_TPA, jawabanSesi2Ref.current);
    const id = identitasRef.current;
    const payload = {
      sesi: "TPA - Tes Potensi Akademik",
      nama: id.nama, kelas: id.kelas, nis: id.nis, sekolah: id.sekolah,
      waktuSelesai: new Date().toLocaleString("id-ID"),
      sisaWaktu: formatWaktu(waktuRef.current),
      skorBenar: skor.benar, skorTotal: skor.total, persenSkor: skor.persen,
      // Skor per sub-bagian TPA
      matika_benar: skorBagian["Penalaran Matematika"]?.benar ?? "-",
      matika_total: skorBagian["Penalaran Matematika"]?.total ?? 0,
      matika_persen: skorBagian["Penalaran Matematika"]?.persen ?? "-",
      keislaman_benar: skorBagian["Literasi Keislaman"]?.benar ?? "-",
      keislaman_total: skorBagian["Literasi Keislaman"]?.total ?? 0,
      keislaman_persen: skorBagian["Literasi Keislaman"]?.persen ?? "-",
      membaca_benar: skorBagian["Literasi Membaca"]?.benar ?? "-",
      membaca_total: skorBagian["Literasi Membaca"]?.total ?? 0,
      membaca_persen: skorBagian["Literasi Membaca"]?.persen ?? "-",
      jawaban: SOAL_TPA.map((s, i) => jawabanSesi2Ref.current[i] || "-").join("|"),
      keterangan: alasan,
      jumlahPelanggaran: pelanggaranRef.current,
    };
    try {
      const params = new URLSearchParams();
      Object.entries(payload).forEach(([k, v]) => params.append(k, v ?? ""));
      await fetch(GOOGLE_SCRIPT_URL_TPA + "?" + params.toString(), { method: "GET", mode: "no-cors" });
    } catch (_) {}
    localStorage.setItem(`ujian_submitted_${id.nis}`, JSON.stringify({ nama: id.nama, waktu: new Date().toLocaleString("id-ID") }));
    setHasilSesi2({ ...skor, perBagian: skorBagian });
    setLoading(false);
    setTahap("skorSesi2");
  }, []);

  // ── Timer countdown ──
  useEffect(() => {
    const sedangUjian = tahap === "pengerjaan" || tahap === "pengerjaanSesi2";
    if (!sedangUjian) return;
    timerRef.current = setInterval(() => {
      setWaktu((w) => {
        if (w <= 1) {
          clearInterval(timerRef.current);
          if (tahapRef.current === "pengerjaan") kirimSesi1("Waktu habis");
          else kirimSesi2("Waktu habis");
          return 0;
        }
        return w - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [tahap, kirimSesi1, kirimSesi2]);

  // ── Anti-cheat Lengkap ──
  useEffect(() => {
    const sedangUjian = tahap === "pengerjaan" || tahap === "pengerjaanSesi2";
    if (!sedangUjian) return;

    // Helper: catat pelanggaran dan diskualifikasi jika melebihi batas
    const catatPelanggaran = (jenis) => {
      pelanggaranRef.current += 1;
      const jumlah = pelanggaranRef.current;
      setPelanggaran(jumlah);
      if (jumlah >= MAX_PELANGGARAN) {
        setDidiskualifikasi(true);
        setShowPeringatan(false);
        if (tahapRef.current === "pengerjaan") kirimSesi1(`Diskualifikasi - ${jenis} ${jumlah}x`);
        else kirimSesi2(`Diskualifikasi - ${jenis} ${jumlah}x`);
      } else {
        setPesanPeringatan(
          `⚠️ Terdeteksi: ${jenis}\n\nIni adalah pelanggaran ke-${jumlah} dari ${MAX_PELANGGARAN}.\nJika mencapai ${MAX_PELANGGARAN}x, jawaban otomatis dikumpulkan dan kamu DISKUALIFIKASI.`
        );
        setShowPeringatan(true);
      }
    };

    // 1. Deteksi pindah tab / minimize (visibilitychange)
    const tangkapPindahTab = () => {
      if (!document.hidden) return;
      catatPelanggaran("pindah tab/minimize");
    };

    // 2. Deteksi window blur (pindah aplikasi / klik luar browser)
    const tangkapBlur = () => {
      // Hanya catat jika dokumen benar-benar tidak aktif
      setTimeout(() => {
        if (document.hidden) return; // sudah ditangkap visibilitychange
        catatPelanggaran("pindah jendela");
      }, 300);
    };

    // 3. Blokir klik kanan
    const blokKanan = (e) => e.preventDefault();

    // 4. Blokir shortcut keyboard
    const blokKeyboard = (e) => {
      const k = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      // F12, F5 (reload), F11 (fullscreen toggle)
      if (["f12", "f5"].includes(k)) { e.preventDefault(); e.stopPropagation(); return; }
      // Ctrl+U (view source), Ctrl+S (save), Ctrl+P (print)
      if (ctrl && ["u", "s", "p"].includes(k)) { e.preventDefault(); e.stopPropagation(); return; }
      // Ctrl+Shift+I/J/C/K (DevTools), Ctrl+Shift+U (Linux view source)
      if (ctrl && shift && ["i", "j", "c", "k", "u"].includes(k)) { e.preventDefault(); e.stopPropagation(); return; }
      // Ctrl+A (select all), Ctrl+C (copy), Ctrl+X (cut), Ctrl+V (paste)
      if (ctrl && ["a", "c", "x", "v"].includes(k)) { e.preventDefault(); e.stopPropagation(); return; }
      // Alt+Tab (Windows switch window)
      if (e.altKey && k === "tab") { e.preventDefault(); e.stopPropagation(); return; }
      // Print Screen
      if (k === "printscreen" || k === "sysrq") { e.preventDefault(); e.stopPropagation(); return; }
      // Windows key
      if (k === "meta" || k === "os") { e.preventDefault(); e.stopPropagation(); return; }
    };

    // 5. Blokir copy, cut, paste di semua elemen
    const blokClipboard = (e) => e.preventDefault();

    // 6. Blokir drag (untuk mencegah drag teks)
    const blokDrag = (e) => e.preventDefault();

    // 7. Blokir select all via mouse
    const blokSelectStart = (e) => {
      // Izinkan select pada input/textarea agar bisa mengisi form identitas
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      e.preventDefault();
    };

    // Daftarkan semua event listener
    document.addEventListener("visibilitychange", tangkapPindahTab);
    window.addEventListener("blur", tangkapBlur);
    document.addEventListener("contextmenu", blokKanan);
    document.addEventListener("keydown", blokKeyboard, true);
    document.addEventListener("copy", blokClipboard);
    document.addEventListener("cut", blokClipboard);
    document.addEventListener("paste", blokClipboard);
    document.addEventListener("drag", blokDrag);
    document.addEventListener("dragstart", blokDrag);
    document.addEventListener("selectstart", blokSelectStart);

    return () => {
      document.removeEventListener("visibilitychange", tangkapPindahTab);
      window.removeEventListener("blur", tangkapBlur);
      document.removeEventListener("contextmenu", blokKanan);
      document.removeEventListener("keydown", blokKeyboard, true);
      document.removeEventListener("copy", blokClipboard);
      document.removeEventListener("cut", blokClipboard);
      document.removeEventListener("paste", blokClipboard);
      document.removeEventListener("drag", blokDrag);
      document.removeEventListener("dragstart", blokDrag);
      document.removeEventListener("selectstart", blokSelectStart);
    };
  }, [tahap, kirimSesi1, kirimSesi2]);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const masukFullscreen = () => { document.documentElement.requestFullscreen().catch(() => {}); };

  const mulaiUjian = () => {
    if (!identitas.nama.trim() || !identitas.kelas.trim() || !identitas.nis.trim() || !identitas.sekolah.trim()) { setError("Semua field wajib diisi!"); return; }
    const sudah = localStorage.getItem(`ujian_submitted_${identitas.nis}`);
    if (sudah) { setTahap("sudahSubmit"); return; }
    setError("");
    document.documentElement.requestFullscreen().catch(() => {});
    submitDoneRef.current = false;
    pelanggaranRef.current = 0;
    setWaktu(DURATION_SESI);
    setBagianAktif(0);
    setSesiAktif(1);
    setTahap("pengerjaan");
  };

  const lanjutSesi2 = () => {
    submitDoneRef.current = false;
    pelanggaranRef.current = 0;
    setPelanggaran(0);
    setWaktu(DURATION_SESI);
    setBagianAktif(0);
    setSesiAktif(2);
    document.documentElement.requestFullscreen().catch(() => {});
    setTahap("pengerjaanSesi2");
  };

  const SOAL_AKTIF = sesiAktif === 1 ? SOAL_TPB : SOAL_TPA;
  const BAGIAN_LIST_AKTIF = sesiAktif === 1 ? BAGIAN_LIST_TPB : BAGIAN_LIST_TPA;
  const JAWABAN_AKTIF = sesiAktif === 1 ? jawabanSesi1 : jawabanSesi2;
  const SET_JAWABAN = sesiAktif === 1 ? setJawabanSesi1 : setJawabanSesi2;
  const KIRIM_AKTIF = sesiAktif === 1 ? kirimSesi1 : kirimSesi2;
  const NAMA_SESI = sesiAktif === 1 ? "Tes Potensi Belajar" : "Tes Potensi Akademik";

  const soalBagian = SOAL_AKTIF
    .map((s, i) => ({ ...s, globalIdx: i }))
    .filter((s) => s.bagian === BAGIAN_LIST_AKTIF[bagianAktif]);

  const totalDijawab = Object.keys(JAWABAN_AKTIF).length;
  const warnaTimer = waktu <= 300 ? "#e74c3c" : waktu <= 600 ? "#f39c12" : "#27ae60";
  const persen = waktu / DURATION_SESI;

  const S = {
    card: { background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", padding: "32px 28px", maxWidth: 420, width: "100%", margin: "0 auto" },
    label: { display: "block", fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 6 },
    input: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e0e0e0", fontSize: 15, outline: "none", boxSizing: "border-box" },
    btnPrimary: { width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: "linear-gradient(90deg,#2980b9,#6dd5fa)", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" },
    btnSec: { padding: "10px 22px", borderRadius: 10, border: "1.5px solid #2980b9", background: "#fff", color: "#2980b9", fontSize: 14, fontWeight: 600, cursor: "pointer" },
    errorBox: { background: "#fdecea", color: "#b71c1c", borderRadius: 8, padding: "10px 14px", marginBottom: 12, fontSize: 13 },
    muted: { fontSize: 13, color: "#888", margin: 0 },
  };

  // ── RENDER: Halaman Login ──
  if (tahap === "identitas")
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={S.card}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📝</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "8px 0 4px" }}>Ujian Online</h1>
            <p style={S.muted}>2 Sesi • 120 Menit Total</p>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 8 }}>
              <span style={{ background: "#e8f4fd", color: "#2980b9", borderRadius: 8, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>Sesi 1: TPB • 60 menit</span>
              <span style={{ background: "#eafaf1", color: "#27ae60", borderRadius: 8, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>Sesi 2: TPA • 60 menit</span>
            </div>
          </div>
          {["nama", "kelas", "nis", "sekolah"].map((field) => (
            <div key={field} style={{ marginBottom: 16 }}>
              <label style={S.label}>{field === "nis" ? "NIS" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input style={S.input} placeholder={`Masukkan ${field === "nis" ? "NIS" : field}...`} value={identitas[field]} onChange={(e) => setIdentitas((p) => ({ ...p, [field]: e.target.value }))} />
            </div>
          ))}
          {error && <div style={S.errorBox}>{error}</div>}
          <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 10, padding: "12px 16px", marginBottom: 10, fontSize: 13, color: "#795548" }}>
            ⚠️ Setiap NIS hanya dapat submit <strong>satu kali</strong>.
          </div>
          <div style={{ background: "#fdecea", border: "1px solid #ffcdd2", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#b71c1c", lineHeight: 1.6 }}>
            🔒 Ujian berjalan dalam <strong>mode layar penuh</strong>.<br />
            ❌ Dilarang: pindah tab, pindah aplikasi, minimize, klik kanan.<br />
            ❌ Dilarang: copy, cut, paste, drag teks, Print Screen.<br />
            ❌ Dilarang: Ctrl+C/V/A/U/S/P, F12, DevTools.<br />
            Pelanggaran <strong>{MAX_PELANGGARAN}x</strong> → jawaban otomatis dikumpulkan & DISKUALIFIKASI.
          </div>
          <button style={S.btnPrimary} onClick={mulaiUjian}>Mulai Ujian (Layar Penuh) →</button>
        </div>
      </div>
    );

  // ── RENDER: Sudah Submit ──
  if (tahap === "sudahSubmit")
    return (
      <div style={{ minHeight: "100vh", background: "#f0f2f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚫</div>
          <h2 style={{ color: "#e74c3c" }}>NIS Sudah Digunakan</h2>
          <p style={{ color: "#666" }}>NIS <strong>{identitas.nis}</strong> sudah pernah mengumpulkan jawaban. Setiap NIS hanya dapat mengikuti ujian satu kali.</p>
        </div>
      </div>
    );

  // ── RENDER: Selesai Total (tanpa tampilkan skor) ──
  if (tahap === "skorSesi2")
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#1a1a2e,#16213e)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ ...S.card, textAlign: "center", maxWidth: 420 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ color: "#f39c12", fontSize: 24, marginBottom: 8 }}>Ujian Selesai!</h2>
          <p style={{ color: "#444", fontSize: 15, marginBottom: 4 }}>
            Terima kasih, <strong>{identitas.nama}</strong>.
          </p>
          <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>
            Seluruh jawaban kamu sudah berhasil dikirim ke panitia.
          </p>
          <div style={{ background: "#f8f9fa", borderRadius: 12, padding: "16px 20px", marginBottom: 24, textAlign: "left", fontSize: 13, color: "#555", lineHeight: 1.7 }}>
            <div style={{ marginBottom: 6 }}>📋 <strong>Nama:</strong> {identitas.nama}</div>
            <div style={{ marginBottom: 6 }}>🏫 <strong>Kelas:</strong> {identitas.kelas}</div>
            <div style={{ marginBottom: 6 }}>🆔 <strong>NIS:</strong> {identitas.nis}</div>
            <div>⏰ <strong>Waktu selesai:</strong> {new Date().toLocaleString("id-ID")}</div>
          </div>
          <div style={{ background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 12, padding: "14px 16px", fontSize: 13, color: "#795548" }}>
            📢 Hasil ujian akan diumumkan oleh panitia pada waktu yang telah ditentukan.
          </div>
        </div>
      </div>
    );

  // ── RENDER: Pengerjaan (Sesi 1 atau 2) ──
  const sedangUjian = tahap === "pengerjaan" || tahap === "pengerjaanSesi2";
  if (!sedangUjian) return null;

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", minHeight: "100vh", background: "#f0f2f5", userSelect: "none", WebkitUserSelect: "none" }}>
      {/* Modal Peringatan */}
      {showPeringatan && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 380, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
            <h3 style={{ color: "#e74c3c", marginBottom: 12 }}>Peringatan!</h3>
            <p style={{ fontSize: 14, color: "#333", whiteSpace: "pre-line", marginBottom: 20 }}>{pesanPeringatan}</p>
            <button style={{ ...S.btnPrimary, background: "#e74c3c" }} onClick={() => { setShowPeringatan(false); masukFullscreen(); }}>Kembali ke Ujian</button>
          </div>
        </div>
      )}
      {/* Modal Konfirmasi Submit */}
      {konfirmasi && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, maxWidth: 360, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📤</div>
            <h3 style={{ marginBottom: 8 }}>Kumpulkan Jawaban?</h3>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>Sesi {sesiAktif}: <strong>{NAMA_SESI}</strong></p>
            <p style={{ fontSize: 14, color: "#555", marginBottom: 20 }}>Sudah dijawab: <strong>{totalDijawab}/{SOAL_AKTIF.length}</strong> soal.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ ...S.btnSec, flex: 1 }} onClick={() => setKonfirmasi(false)}>Batal</button>
              <button style={{ ...S.btnPrimary, flex: 1 }} onClick={() => { setKonfirmasi(false); KIRIM_AKTIF(); }}>
                {loading ? "Mengirim..." : "Ya, Kumpulkan"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Diskualifikasi */}
      {didiskualifikasi && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 32, maxWidth: 380, width: "90%", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚫</div>
            <h2 style={{ color: "#e74c3c" }}>DISKUALIFIKASI</h2>
            <p style={{ color: "#666" }}>Kamu terdeteksi meninggalkan halaman ujian sebanyak {MAX_PELANGGARAN}x. Jawaban telah otomatis dikumpulkan.</p>
          </div>
        </div>
      )}
      {/* Header */}
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "#1a1a2e", color: "#fff", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>Sesi {sesiAktif}/2 — {NAMA_SESI}</div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>{identitas.nama} • {identitas.kelas}</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: warnaTimer, letterSpacing: 2, fontVariantNumeric: "tabular-nums" }}>{formatWaktu(waktu)}</div>
          <div style={{ height: 4, width: 110, background: "#333", borderRadius: 4, marginTop: 4, margin: "4px auto 0" }}>
            <div style={{ height: "100%", width: `${persen * 100}%`, background: warnaTimer, borderRadius: 4, transition: "width 1s linear, background 0.5s" }} />
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Dijawab</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{totalDijawab}/{SOAL_AKTIF.length}</div>
          {pelanggaran > 0 && <div style={{ fontSize: 11, color: "#e74c3c", fontWeight: 700 }}>⚠️ {pelanggaran}/{MAX_PELANGGARAN}</div>}
        </div>
      </div>
      {/* Banner indikator sesi */}
      <div style={{ background: sesiAktif === 1 ? "#2980b9" : "#27ae60", color: "#fff", textAlign: "center", padding: "6px", fontSize: 12, fontWeight: 700 }}>
        SESI {sesiAktif}: {NAMA_SESI.toUpperCase()}
      </div>
      {!isFullscreen && !showPeringatan && !didiskualifikasi && (
        <div style={{ background: "#e74c3c", color: "#fff", textAlign: "center", padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>
          ⚠️ Kamu keluar dari mode layar penuh!{" "}
          <span onClick={masukFullscreen} style={{ textDecoration: "underline", cursor: "pointer", fontWeight: 800 }}>Klik di sini untuk kembali</span>
        </div>
      )}
      {/* Tab Bagian */}
      <div style={{ display: "flex", gap: 6, padding: "14px 16px 0", overflowX: "auto" }}>
        {BAGIAN_LIST_AKTIF.map((b, i) => {
          const soalB = SOAL_AKTIF.filter((s) => s.bagian === b);
          const dijawabB = soalB.filter((s, idx) => JAWABAN_AKTIF[SOAL_AKTIF.findIndex((x) => x === s)] !== undefined).length;
          const aktif = bagianAktif === i;
          return (
            <button key={b} onClick={() => setBagianAktif(i)} style={{ padding: "8px 14px", borderRadius: 10, border: aktif ? "2px solid #1a1a2e" : "1.5px solid #ddd", background: aktif ? "#1a1a2e" : "#fff", color: aktif ? "#fff" : "#333", fontWeight: aktif ? 700 : 400, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              {b} ({dijawabB}/{soalB.length})
            </button>
          );
        })}
      </div>
      {/* Soal */}
      <div style={{ padding: "12px 16px", maxWidth: 720, margin: "0 auto" }}>
        {soalBagian.map(({ globalIdx, ...s }) => {
          const dipilih = JAWABAN_AKTIF[globalIdx];
          const warna = WARNA_BAGIAN[s.bagian] || { bg: "#f5f5f5", accent: "#333", light: "#eee" };
          return (
            <div key={globalIdx} style={{ background: "#fff", borderRadius: 14, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1.5px solid ${dipilih ? warna.accent : "#e8e8e8"}`, overflow: "hidden" }}>
              <div style={{ background: warna.bg, padding: "12px 18px", borderBottom: `1px solid ${warna.light}`, display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ background: warna.accent, color: "#fff", borderRadius: 8, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>No. {s.nomor}</span>
                <span style={{ fontSize: 12, color: warna.accent, fontWeight: 600 }}>{s.bagian}</span>
                {dipilih && (
                  <span style={{ marginLeft: "auto", fontSize: 12, color: warna.accent }}>
                    {BAGIAN_TANPA_KUNCI.includes(s.bagian) ? "✓ Dipilih" : "✓ Dijawab"}
                  </span>
                )}
                {BAGIAN_TANPA_KUNCI.includes(s.bagian) && (
                  <span style={{ marginLeft: dipilih ? 4 : "auto", fontSize: 11, background: "#f3e5f5", color: "#8e44ad", borderRadius: 6, padding: "1px 8px" }}>Tidak dinilai</span>
                )}
              </div>
              <div style={{ padding: "16px 18px" }}>
                <p style={{ fontSize: 15, color: "#222", lineHeight: 1.7, marginBottom: 14 }}>{s.soal}</p>
                {s.gambar && <img src={s.gambar} alt={`Gambar soal ${s.nomor}`} style={{ width: "100%", maxWidth: 500, borderRadius: 8, marginBottom: 14, border: "1px solid #e0e0e0", display: "block" }} />}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.pilihan.map((p) => {
                    const hrf = p.charAt(0);
                    const terpilih = dipilih === hrf;
                    return (
                      <button key={p} onClick={() => SET_JAWABAN((prev) => ({ ...prev, [globalIdx]: hrf }))} style={{ textAlign: "left", padding: "10px 14px", borderRadius: 10, border: terpilih ? `2px solid ${warna.accent}` : "1.5px solid #e0e0e0", background: terpilih ? warna.bg : "#fafafa", cursor: "pointer", fontSize: 14, color: terpilih ? warna.accent : "#333", fontWeight: terpilih ? 600 : 400, transition: "all 0.15s" }}>
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
        <div style={{ display: "flex", gap: 10, marginTop: 8, marginBottom: 32 }}>
          {bagianAktif > 0 && <button onClick={() => setBagianAktif((p) => p - 1)} style={S.btnSec}>← Sebelumnya</button>}
          {bagianAktif < BAGIAN_LIST_AKTIF.length - 1
            ? <button onClick={() => setBagianAktif((p) => p + 1)} style={{ ...S.btnPrimary, flex: 1 }}>Bagian Berikutnya →</button>
            : <button onClick={() => setKonfirmasi(true)} style={{ ...S.btnPrimary, flex: 1, background: sesiAktif === 1 ? "linear-gradient(90deg,#27ae60,#2ecc71)" : "linear-gradient(90deg,#e74c3c,#c0392b)" }}>
                {sesiAktif === 1 ? "✅ Selesai Sesi 1 & Lihat Skor" : "📤 Kumpulkan Jawaban Sesi 2"}
              </button>
          }
        </div>
      </div>
    </div>
  );
}
