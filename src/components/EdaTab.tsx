import React, { useEffect, useState } from 'react';
import type { EdaSummaryResponse } from '../types/phishing';
import { phishingService } from '../services/api';

export const EdaTab: React.FC = () => {
  const [eda, setEda] = useState<EdaSummaryResponse | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{
    row: string;
    col: string;
    val: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    phishingService
      .getEdaSummary()
      .then((res) => setEda(res))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !eda) {
    return (
      <div className="p-10 bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl shadow-[4px_4px_0px_#1C1917] text-center font-mono font-bold">
        Memuat ringkasan Exploratory Data Analysis...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top 3 KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917]">
          <span className="font-mono text-xs font-bold text-stone-500">TOTAL OBSERVASI</span>
          <div className="font-mono text-3xl font-black text-[#1C1917] mt-1">
            {eda.total_rows.toLocaleString()}
          </div>
          <p className="text-xs text-stone-600 mt-1 font-mono">
            Dataset Phising Website.csv
          </p>
        </div>

        <div className="bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917]">
          <span className="font-mono text-xs font-bold text-stone-500">FITUR PREDIKTIF</span>
          <div className="font-mono text-3xl font-black text-[#1C1917] mt-1">
            {eda.total_features} Atribut
          </div>
          <p className="text-xs text-stone-600 mt-1">
            4 Kategori Ekstraksi Struktural
          </p>
        </div>

        <div className="bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917]">
          <span className="font-mono text-xs font-bold text-stone-500">KELAS TARGET</span>
          <div className="font-mono text-3xl font-black text-[#1C1917] mt-1">
            {`{-1, 1}`}
          </div>
          <p className="text-xs text-stone-600 mt-1">
            Legitimate (-1) vs Phishing (1)
          </p>
        </div>
      </section>

      {/* 2-Column Split: Class Distribution & Key Features */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Class Distribution */}
        <div className="lg:col-span-5 bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917] flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-black text-[#1C1917]">Distribusi Kelas Target</h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Proporsi label pada keseluruhan {eda.total_rows.toLocaleString()} rekaman URL.
            </p>

            {/* Tactile Stacked Bar */}
            <div className="mt-5 w-full h-8 rounded-full border-2 border-[#1C1917] overflow-hidden flex font-mono text-xs font-black">
              <div
                style={{ width: `${eda.class_distribution.legitimate.percentage}%` }}
                className="bg-[#22C55E] text-[#1C1917] border-r-2 border-[#1C1917] flex items-center justify-center"
              >
                {eda.class_distribution.legitimate.percentage}%
              </div>
              <div
                style={{ width: `${eda.class_distribution.phishing.percentage}%` }}
                className="bg-[#EF4444] text-white flex items-center justify-center"
              >
                {eda.class_distribution.phishing.percentage}%
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="p-3.5 rounded-xl bg-[#DCFCE7] border-2 border-[#1C1917] flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-[#1C1917]">
                    Legitimate (Label: -1)
                  </div>
                  <div className="text-xs text-stone-700">Website sah / resmi</div>
                </div>
                <div className="font-mono text-lg font-black text-[#1C1917]">
                  {eda.class_distribution.legitimate.count.toLocaleString()}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FEE2E2] border-2 border-[#1C1917] flex items-center justify-between">
                <div>
                  <div className="text-xs font-black text-[#1C1917]">
                    Phishing (Label: 1)
                  </div>
                  <div className="text-xs text-stone-700">Website penipuan</div>
                </div>
                <div className="font-mono text-lg font-black text-[#1C1917]">
                  {eda.class_distribution.phishing.count.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t-2 border-[#1C1917]/15 text-xs font-mono text-stone-600">
            Rasio kelas seimbang ({eda.class_distribution.legitimate.percentage}% : {eda.class_distribution.phishing.percentage}%).
          </div>
        </div>

        {/* Key Features Distribution */}
        <div className="lg:col-span-7 bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <div>
              <h2 className="text-lg font-black text-[#1C1917]">
                Distribusi Fitur Paling Berpengaruh
              </h2>
              <p className="text-xs text-stone-600">
                Persentase nilai (-1, 0, 1) pada atribut kunci dataset.
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] font-bold">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-[#22C55E] border border-[#1C1917]" /> -1
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-[#FACC15] border border-[#1C1917]" /> 0
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-sm bg-[#EF4444] border border-[#1C1917]" /> 1
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {eda.key_features_stats.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-bold text-[#1C1917]">{item.name}</span>
                  <span className="text-stone-600 font-semibold">
                    -1: {item.neg}% {item.zero > 0 ? `| 0: ${item.zero}% ` : ''}| 1: {item.pos}%
                  </span>
                </div>
                <div className="w-full h-4 bg-[#F5F4EE] border-2 border-[#1C1917] rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${item.neg}%` }}
                    className="bg-[#22C55E] border-r border-[#1C1917]"
                  />
                  {item.zero > 0 && (
                    <div
                      style={{ width: `${item.zero}%` }}
                      className="bg-[#FACC15] border-r border-[#1C1917]"
                    />
                  )}
                  <div style={{ width: `${item.pos}%` }} className="bg-[#EF4444]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Heatmap Card */}
      <section className="bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-black text-[#1C1917]">
              Matriks Korelasi Fitur Utama vs Result
            </h2>
            <p className="text-xs text-stone-600">
              Arahkan kursor pada sel untuk membaca koefisien korelasi Pearson.
            </p>
          </div>

          {hoveredCell ? (
            <div className="font-mono text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#FACC15] border-2 border-[#1C1917] text-[#1C1917]">
              {hoveredCell.row} × {hoveredCell.col} = {hoveredCell.val.toFixed(2)}
            </div>
          ) : (
            <div className="font-mono text-xs font-semibold text-stone-500">
              Skala: 0.00 → 1.00
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs font-mono">
            <thead>
              <tr>
                <th className="p-2 text-left text-stone-500 font-bold">ATRIBUT</th>
                {eda.correlation_matrix.features.map((col) => (
                  <th
                    key={col}
                    className="p-2 text-center text-[#1C1917] font-bold truncate max-w-[95px]"
                    title={col}
                  >
                    {col.length > 11 ? `${col.slice(0, 10)}…` : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {eda.correlation_matrix.matrix.map((rowVals, rIdx) => {
                const rowFeature = eda.correlation_matrix.features[rIdx];
                return (
                  <tr key={rowFeature}>
                    <td className="p-2 font-bold text-[#1C1917] whitespace-nowrap">
                      {rowFeature}
                    </td>
                    {rowVals.map((val, cIdx) => {
                      const colFeature = eda.correlation_matrix.features[cIdx];
                      let cellBg = 'bg-[#F5F4EE] text-[#1C1917]';
                      if (val >= 0.8) cellBg = 'bg-[#1C1917] text-[#FACC15] font-black';
                      else if (val >= 0.6) cellBg = 'bg-[#FACC15] text-[#1C1917] font-black';
                      else if (val >= 0.35) cellBg = 'bg-[#FDE047]/60 text-[#1C1917] font-bold';
                      else if (val >= 0.2) cellBg = 'bg-[#FEF9C3] text-[#1C1917]';

                      return (
                        <td
                          key={colFeature}
                          onMouseEnter={() =>
                            setHoveredCell({
                              row: rowFeature,
                              col: colFeature,
                              val,
                            })
                          }
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`p-2.5 text-center border border-[#1C1917] cursor-crosshair transition-transform hover:scale-[1.03] ${cellBg}`}
                        >
                          {val.toFixed(2)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
