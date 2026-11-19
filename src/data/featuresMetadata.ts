import type { FeatureValue, PhishingFeatures } from '../types/phishing';

export type FeatureCategory =
  | 'Address Bar'
  | 'Abnormal Request'
  | 'HTML & JS'
  | 'Domain Features';

export interface FeatureMeta {
  key: keyof PhishingFeatures;
  category: FeatureCategory;
  desc: string;
  options: readonly FeatureValue[];
}

export const FEATURE_CATEGORIES: readonly FeatureCategory[] = [
  'Address Bar',
  'Abnormal Request',
  'HTML & JS',
  'Domain Features',
] as const;

export const FEATURES_METADATA: readonly FeatureMeta[] = [
  // 1. Address Bar (12 Fitur)
  { key: 'having_IP_Address', category: 'Address Bar', desc: 'URL memakai alamat IP langsung alih-alih nama domain.', options: [-1, 1] },
  { key: 'URL_Length', category: 'Address Bar', desc: 'Panjang total karakter string alamat URL.', options: [-1, 0, 1] },
  { key: 'Shortining_Service', category: 'Address Bar', desc: 'Penggunaan layanan pemendek URL (bit.ly, tinyurl).', options: [-1, 1] },
  { key: 'having_At_Symbol', category: 'Address Bar', desc: 'Keberadaan simbol "@" untuk mengaburkan alamat asli.', options: [-1, 1] },
  { key: 'double_slash_redirecting', category: 'Address Bar', desc: 'Pengalihan "//" tidak wajar setelah protokol.', options: [-1, 1] },
  { key: 'Prefix_Suffix', category: 'Address Bar', desc: 'Karakter tanda hubung "-" sebagai pemisah domain.', options: [-1, 1] },
  { key: 'having_Sub_Domain', category: 'Address Bar', desc: 'Kompleksitas dan jumlah titik subdomain bertingkat.', options: [-1, 0, 1] },
  { key: 'SSLfinal_State', category: 'Address Bar', desc: 'Keabsahan, umur, dan otoritas penerbit sertifikat SSL.', options: [-1, 0, 1] },
  { key: 'Domain_registeration_length', category: 'Address Bar', desc: 'Durasi masa aktif pendaftaran domain WHOIS.', options: [-1, 1] },
  { key: 'Favicon', category: 'Address Bar', desc: 'Ikon tab dimuat dari domain eksternal mencurigakan.', options: [-1, 1] },
  { key: 'port', category: 'Address Bar', desc: 'Akses port terbuka non-standar (selain 80/443).', options: [-1, 1] },
  { key: 'HTTPS_token', category: 'Address Bar', desc: 'Penyisipan kata "https" palsu di dalam nama domain.', options: [-1, 1] },

  // 2. Abnormal Request (6 Fitur)
  { key: 'Request_URL', category: 'Abnormal Request', desc: 'Persentase aset gambar/media dimuat dari luar domain.', options: [-1, 1] },
  { key: 'URL_of_Anchor', category: 'Abnormal Request', desc: 'Persentase tautan tag <a> mengarah ke luar situs.', options: [-1, 0, 1] },
  { key: 'Links_in_tags', category: 'Abnormal Request', desc: 'Tautan eksternal pada tag <meta>, <script>, <link>.', options: [-1, 0, 1] },
  { key: 'SFH', category: 'Abnormal Request', desc: 'Server Form Handler kosong, about:blank, atau lintas domain.', options: [-1, 0, 1] },
  { key: 'Submitting_to_email', category: 'Abnormal Request', desc: 'Pengiriman data form langsung via fungsi mailto:.', options: [-1, 1] },
  { key: 'Abnormal_URL', category: 'Abnormal Request', desc: 'Ketidaksesuaian host URL dengan identitas pemilik WHOIS.', options: [-1, 1] },

  // 3. HTML & JavaScript (5 Fitur)
  { key: 'Redirect', category: 'HTML & JS', desc: 'Jumlah lompatan pengalihan halaman otomatis.', options: [0, 1] },
  { key: 'on_mouseover', category: 'HTML & JS', desc: 'Manipulasi status bar palsu lewat event JavaScript.', options: [-1, 1] },
  { key: 'RightClick', category: 'HTML & JS', desc: 'Penonaktifan menu klik kanan untuk cegah inspeksi kode.', options: [-1, 1] },
  { key: 'popUpWidnow', category: 'HTML & JS', desc: 'Jendela pop-up meminta input kredensial sensitif.', options: [-1, 1] },
  { key: 'Iframe', category: 'HTML & JS', desc: 'Penggunaan tag <iframe> tersembunyi tanpa bingkai.', options: [-1, 1] },

  // 4. Domain Features (7 Fitur)
  { key: 'age_of_domain', category: 'Domain Features', desc: 'Usia domain sejak pertama kali didaftarkan (< 6 bulan).', options: [-1, 1] },
  { key: 'DNSRecord', category: 'Domain Features', desc: 'Ketersediaan catatan DNS valid pada server publik.', options: [-1, 1] },
  { key: 'web_traffic', category: 'Domain Features', desc: 'Peringkat trafik kunjungan situs (Alexa / Similarweb).', options: [-1, 0, 1] },
  { key: 'Page_Rank', category: 'Domain Features', desc: 'Skor otoritas halaman pada indeks mesin pencari.', options: [-1, 1] },
  { key: 'Google_Index', category: 'Domain Features', desc: 'Status apakah halaman terindeks resmi oleh Google.', options: [-1, 1] },
  { key: 'Links_pointing_to_page', category: 'Domain Features', desc: 'Jumlah tautan balik (backlinks) yang mengarah ke situs.', options: [-1, 0, 1] },
  { key: 'Statistical_report', category: 'Domain Features', desc: 'Tercatat dalam basis data blacklist PhishTank.', options: [-1, 1] },
];