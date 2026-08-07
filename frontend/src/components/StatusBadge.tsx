import React from 'react';
import { RequestStatus } from '../types/request.types';

interface StatusBadgeProps {
  status: RequestStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'completada':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200">
          <span className="w-2.5 h-2.5 rounded bg-[#86EFAC] border border-emerald-300 shrink-0"></span>
          Completada
        </span>
      );
    case 'en_proceso':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
          <span className="w-2.5 h-2.5 rounded bg-[#FCD34D] border border-amber-300 shrink-0"></span>
          En proceso
        </span>
      );
    case 'pendiente':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          <span className="w-2.5 h-2.5 rounded bg-[#94A3B8] border border-slate-300 shrink-0"></span>
          Pendiente
        </span>
      );
  }
};
