import { useState } from 'react';
import type { ModelName } from './types/phishing';
import { Navbar, type ActiveTab } from './components/Navbar';
import { DetectTab } from './components/DetectTab';
import { BenchmarkTab } from './components/BenchmarkTab';
import { EdaTab } from './components/EdaTab';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('detect');
  const [activeModel, setActiveModel] = useState<ModelName>('random_forest');

  return (
    <div className="min-h-screen bg-[#F5F4EE] text-[#1C1917] font-sans selection:bg-[#FACC15] selection:text-[#1C1917] pb-14">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeModel={activeModel}
        setActiveModel={setActiveModel}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 space-y-6">
        {activeTab === 'detect' && <DetectTab activeModel={activeModel} />}
        {activeTab === 'benchmark' && (
          <BenchmarkTab activeModel={activeModel} setActiveModel={setActiveModel} />
        )}
        {activeTab === 'eda' && <EdaTab />}
      </main>
    </div>
  );
}

export default App;
