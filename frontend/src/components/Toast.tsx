import React, { useEffect } from 'react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastNotification | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-slide-down">
      <div className="bg-white border border-slate-100/80 rounded-lg px-4 py-2.5 shadow-[0_6px_16px_0_rgba(0,0,0,0.08),0_3px_6px_-4px_rgba(0,0,0,0.12)] flex items-center gap-2.5 text-xs text-slate-800 font-medium pointer-events-auto">
        {/* Antd Style Success Green Circle Icon */}
        {toast.type === 'success' && (
          <svg
            className="w-4 h-4 text-[#52c41a] shrink-0"
            viewBox="0 0 1024 1024"
            fill="currentColor"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-241.6 301.6c-4.7 5.9-11.9 9.3-19.5 9.3s-14.8-3.4-19.5-9.3l-140.1-175c-4.6-5.7-4-14 1.3-19l32.5-30.8c5.4-5.1 13.7-4.7 18.6.9l107.2 133.9 208.7-260.6c4.9-6.1 13.3-6.9 19.1-1.8l32.7 28.7c5.8 5.1 6.5 13.9 1.6 19.9z" />
          </svg>
        )}

        {/* Antd Style Error Red Circle Icon */}
        {toast.type === 'error' && (
          <svg
            className="w-4 h-4 text-[#ff4d4f] shrink-0"
            viewBox="0 0 1024 1024"
            fill="currentColor"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66 66L512 578.1l-99.4 99.4-66-66L446 512l-99.4-99.4 66-66L512 446l99.4-99.4 66 66L578.1 512l99.3 99.4z" />
          </svg>
        )}

        {/* Antd Style Info Blue Circle Icon */}
        {toast.type === 'info' && (
          <svg
            className="w-4 h-4 text-[#1677ff] shrink-0"
            viewBox="0 0 1024 1024"
            fill="currentColor"
          >
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48 48 0 110-96 48 48 0 010 96z" />
          </svg>
        )}

        <span className="text-[13px] font-normal leading-tight text-slate-800">
          {toast.message}
        </span>
      </div>
    </div>
  );
};
