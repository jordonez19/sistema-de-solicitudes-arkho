import React from 'react';

interface NavbarProps {
  onOpenModal: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenModal, onRefresh, isLoading }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Title */}
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
              Solicitudes Internas
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="px-3 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Cargando...' : 'Refrescar'}
            </button>

            <button
              onClick={onOpenModal}
              className="px-3.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-xs"
            >
              + Nueva solicitud
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
