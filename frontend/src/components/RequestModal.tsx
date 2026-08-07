import React, { useState } from 'react';
import { CreateRequestInput, RequestPriority } from '../types/request.types';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRequestInput) => Promise<void>;
}

export const RequestModal: React.FC<RequestModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [applicant, setApplicant] = useState('');
  const [priority, setPriority] = useState<RequestPriority>('media');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || title.length < 3) {
      setErrorMsg('El título debe tener al menos 3 caracteres.');
      return;
    }
    if (!description.trim() || description.length < 5) {
      setErrorMsg('La descripción debe tener al menos 5 caracteres.');
      return;
    }
    if (!applicant.trim() || applicant.length < 2) {
      setErrorMsg('Por favor ingresa un nombre o correo válido.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        applicant: applicant.trim(),
        priority
      });
      setTitle('');
      setDescription('');
      setApplicant('');
      setPriority('media');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Fallo al registrar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-2xs">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md shadow-lg overflow-hidden text-slate-900 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Nueva solicitud</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-normal px-2 py-0.5"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Solicitud de acceso a repositorio"
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Descripción *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Escribe los detalles..."
              className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Solicitante *
              </label>
              <input
                type="text"
                value={applicant}
                onChange={(e) => setApplicant(e.target.value)}
                placeholder="Nombre / correo"
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Prioridad *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as RequestPriority)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Crear solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
