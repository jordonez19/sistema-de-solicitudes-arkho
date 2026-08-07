import React from 'react';
import { InternalRequest } from '../types/request.types';

interface StatsCardsProps {
  requests: InternalRequest[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ requests }) => {
  const total = requests.length;
  const pendientes = requests.filter((r) => r.status === 'pendiente').length;
  const enProceso = requests.filter((r) => r.status === 'en_proceso').length;
  const completadas = requests.filter((r) => r.status === 'completada').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-xs text-slate-600">
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between sm:justify-start gap-2 shadow-2xs">
        <span className="text-slate-500 font-medium truncate">Total:</span>
        <span className="font-semibold text-slate-900">{total}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between sm:justify-start gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2.5 h-2.5 rounded bg-[#94A3B8] inline-block shrink-0"></span>
          <span className="text-slate-500 font-medium truncate">Pendientes:</span>
        </div>
        <span className="font-semibold text-slate-800">{pendientes}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between sm:justify-start gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2.5 h-2.5 rounded bg-[#FCD34D] inline-block shrink-0"></span>
          <span className="text-slate-500 font-medium truncate">En proceso:</span>
        </div>
        <span className="font-semibold text-amber-800">{enProceso}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 flex items-center justify-between sm:justify-start gap-2 shadow-2xs">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2.5 h-2.5 rounded bg-[#86EFAC] inline-block shrink-0"></span>
          <span className="text-slate-500 font-medium truncate">Completadas:</span>
        </div>
        <span className="font-semibold text-emerald-800">{completadas}</span>
      </div>
    </div>
  );
};
