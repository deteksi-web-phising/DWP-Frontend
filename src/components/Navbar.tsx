import React from 'react';
import type { ModelName } from '../types/phishing';
import { USE_MOCK } from '../services/api';

export type ActiveTab = 'detect' | 'benchmark' | 'eda';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeModel: ModelName;
  setActiveModel: (model: ModelName) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeModel,
  setActiveModel,
}) => {
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-3">
      {/* Top Bar Navigation */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-500">
              MODEL
            </span>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value as ModelName)}
              className="font-mono text-xs font-bold bg-[#FACC15] text-[#1C1917] border-2 border-[#1C1917] rounded-full px-3.5 py-1.5 shadow-[2px_2px_0px_#1C1917] focus:outline-none cursor-pointer"
            >
              <option value="random_forest">Random Forest (96.4%)</option>
              <option value="decision_tree">Decision Tree (93.1%)</option>
              <option value="knn">k-NN (91.8%)</option>
              <option value="kmeans">K-Means (Unsupervised)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-stone-500">
              DATASET
            </span>
            <span className="font-mono text-xs font-bold bg-[#FDFDFB] text-[#1C1917] border-2 border-[#1C1917] rounded-full px-3 py-1.5 shadow-[2px_2px_0px_#1C1917]">
              22,110 URLs
            </span>
          </div>
        </div>

        {/* Center Pill Navigation */}
        <nav className="inline-flex items-center bg-[#FDFDFB] border-2 border-[#1C1917] rounded-full p-1 shadow-[3px_3px_0px_#1C1917]">
          {[
            { id: 'detect', label: 'DETEKSI URL' },
            { id: 'benchmark', label: 'BENCHMARK' },
            { id: 'eda', label: 'EDA DATASET' },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`font-mono text-xs font-bold tracking-wide px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#FACC15] text-[#1C1917]'
                    : 'text-stone-600 hover:text-[#1C1917]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status Metadata */}
        <div className="flex items-center gap-2.5 text-xs font-mono text-stone-600">
          <span>updated 2026-11-18</span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDFDFB] border-2 border-[#1C1917] text-[#1C1917] font-bold shadow-[1px_1px_0px_#1C1917]">
            <span
              className={`w-2 h-2 rounded-full ${
                USE_MOCK ? 'bg-amber-400 animate-pulse' : 'bg-[#16A34A]'
              }`}
            />
            {USE_MOCK ? 'Mock API' : 'FastAPI Live'}
          </span>
        </div>
      </div>

      {/* Hero Title Banner (Compact Editorial Header) */}
      <div className="mt-7 mb-2 text-center">
        <div className="inline-flex flex-wrap items-center justify-center gap-2.5">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1C1917]">
            PhishLab
          </h1>
          <span className="text-3xl sm:text-4xl font-black tracking-tight bg-[#FACC15] text-[#1C1917] px-3 py-0.5 rounded-lg border-2 border-[#1C1917] shadow-[3px_3px_0px_#1C1917]">
            Workbench
          </span>
          <span className="font-mono text-xs font-bold bg-[#FDFDFB] border-2 border-[#1C1917] rounded-full px-3 py-1 shadow-[2px_2px_0px_#1C1917]">
            v1.0 • PENS
          </span>
        </div>
        <p className="mt-2.5 text-sm font-semibold text-stone-800">
          Sistem Analisis & Deteksi Website Phishing Berbasis Machine Learning
        </p>
        <p className="text-xs text-stone-600 mt-0.5">
          30 fitur struktural URL & DOM • 4 algoritma evaluasi • inferensi interaktif real-time
        </p>
      </div>
    </header>
  );
};
