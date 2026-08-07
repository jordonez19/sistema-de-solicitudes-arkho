import React, { useState } from 'react';
import { InternalRequest, RequestStatus, RequestPriority } from '../types/request.types';
import { RequestCard } from './RequestCard';

interface KanbanBoardProps {
  requests: InternalRequest[];
  onStatusChange: (id: string, newStatus: RequestStatus) => Promise<void>;
  onPriorityChange: (id: string, newPriority: RequestPriority) => Promise<void>;
  onSelectRequest?: (request: InternalRequest) => void;
}

interface ColumnConfig {
  status: RequestStatus;
  title: string;
  colorTagBg: string;
  badgeClass: string;
}

const COLUMNS: ColumnConfig[] = [
  {
    status: 'pendiente',
    title: 'Pendientes',
    colorTagBg: 'bg-[#94A3B8]',
    badgeClass: 'bg-slate-200 text-slate-700'
  },
  {
    status: 'en_proceso',
    title: 'En proceso',
    colorTagBg: 'bg-[#FCD34D]',
    badgeClass: 'bg-amber-100 text-amber-800'
  },
  {
    status: 'completada',
    title: 'Completadas',
    colorTagBg: 'bg-[#86EFAC]',
    badgeClass: 'bg-emerald-100 text-emerald-800'
  }
];

interface KanbanColumnProps {
  col: ColumnConfig;
  items: InternalRequest[];
  onStatusChange: (id: string, newStatus: RequestStatus) => Promise<void>;
  onPriorityChange: (id: string, newPriority: RequestPriority) => Promise<void>;
  onSelectRequest?: (request: InternalRequest) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  col,
  items,
  onStatusChange,
  onPriorityChange,
  onSelectRequest,
  onDragStart,
  onDragEnd
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const requestId = e.dataTransfer.getData('text/plain');
    if (requestId) {
      const existingInColumn = items.some((item) => item.id === requestId);
      if (!existingInColumn) {
        await onStatusChange(requestId, col.status);
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col border rounded-xl p-3 w-[320px] sm:w-[340px] xl:w-full shrink-0 xl:shrink xl:flex-1 transition-all duration-200 ${
        isDragOver
          ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-300/60 shadow-md scale-[1.01]'
          : 'bg-slate-100/80 border-slate-200 shadow-2xs'
      }`}
    >
      {/* Column Header (Jira Style) */}
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-200/60 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded ${col.colorTagBg} shrink-0 shadow-2xs`}></span>
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {col.title}
          </h2>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${col.badgeClass}`}>
          {items.length}
        </span>
      </div>

      {/* Column Droppable Area Container */}
      <div className="relative flex-1 min-h-[450px] space-y-3">
        {items.length === 0 && (
          <div
            className={`h-36 border-2 border-dashed rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
              isDragOver
                ? 'border-blue-400 text-blue-600 bg-blue-100/30'
                : 'border-slate-200 text-slate-400'
            }`}
          >
            {isDragOver ? 'Soltar aquí' : 'Arrastra una solicitud aquí'}
          </div>
        )}

        {items.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onStatusChange={onStatusChange}
            onPriorityChange={onPriorityChange}
            onSelectRequest={onSelectRequest}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  requests,
  onStatusChange,
  onPriorityChange,
  onSelectRequest
}) => {
  const [_draggedId, setDraggedId] = useState<string | null>(null);

  return (
    <div className="flex overflow-x-auto gap-4 pb-4 w-full xl:grid xl:grid-cols-3 xl:gap-4 xl:overflow-visible">
      {COLUMNS.map((col) => {
        const columnItems = requests.filter((r) => r.status === col.status);
        return (
          <KanbanColumn
            key={col.status}
            col={col}
            items={columnItems}
            onStatusChange={onStatusChange}
            onPriorityChange={onPriorityChange}
            onSelectRequest={onSelectRequest}
            onDragStart={(id) => setDraggedId(id)}
            onDragEnd={() => setDraggedId(null)}
          />
        );
      })}
    </div>
  );
};
