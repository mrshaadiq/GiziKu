<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Skrining Kesehatan Mental - {{ $scan->nama_pasien }}</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #334155;
            font-size: 11pt;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .header {
            border-bottom: 2px solid #0f766e;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .logo-title {
            font-size: 20pt;
            font-weight: bold;
            color: #0f766e;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .subtitle {
            font-size: 9pt;
            color: #64748b;
            margin-top: 4px;
        }
        .report-title {
            text-align: center;
            font-size: 16pt;
            font-weight: 800;
            margin-top: 15px;
            margin-bottom: 25px;
            color: #1e293b;
            text-transform: uppercase;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
        }
        .meta-table td {
            padding: 10px 12px;
            font-size: 9.5pt;
            border-bottom: 1px solid #e2e8f0;
        }
        .meta-label {
            font-weight: bold;
            color: #475569;
            width: 25%;
        }
        .meta-val {
            color: #1e293b;
        }
        .section-title {
            font-size: 11pt;
            font-weight: bold;
            color: #0f766e;
            border-left: 4px solid #0f766e;
            padding-left: 8px;
            margin-top: 25px;
            margin-bottom: 10px;
            text-transform: uppercase;
        }
        .summary-box {
            background-color: #f0fdfa;
            border: 1px solid #ccfbf1;
            border-radius: 6px;
            padding: 15px;
            font-size: 10pt;
            color: #115e59;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .risk-badge {
            display: inline-block;
            padding: 3px 10px;
            font-size: 8pt;
            font-weight: bold;
            color: white;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .risk-rendah { background-color: #10b981; }
        .risk-sedang { background-color: #eab308; color: #1e293b; }
        .risk-tinggi { background-color: #ef4444; }

        .grid-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .grid-table th {
            background-color: #e2e8f0;
            color: #334155;
            text-align: left;
            padding: 8px 10px;
            font-size: 9pt;
            font-weight: bold;
            border: 1px solid #cbd5e1;
        }
        .grid-table td {
            padding: 10px;
            font-size: 9pt;
            border: 1px solid #cbd5e1;
            vertical-align: top;
        }
        .bullet-list {
            margin: 0;
            padding-left: 15px;
        }
        .bullet-list li {
            margin-bottom: 6px;
            font-size: 9pt;
        }
        .warning-box {
            background-color: #fef2f2;
            border: 1px solid #fee2e2;
            border-radius: 6px;
            padding: 15px;
            font-size: 9.5pt;
            color: #991b1b;
            margin-top: 20px;
        }
        .footer {
            margin-top: 40px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
            font-size: 8pt;
            color: #94a3b8;
            text-align: center;
            line-height: 1.4;
        }
        .stamp-block {
            margin-top: 30px;
            float: right;
            text-align: center;
            width: 200px;
        }
        .stamp-title {
            font-size: 8pt;
            color: #64748b;
            margin-bottom: 5px;
        }
        .stamp-box {
            border: 2px dashed #0f766e;
            color: #0f766e;
            font-size: 10pt;
            font-weight: bold;
            padding: 8px;
            border-radius: 4px;
            text-transform: uppercase;
        }
        .clear {
            clear: both;
        }
    </style>
</head>
<body>

    <!-- Header Block -->
    <div class="header">
        <span class="logo-title">GiziKu AI</span>
        <div class="subtitle">Platform Kecerdasan Buatan Terintegrasi Kesehatan Anak & Keluarga</div>
    </div>

    <!-- Title -->
    <div class="report-title">Hasil Pemeriksaan Kesehatan Mental</div>

    <!-- Patient Metadata Table -->
    <table class="meta-table">
        <tr>
            <td class="meta-label">Nama Pasien:</td>
            <td class="meta-val">{{ $scan->nama_pasien }}</td>
            <td class="meta-label">Tanggal Pemeriksaan:</td>
            <td class="meta-val">{{ $scan->created_at->format('d M Y H:i') }} WIB</td>
        </tr>
        <tr>
            <td class="meta-label">Umur Pasien:</td>
            <td class="meta-val">
                @if($scan->tanggal_lahir)
                    @php
                        $birth = \Carbon\Carbon::parse($scan->tanggal_lahir);
                        $now = \Carbon\Carbon::parse($scan->created_at);
                        $years = $birth->diffInYears($now);
                        $months = $birth->diffInMonths($now) % 12;
                        $ageString = "";
                        if ($years > 0) $ageString .= $years . " Tahun ";
                        if ($months > 0 || $years === 0) $ageString .= $months . " Bulan";
                    @endphp
                    {{ $ageString }} (Lahir: {{ $birth->format('d M Y') }})
                @else
                    {{ $scan->usia_pasien }} Tahun
                @endif
            </td>
            <td class="meta-label">Jenis Kelamin:</td>
            <td class="meta-val">{{ $scan->jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan' }}</td>
        </tr>
        <tr>
            <td class="meta-label">Tingkat Risiko:</td>
            <td class="meta-val" colspan="3">
                <span class="risk-badge risk-{{ strtolower($scan->level_risiko ?: 'sedang') }}">
                    {{ $scan->level_risiko ?: 'Sedang' }}
                </span>
            </td>
        </tr>
    </table>

    <!-- Ringkasan Klinis -->
    <div class="section-title">Ringkasan Analisis Gabungan</div>
    <div class="summary-box">
        {{ $laporan['ringkasan_pengguna'] ?? $laporan['ringkasan_orang_tua'] ?? $scan->analisis_gabungan }}
    </div>

    <!-- Hasil Kondisi Mental -->
    <div class="section-title">Kondisi Mental Terindikasi</div>
    <table class="grid-table">
        <thead>
            <tr>
                <th style="width: 30%;">Kondisi</th>
                <th style="width: 50%;">Penjelasan Gejala</th>
                <th style="width: 20%;">Keyakinan AI</th>
            </tr>
        </thead>
        <tbody>
            @if(!empty($laporan['kondisi_mental_utama']))
                @foreach($laporan['kondisi_mental_utama'] as $kondisi)
                    <tr>
                        <td style="font-weight: bold; text-transform: capitalize;">{{ $kondisi['kondisi'] }}</td>
                        <td>{{ $kondisi['penjelasan'] }}</td>
                        <td style="text-transform: uppercase; font-weight: bold; color: #475569;">{{ $kondisi['keyakinan'] }}</td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="3" style="text-align: center; color: #64748b;">Tidak ada indikasi kondisi spesifik terdeteksi.</td>
                </tr>
            @endif
        </tbody>
    </table>

    <!-- Indikator Fisik Visual -->
    <div class="section-title">Korelasi Indikator Fisik Visual</div>
    <table class="grid-table">
        <thead>
            <tr>
                <th style="width: 30%;">Gejala Fisik</th>
                <th style="width: 20%;">Area Terkait</th>
                <th style="width: 50%;">Kesimpulan Korelatif</th>
            </tr>
        </thead>
        <tbody>
            @if(!empty($laporan['korelasi_antar_area']))
                @foreach($laporan['korelasi_antar_area'] as $korelasi)
                    <tr>
                        <td style="font-weight: bold;">{{ $korelasi['temuan'] }}</td>
                        <td style="text-transform: capitalize;">{{ implode(', ', $korelasi['area_terlibat'] ?? []) }}</td>
                        <td>{{ $korelasi['kesimpulan'] }}</td>
                    </tr>
                @endforeach
            @else
                <tr>
                    <td colspan="3" style="text-align: center; color: #64748b;">Tidak ada korelasi visual terdeteksi.</td>
                </tr>
            @endif
        </tbody>
    </table>

    <!-- Rekomendasi Mandiri -->
    <div class="section-title">Rekomendasi Tindakan & Relaksasi Mandiri</div>
    <table class="grid-table">
        <thead>
            <tr>
                <th style="width: 50%;">Metode Tindakan / Terapi Mandiri</th>
                <th style="width: 50%;">Teknik Relaksasi & Mindfulness</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    <ul class="bullet-list">
                        @if(!empty($laporan['rekomendasi_tindakan']))
                            @foreach($laporan['rekomendasi_tindakan'] as $rec)
                                <li>
                                    <strong>{{ $rec['tindakan'] }}</strong> ({{ $rec['prioritas'] }})<br>
                                    <span style="color: #475569; font-size: 8.5pt;">{{ $rec['deskripsi'] }} (Frekuensi: {{ $rec['frekuensi'] }})</span>
                                </li>
                            @endforeach
                        @else
                            <li>Lakukan manajemen stres harian dengan istirahat teratur.</li>
                        @endif
                    </ul>
                </td>
                <td>
                    <ul class="bullet-list">
                        @if(!empty($laporan['rekomendasi_relaksasi']))
                            @foreach($laporan['rekomendasi_relaksasi'] as $rel)
                                <li>
                                    <strong>{{ $rel['metode'] }}</strong><br>
                                    <span style="color: #475569; font-size: 8.5pt;">{{ $rel['alasan'] }}</span>
                                </li>
                            @endforeach
                        @else
                            <li>Latihan pernapasan dalam (Deep Breathing) 5-10 menit saat cemas muncul.</li>
                        @endif
                    </ul>
                </td>
            </tr>
        </tbody>
    </table>

    <!-- Warning / Rujukan Nakes -->
    @if(!empty($laporan['perlu_rujuk_nakes']))
        <div class="warning-box">
            <strong>Peringatan Penting:</strong> {{ $laporan['alasan_rujuk'] }}
        </div>
    @endif

    <!-- Stamp Block -->
    <div class="stamp-block">
        <div class="stamp-title">Laporan ini dibuat otomatis oleh</div>
        <div class="stamp-box">GiziKu AI Diagnostic</div>
    </div>
    
    <div class="clear"></div>

    <!-- Footer Disclaimer -->
    <div class="footer">
        <strong>PENTING:</strong> Laporan ini dihasilkan secara otomatis oleh sistem AI berbasis indikator visual dan keluhan klinis awal. Laporan ini merupakan alat skrining awal dan <u>tidak dapat menggantikan diagnosis medis formal</u> dari psikolog, psikiater, atau dokter spesialis. Jika Anda atau anak Anda mengalami keluhan kesehatan mental yang mengganggu aktivitas sehari-hari, harap segera hubungi profesional kesehatan profesional.
    </div>

</body>
</html>
