import React from 'react';
import { RequestPriority } from '../types/request.types';

interface PriorityBadgeProps {
  priority: RequestPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'alta':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-50 text-red-800 text-xs font-medium border border-red-200">
          <span className="w-2.5 h-2.5 rounded bg-[#F87171] border border-red-300 shrink-0"></span>
          Alta
        </span>
      );
    case 'media':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
          <span className="w-2.5 h-2.5 rounded bg-[#FCD34D] border border-amber-300 shrink-0"></span>
          Media
        </span>
      );
    case 'baja':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
          <span className="w-2.5 h-2.5 rounded bg-[#94A3B8] border border-slate-300 shrink-0"></span>
          Baja
        </span>
      );
  }
};
