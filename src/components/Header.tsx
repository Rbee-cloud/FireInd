import React from 'react';
import { FileSpreadsheet, Printer } from 'lucide-react';

interface HeaderProps {
  activeTab: 'bento' | 'calculations';
  onTabChange: (tab: 'bento' | 'calculations') => void;
  onExportExcel: () => void;
  onOpenPdfReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onExportExcel,
  onOpenPdfReport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#F5F5F7]/90 backdrop-blur-md border-b border-black/5 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
              India FIRE Bento-Planner
            </span>
          </div>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <button
              onClick={() => onTabChange('bento')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                activeTab === 'bento'
                  ? 'text-slate-900 border-b-2 border-[#007AFF]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Bento Dashboard
            </button>
            <button
              onClick={() => onTabChange('calculations')}
              className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 cursor-pointer ${
                activeTab === 'calculations'
                  ? 'text-slate-900 border-b-2 border-[#007AFF]'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Calculation Engine
            </button>
            <button
              onClick={onOpenPdfReport}
              className="text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Executive Report
            </button>
            <a
              href="#risk-shield"
              onClick={() => {
                if (activeTab !== 'bento') onTabChange('bento');
              }}
              className="text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Risk Shield
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenPdfReport}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-all shadow-2xs whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600" />
              <span>PDF Report</span>
            </button>

            <button
              onClick={onExportExcel}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#007AFF] hover:bg-blue-600 rounded-xl transition-all shadow-xs hover:shadow-sm whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-200" />
              <span>Download .XLSX</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
