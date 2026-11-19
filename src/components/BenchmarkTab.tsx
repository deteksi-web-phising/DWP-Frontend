import React, { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import type { BenchmarkResponse, ModelName, SupervisedMetric } from '../types/phishing';
import { phishingService } from '../services/api';

interface BenchmarkTabProps {
  activeModel: ModelName;
  setActiveModel: (model: ModelName) => void;
}

const BAR_COLORS: Record<string, string> = {
  random_forest: 'bg-[#16A34A]',
  decision_tree: 'bg-[#2563EB]',
  knn: 'bg-[#F59E0B]',
};

export const BenchmarkTab: React.FC<BenchmarkTabProps> = ({
  activeModel,
  setActiveModel,
}) => {
  const [data, setData] = useState<BenchmarkResponse | null>(null);
  const [selectedCmModel, setSelectedCmModel] =
    useState<Exclude<ModelName, 'kmeans'>>('random_forest');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    phishingService
      .getBenchmark()
      .then((res) => setData(res))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return (
      <div className="p-10 bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl shadow-[4px_4px_0px_#1C1917] text-center font-mono font-bold">
        Memuat metrik evaluasi model...
      </div>
    );
  }

  const sortedByAccuracy = [...data.supervised].sort((a, b) => b.accuracy - a.accuracy);
  const sortedByF1 = [...data.supervised].sort((a, b) => b.f1_score - a.f1_score);
  const sortedBySpeed = [...data.supervised].sort((a, b) => a.latency_ms - b.latency_ms);

  const cmModel: SupervisedMetric =
    data.supervised.find((m) => m.model_name === selectedCmModel) || data.supervised[0];

  const [[tn, fp], [fn, tp]] = cmModel.confusion_matrix;

  return (
    <div className="space-y-6">
      {/* 3-Column Tactile Leaderboard Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Overall Accuracy */}
        <div className="bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-black tracking-tight text-[#1C1917]">Accuracy</h2>
              <Info className="w-4 h-4 text-stone-400" />
            </div>
            <span className="font-mono text-[11px] font-semibold text-stone-500">
              Target PRD ≥ 88%
            </span>
          </div>

          <div className="space-y-4">
            {sortedByAccuracy.map((m, idx) => (
              <div key={m.model_name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-500">#{idx + 1}</span>
                    <span className="font-bold text-sm text-[#1C1917]">{m.display_name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveModel(m.model_name)}
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#1C1917] cursor-pointer transition-colors ${
                      activeModel === m.model_name
                        ? 'bg-[#FACC15] text-[#1C1917]'
                        : 'bg-[#F5F4EE] text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {activeModel === m.model_name ? 'AKTIF' : 'PILIH'}
                  </button>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-3.5 bg-[#F5F4EE] border-2 border-[#1C1917] rounded-full overflow-hidden">
                    <div
                      className={`h-full border-r-2 border-[#1C1917] ${BAR_COLORS[m.model_name]}`}
                      style={{ width: `${m.accuracy}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-black w-12 text-right">
                    {m.accuracy.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: F1-Score */}
        <div className="bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-black tracking-tight text-[#1C1917]">F1-Score</h2>
              <Info className="w-4 h-4 text-stone-400" />
            </div>
            <span className="font-mono text-[11px] font-semibold text-stone-500">
              Harmonic Mean
            </span>
          </div>

          <div className="space-y-4">
            {sortedByF1.map((m, idx) => (
              <div key={m.model_name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-500">#{idx + 1}</span>
                    <span className="font-bold text-sm text-[#1C1917]">{m.display_name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-stone-500">
                    P:{m.precision}% • R:{m.recall}%
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-3.5 bg-[#F5F4EE] border-2 border-[#1C1917] rounded-full overflow-hidden">
                    <div
                      className={`h-full border-r-2 border-[#1C1917] ${BAR_COLORS[m.model_name]}`}
                      style={{ width: `${m.f1_score}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-black w-12 text-right">
                    {m.f1_score.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Inference Speed / Latency */}
        <div className="bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5">
              <h2 className="text-xl font-black tracking-tight text-[#1C1917]">Latency</h2>
              <Info className="w-4 h-4 text-stone-400" />
            </div>
            <span className="font-mono text-[11px] font-semibold text-stone-500">
              Target &lt; 300ms
            </span>
          </div>

          <div className="space-y-4">
            {sortedBySpeed.map((m, idx) => (
              <div key={m.model_name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-500">#{idx + 1}</span>
                    <span className="font-bold text-sm text-[#1C1917]">{m.display_name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-stone-500">{m.algorithm_type}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 h-3.5 bg-[#F5F4EE] border-2 border-[#1C1917] rounded-full overflow-hidden">
                    <div
                      className={`h-full border-r-2 border-[#1C1917] ${BAR_COLORS[m.model_name]}`}
                      style={{ width: `${Math.min(100, (m.latency_ms / 80) * 100)}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs font-black w-12 text-right">
                    {m.latency_ms}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Split: Confusion Matrix 2x2 & K-Means PCA Scatter */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Confusion Matrix */}
        <div className="lg:col-span-6 bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917]">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-lg font-black text-[#1C1917]">Confusion Matrix</h3>
              <p className="text-xs text-stone-600">Evaluasi pada 4.422 data uji (20% split)</p>
            </div>
            <div className="flex gap-1 bg-[#F5F4EE] p-1 rounded-full border-2 border-[#1C1917]">
              {data.supervised.map((m) => (
                <button
                  key={m.model_name}
                  type="button"
                  onClick={() => setSelectedCmModel(m.model_name)}
                  className={`px-3 py-1 rounded-full font-mono text-xs font-bold transition-colors cursor-pointer ${
                    selectedCmModel === m.model_name
                      ? 'bg-[#FACC15] text-[#1C1917]'
                      : 'text-stone-600 hover:text-[#1C1917]'
                  }`}
                >
                  {m.short_name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-4 rounded-xl bg-[#DCFCE7] border-2 border-[#1C1917]">
              <div className="font-mono text-[11px] font-bold text-[#166534]">
                TRUE NEGATIVE (TN)
              </div>
              <div className="font-mono text-2xl font-black text-[#1C1917] mt-1">
                {tn.toLocaleString()}
              </div>
              <div className="text-xs text-stone-700 mt-0.5">Sah → Prediksi Sah</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FEE2E2] border-2 border-[#1C1917]">
              <div className="font-mono text-[11px] font-bold text-[#991B1B]">
                FALSE POSITIVE (FP)
              </div>
              <div className="font-mono text-2xl font-black text-[#1C1917] mt-1">
                {fp.toLocaleString()}
              </div>
              <div className="text-xs text-stone-700 mt-0.5">Sah → Prediksi Phish</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FEF9C3] border-2 border-[#1C1917]">
              <div className="font-mono text-[11px] font-bold text-[#854D0E]">
                FALSE NEGATIVE (FN)
              </div>
              <div className="font-mono text-2xl font-black text-[#1C1917] mt-1">
                {fn.toLocaleString()}
              </div>
              <div className="text-xs text-stone-700 mt-0.5">Phish → Prediksi Sah</div>
            </div>

            <div className="p-4 rounded-xl bg-[#DBEAFE] border-2 border-[#1C1917]">
              <div className="font-mono text-[11px] font-bold text-[#1E40AF]">
                TRUE POSITIVE (TP)
              </div>
              <div className="font-mono text-2xl font-black text-[#1C1917] mt-1">
                {tp.toLocaleString()}
              </div>
              <div className="text-xs text-stone-700 mt-0.5">Phish → Prediksi Phish</div>
            </div>
          </div>
        </div>

        {/* K-Means Clustering PCA (SVG) */}
        <div className="lg:col-span-6 bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 shadow-[4px_4px_0px_#1C1917] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-black text-[#1C1917]">
                K-Means Clustering (PCA 2D)
              </h3>
              <p className="text-xs text-stone-600">
                Evaluasi unsupervised tanpa label target
              </p>
            </div>
            <span className="font-mono text-xs font-black bg-[#FACC15] border-2 border-[#1C1917] rounded-full px-3 py-1">
              Silhouette: {data.unsupervised.silhouette_score}
            </span>
          </div>

          <div className="w-full h-48 bg-[#F5F4EE] border-2 border-[#1C1917] rounded-xl p-2">
            <svg viewBox="-4 -3 8 6" className="w-full h-full">
              <line x1="-4" y1="0" x2="4" y2="0" stroke="#A8A29E" strokeWidth="0.04" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke="#A8A29E" strokeWidth="0.04" />
              {data.unsupervised.pca_clusters.map((pt, idx) => (
                <circle
                  key={idx}
                  cx={pt.x}
                  cy={-pt.y}
                  r="0.18"
                  fill={pt.cluster === 0 ? '#22C55E' : '#EF4444'}
                  stroke="#1C1917"
                  strokeWidth="0.05"
                />
              ))}
            </svg>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-4 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#22C55E] border border-[#1C1917]" />
                Cluster 0 (Legitimate Dominant)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] border border-[#1C1917]" />
                Cluster 1 (Phishing Dominant)
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
