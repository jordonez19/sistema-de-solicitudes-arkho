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
  
  const [touched, setTouched] = useState<{ title?: boolean; description?: boolean; applicant?: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const titleError = touched.title && (!title.trim() ? 'El título es requerido' : title.trim().length < 3 ? 'Debe tener al menos 3 caracteres' : null);
  const descriptionError = touched.description && (!description.trim() ? 'La descripción es requerida' : description.trim().length < 5 ? 'Debe tener al menos 5 caracteres' : null);
  const applicantError = touched.applicant && (!applicant.trim() ? 'El solicitante es requerido' : applicant.trim().length < 2 ? 'Debe tener al menos 2 caracteres' : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true, applicant: true });
    setErrorMsg(null);

    if (!title.trim() || title.trim().length < 3) {
      setErrorMsg('Por favor corrige los campos remarcados en rojo.');
      return;
    }
    if (!description.trim() || description.trim().length < 5) {
      setErrorMsg('Por favor corrige los campos remarcados en rojo.');
      return;
    }
    if (!applicant.trim() || applicant.trim().length < 2) {
      setErrorMsg('Por favor corrige los campos remarcados en rojo.');
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
      setTouched({});
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Fallo al registrar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setTouched({});
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-2xs">
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md shadow-lg overflow-hidden text-slate-900 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Nueva solicitud</h2>
          <button
            type="button"
            onClick={handleCloseModal}
            className="text-slate-400 hover:text-slate-700 text-sm font-normal px-2 py-0.5"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          <p className="text-[11px] text-slate-500">
            Los campos marcados con <span className="text-red-500 font-bold ml-0.5">*</span> son obligatorios.
          </p>

          {errorMsg && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700 font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Título <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTouched((prev) => ({ ...prev, title: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
              placeholder="Ej. Solicitud de acceso a repositorio"
              className={`w-full bg-white border rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                titleError
                  ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {titleError && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{titleError}</p>
            )}
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              Descripción <span className="text-red-500 font-bold ml-0.5">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setTouched((prev) => ({ ...prev, description: true }));
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
              rows={3}
              placeholder="Escribe los detalles..."
              className={`w-full bg-white border rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors resize-none ${
                descriptionError
                  ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-slate-200 focus:border-blue-500'
              }`}
            />
            {descriptionError && (
              <p className="mt-1 text-[11px] text-red-500 font-medium">{descriptionError}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Solicitante <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <input
                type="text"
                value={applicant}
                onChange={(e) => {
                  setApplicant(e.target.value);
                  setTouched((prev) => ({ ...prev, applicant: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, applicant: true }))}
                placeholder="Nombre / correo"
                className={`w-full bg-white border rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none transition-colors ${
                  applicantError
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 focus:border-blue-500'
                }`}
              />
              {applicantError && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">{applicantError}</p>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Prioridad <span className="text-red-500 font-bold ml-0.5">*</span>
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
              onClick={handleCloseModal}
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
