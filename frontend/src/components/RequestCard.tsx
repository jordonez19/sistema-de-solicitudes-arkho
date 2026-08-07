import React, { useState } from 'react';
import { InternalRequest, RequestStatus, RequestPriority } from '../types/request.types';

interface RequestCardProps {
  request: InternalRequest;
  onStatusChange: (id: string, newStatus: RequestStatus) => Promise<void>;
  onPriorityChange: (id: string, newPriority: RequestPriority) => Promise<void>;
  onSelectRequest?: (request: InternalRequest) => void;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onStatusChange,
  onPriorityChange,
  onSelectRequest,
  onDragStart,
  onDragEnd
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);

  const handleStatusSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const newStatus = e.target.value as RequestStatus;
    if (newStatus === request.status) return;

    try {
      setIsUpdatingStatus(true);
      await onStatusChange(request.id, newStatus);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handlePrioritySelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const newPriority = e.target.value as RequestPriority;
    if (newPriority === request.priority) return;

    try {
      setIsUpdatingPriority(true);
      await onPriorityChange(request.id, newPriority);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingPriority(false);
    }
  };

  const formattedDate = new Date(request.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short'
  });

  const shortId = `REQ-${request.id.slice(0, 4).toUpperCase()}`;

  // Priority tag box & badge styles
  const priorityBoxBg =
    request.priority === 'alta'
      ? 'bg-[#F87171]'
      : request.priority === 'media'
      ? 'bg-[#FCD34D]'
      : 'bg-[#94A3B8]';

  const priorityColorClass =
    request.priority === 'alta'
      ? 'bg-red-50 text-red-800 border-red-200'
      : request.priority === 'media'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-slate-100 text-slate-700 border-slate-200';

  // Status tag box & badge styles
  const statusBoxBg =
    request.status === 'completada'
      ? 'bg-[#86EFAC]'
      : request.status === 'en_proceso'
      ? 'bg-[#FCD34D]'
      : 'bg-[#94A3B8]';

  const statusColorClass =
    request.status === 'completada'
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : request.status === 'en_proceso'
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', request.id);
        e.dataTransfer.effectAllowed = 'move';
        if (onDragStart) onDragStart(request.id);
      }}
      onDragEnd={() => {
        if (onDragEnd) onDragEnd();
      }}
      onClick={() => onSelectRequest && onSelectRequest(request)}
      className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between min-h-[180px] h-auto w-full cursor-grab active:cursor-grabbing select-none group"
    >
      <div>
        {/* TOP HEADER: ESTADO Y PRIORIDAD CON CUADROS DE COLOR TAG */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2 pb-2 border-b border-slate-100">
          {/* Select de Estado con cuadro de color */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-medium text-slate-400">Estado:</span>
            <div className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-medium rounded px-1.5 py-0.5 border ${statusColorClass}`}>
              <span className={`w-2 h-2 rounded shrink-0 ${statusBoxBg}`}></span>
              <select
                value={request.status}
                onChange={handleStatusSelect}
                onClick={(e) => e.stopPropagation()}
                disabled={isUpdatingStatus}
                className="bg-transparent cursor-pointer focus:outline-none transition-colors disabled:opacity-50 text-[10px] sm:text-[11px]"
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_proceso">En proceso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
          </div>

          {/* Select de Prioridad con cuadro de color */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-medium text-slate-400">Prioridad:</span>
            <div className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-medium rounded px-1.5 py-0.5 border ${priorityColorClass}`}>
              <span className={`w-2 h-2 rounded shrink-0 ${priorityBoxBg}`}></span>
              <select
                value={request.priority}
                onChange={handlePrioritySelect}
                onClick={(e) => e.stopPropagation()}
                disabled={isUpdatingPriority}
                className="bg-transparent cursor-pointer focus:outline-none transition-colors disabled:opacity-50 text-[10px] sm:text-[11px]"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 h-[2rem] group-hover:text-blue-600 transition-colors">
            {request.title}
          </h3>
          <span className="bg-slate-100 text-slate-500 text-[10px] font-mono px-1 py-0.5 rounded border border-slate-200 shrink-0 font-medium">
            {shortId}
          </span>
        </div>

        {/* Description & Ver más */}
        <div className="mt-1">
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">
            {request.description}
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectRequest && onSelectRequest(request);
            }}
            className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 hover:underline mt-0.5 inline-flex items-center gap-0.5 transition-colors"
          >
            Ver más →
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 truncate max-w-[170px]">
          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
          <span className="text-slate-600 truncate font-medium text-[11px]">{request.applicant}</span>
        </div>

        <span className="text-slate-400 text-[10px] shrink-0 font-medium">{formattedDate}</span>
      </div>
    </div>
  );
};
