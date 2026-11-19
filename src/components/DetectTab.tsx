import React, { useState, useEffect, useTransition } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  Sliders,
  RefreshCw,
} from 'lucide-react';
import type {
  FeatureValue,
  ModelName,
  PhishingFeatures,
  PredictResponse,
} from '../types/phishing';
import {
  FEATURE_CATEGORIES,
  FEATURES_METADATA,
  type FeatureCategory,
} from '../data/featuresMetadata';
import { phishingService } from '../services/api';

interface DetectTabProps {
  activeModel: ModelName;
}

const buildDefaultFeatures = (): PhishingFeatures => {
  const obj = {} as PhishingFeatures;
  FEATURES_METADATA.forEach((f) => {
    obj[f.key] = (f.key === 'Redirect' ? 0 : -1) as never;
  });
  return obj;
};

const modelLabels: Record<ModelName, string> = {
  random_forest: 'Random Forest',
  decision_tree: 'Decision Tree',
  knn: 'k-NN (k=5)',
  kmeans: 'K-Means',
};

export const DetectTab: React.FC<DetectTabProps> = ({ activeModel }) => {
  const [urlInput, setUrlInput] = useState('https://secure-login-mandiri.xyz/auth');
  const [analyzedUrl, setAnalyzedUrl] = useState('https://secure-login-mandiri.xyz/auth');
  const [features, setFeatures] = useState<PhishingFeatures>(buildDefaultFeatures);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isManualOpen, setIsManualOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<FeatureCategory>('Address Bar');
  const [, startTransition] = useTransition();

  // Jalankan ekstraksi fitur dari URL lalu prediksi
  const handleAnalyzeUrl = async (targetUrl = urlInput) => {
    const trimmed = targetUrl.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const extracted = await phishingService.extractUrl(trimmed);
      setAnalyzedUrl(trimmed);
      setFeatures(extracted.features);
      const predicted = await phishingService.predict(activeModel, extracted.features);
      setResult(predicted);
    } catch {
      setErrorMsg('Gagal menghubungi endpoint ekstraksi / inferensi URL.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSample = (sampleUrl: string) => {
    setUrlInput(sampleUrl);
    handleAnalyzeUrl(sampleUrl);
  };

  // Re-predict ketika fitur manual diubah atau model berganti
  const runPredict = async (
    currentFeatures: PhishingFeatures,
    model: ModelName
  ) => {
    try {
      const predicted = await phishingService.predict(model, currentFeatures);
      startTransition(() => {
        setResult(predicted);
      });
    } catch {
      setErrorMsg('Gagal memperbarui prediksi model.');
    }
  };

  const handleFeatureChange = (key: keyof PhishingFeatures, val: FeatureValue) => {
    const updated = { ...features, [key]: val };
    setFeatures(updated);
    runPredict(updated, activeModel);
  };

  // Reset kembali ke hasil ekstraksi URL terakhir
  const handleResetToUrl = async () => {
    handleAnalyzeUrl(analyzedUrl);
  };

  // Inspeksi awal saat komponen dimuat
  useEffect(() => {
    handleAnalyzeUrl(urlInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sinkronkan prediksi ketika model aktif di header berganti
  useEffect(() => {
    if (result) {
      runPredict(features, activeModel);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModel]);

  const isPhishing = result ? result.prediction === 'Phishing' : true;
  const confidenceScore = result ? (result.confidence * 100).toFixed(1) : '85.0';
  const riskFactors = result ? result.risk_factors : [];

  return (
    <div className="space-y-6">
      {/* 1. URL Scanner Card */}
      <section className="bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_#1C1917]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-extrabold tracking-tight text-[#1C1917]">
              URL Feature Extractor & Scanner
            </h2>
            <span className="font-mono text-[11px] bg-stone-100 border border-[#1C1917] rounded-full px-2 py-0.5 font-semibold">
              POST /extract-url
            </span>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAnalyzeUrl();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Masukkan URL lengkap, cth: https://example.com"
            className="flex-1 font-mono text-sm bg-[#F5F4EE] border-2 border-[#1C1917] rounded-xl px-4 py-3 text-[#1C1917] placeholder:text-stone-400 focus:bg-white focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FACC15] hover:bg-[#EAB308] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none text-[#1C1917] border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917] font-mono text-sm font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4 stroke-[2.5]" />
            )}
            <span>ANALISIS URL</span>
          </button>
        </form>

        {/* Quick Sample Pills */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-mono font-semibold text-stone-600">Sampel cepat:</span>
          <button
            type="button"
            onClick={() => handleQuickSample('https://secure-login-mandiri.xyz/auth')}
            className="font-mono text-xs px-3 py-1 rounded-full bg-[#FEE2E2] text-[#991B1B] border-2 border-[#1C1917] hover:bg-[#FECACA] font-semibold transition-colors cursor-pointer"
          >
            https://secure-login-mandiri.xyz/auth
          </button>
          <button
            type="button"
            onClick={() => handleQuickSample('https://www.pens.ac.id')}
            className="font-mono text-xs px-3 py-1 rounded-full bg-[#DCFCE7] text-[#166534] border-2 border-[#1C1917] hover:bg-[#BBF7D0] font-semibold transition-colors cursor-pointer"
          >
            https://www.pens.ac.id
          </button>
        </div>

        {errorMsg && (
          <div className="mt-3 p-3 bg-[#FEE2E2] border-2 border-[#1C1917] rounded-xl text-xs font-bold text-[#991B1B]">
            {errorMsg}
          </div>
        )}
      </section>

      {/* 2. Verdict Result Card */}
      {result && (
        <section
          className={`border-2 border-[#1C1917] rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_#1C1917] transition-colors ${
            isPhishing ? 'bg-[#FEE2E2]' : 'bg-[#DCFCE7]'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-xl border-2 border-[#1C1917] shadow-[2px_2px_0px_#1C1917] shrink-0 ${
                  isPhishing ? 'bg-[#EF4444] text-white' : 'bg-[#22C55E] text-[#1C1917]'
                }`}
              >
                {isPhishing ? (
                  <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black tracking-tight text-[#1C1917]">
                    {isPhishing ? 'PHISHING DETECTED (Label: 1)' : 'LEGITIMATE SITE (Label: -1)'}
                  </h3>
                  <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FDFDFB] border-2 border-[#1C1917] text-[#1C1917]">
                    Model: {modelLabels[activeModel]}
                  </span>
                </div>
                <p className="font-mono text-xs text-stone-800 mt-1 break-all">
                  Target: {analyzedUrl}
                </p>
              </div>
            </div>

            {/* Tactile Confidence Bar */}
            <div className="w-full lg:w-72 bg-[#FDFDFB] border-2 border-[#1C1917] rounded-xl p-3 shadow-[2px_2px_0px_#1C1917]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-mono font-bold text-stone-600">CONFIDENCE</span>
                <span className="font-mono text-sm font-black text-[#1C1917]">
                  {confidenceScore}%
                </span>
              </div>
              <div className="w-full h-3.5 bg-[#F5F4EE] border-2 border-[#1C1917] rounded-full overflow-hidden">
                <div
                  className={`h-full border-r-2 border-[#1C1917] transition-all duration-300 ${
                    isPhishing ? 'bg-[#EF4444]' : 'bg-[#22C55E]'
                  }`}
                  style={{ width: `${confidenceScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Triggered Risk Factors Strip */}
          <div className="mt-4 pt-3.5 border-t-2 border-[#1C1917]/20 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#1C1917]">
              TRIGGERED RISK FACTORS:
            </span>
            {riskFactors.length > 0 ? (
              riskFactors.map((factor) => (
                <span
                  key={factor}
                  className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FDFDFB] border-2 border-[#1C1917] text-[#B91C1C]"
                >
                  {factor} = 1
                </span>
              ))
            ) : (
              <span className="font-mono text-xs font-semibold text-[#166534]">
                0 indikator risiko aktif (semua atribut berada pada batas aman)
              </span>
            )}
          </div>
        </section>
      )}

      {/* 3. Manual Override Panel (30 Fitur) */}
      <section className="bg-[#FDFDFB] border-2 border-[#1C1917] rounded-2xl shadow-[4px_4px_0px_#1C1917] overflow-hidden">
        <button
          type="button"
          onClick={() => setIsManualOpen(!isManualOpen)}
          className="w-full px-5 sm:px-6 py-4 flex items-center justify-between text-left hover:bg-[#F5F4EE]/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FACC15] border-2 border-[#1C1917]">
              <Sliders className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#1C1917]">
                Inspeksi & Fallback Manual (30 Fitur Lengkap)
              </h3>
              <p className="text-xs text-stone-600">
                Ubah nilai atribut (-1: Sah, 0: Mencurigakan, 1: Phishing) untuk menguji respons model secara instan.
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-full bg-[#F5F4EE] border-2 border-[#1C1917]">
            <span>{isManualOpen ? 'TUTUP' : 'BUKA'}</span>
            {isManualOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isManualOpen && (
          <div className="border-t-2 border-[#1C1917] p-5 sm:p-6 space-y-5">
            {/* Category Filter Pills & Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {FEATURE_CATEGORIES.map((cat) => {
                  const count = FEATURES_METADATA.filter((f) => f.category === cat).length;
                  const active = activeCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`font-mono text-xs font-bold px-3.5 py-1.5 rounded-full border-2 border-[#1C1917] transition-all cursor-pointer ${
                        active
                          ? 'bg-[#1C1917] text-[#FDFDFB] shadow-[2px_2px_0px_#FACC15]'
                          : 'bg-[#F5F4EE] text-[#1C1917] hover:bg-stone-200'
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px] font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#22C55E] border border-[#1C1917]" /> -1 Sah
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#FACC15] border border-[#1C1917]" /> 0 Netral
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#EF4444] border border-[#1C1917]" /> 1 Phish
                </span>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {FEATURES_METADATA.filter((f) => f.category === activeCategory).map((feat) => {
                const currentVal = features[feat.key];
                const isRisk = currentVal === 1;
                return (
                  <div
                    key={feat.key}
                    className={`p-3.5 rounded-xl border-2 border-[#1C1917] flex flex-col justify-between gap-3 transition-colors ${
                      isRisk ? 'bg-[#FEE2E2]/60' : 'bg-[#F5F4EE]/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-[#1C1917]">
                          {feat.key}
                        </span>
                        {isRisk && (
                          <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-[#EF4444] text-white border border-[#1C1917]">
                            RISK
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>

                    {/* Segmented Buttons Toggle */}
                    <div className="grid grid-flow-col auto-cols-fr gap-1.5 bg-[#FDFDFB] p-1 rounded-lg border-2 border-[#1C1917]">
                      {feat.options.map((opt) => {
                        const selected = currentVal === opt;
                        let activeStyle = 'bg-[#1C1917] text-white';
                        if (selected && opt === -1) activeStyle = 'bg-[#22C55E] text-[#1C1917]';
                        if (selected && opt === 0) activeStyle = 'bg-[#FACC15] text-[#1C1917]';
                        if (selected && opt === 1) activeStyle = 'bg-[#EF4444] text-white';

                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleFeatureChange(feat.key, opt as FeatureValue)}
                            className={`font-mono text-xs py-1 rounded-md transition-colors cursor-pointer ${
                              selected
                                ? `${activeStyle} font-black border border-[#1C1917]`
                                : 'text-stone-600 font-semibold hover:bg-stone-100'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Reset Action */}
            <div className="pt-3 border-t-2 border-[#1C1917]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-stone-600">
                Setiap klik nilai fitur langsung menyinkronkan status prediksi di atas.
              </span>
              <button
                type="button"
                onClick={handleResetToUrl}
                className="inline-flex items-center gap-1.5 font-mono font-bold text-[#1C1917] underline decoration-2 underline-offset-4 hover:text-stone-600 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset ke Hasil Ekstraksi URL</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
