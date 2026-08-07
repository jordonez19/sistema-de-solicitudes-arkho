import React, { useState, useEffect } from 'react';
import { InternalRequest, RequestStatus, RequestPriority } from '../types/request.types';

interface RequestDrawerProps {
  request: InternalRequest | null;
  onClose: () => void;
  onUpdateRequest: (id: string, data: Partial<InternalRequest>) => Promise<void>;
  onDeleteRequest?: (id: string) => Promise<void>;
}

export const RequestDrawer: React.FC<RequestDrawerProps> = ({
  request,
  onClose,
  onUpdateRequest,
  onDeleteRequest
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [applicant, setApplicant] = useState('');
  const [status, setStatus] = useState<RequestStatus>('pendiente');
  const [priority, setPriority] = useState<RequestPriority>('media');

  const [touched, setTouched] = useState<{ title?: boolean; description?: boolean; applicant?: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (request) {
      setTitle(request.title);
      setDescription(request.description);
      setApplicant(request.applicant);
      setStatus(request.status);
      setPriority(request.priority);
      setSaveError(null);
      setSaveSuccess(false);
      setIsConfirmingDelete(false);
      setTouched({});
    }
  }, [request]);

  if (!request) return null;

  const titleError = touched.title && (!title.trim() ? 'El título es requerido' : title.trim().length < 3 ? 'Debe tener al menos 3 caracteres' : null);
  const descriptionError = touched.description && (!description.trim() ? 'La descripción es requerida' : description.trim().length < 5 ? 'Debe tener al menos 5 caracteres' : null);
  const applicantError = touched.applicant && (!applicant.trim() ? 'El solicitante es requerido' : applicant.trim().length < 2 ? 'Debe tener al menos 2 caracteres' : null);

  const handleDelete = async () => {
    if (!onDeleteRequest || !request) return;
    try {
      setIsDeleting(true);
      await onDeleteRequest(request.id);
      onClose();
    } catch (err: any) {
      setSaveError(err.message || 'Error al eliminar la solicitud');
      setIsDeleting(false);
    }
  };

  const shortId = `REQ-${request.id.slice(0, 4).toUpperCase()}`;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, description: true, applicant: true });
    setSaveError(null);
    setSaveSuccess(false);

    if (!title.trim() || title.trim().length < 3) {
      setSaveError('Por favor corrige los campos remarcados en rojo.');
      return;
    }
    if (!description.trim() || description.trim().length < 5) {
      setSaveError('Por favor corrige los campos remarcados en rojo.');
      return;
    }
    if (!applicant.trim() || applicant.trim().length < 2) {
      setSaveError('Por favor corrige los campos remarcados en rojo.');
      return;
    }

    try {
      setIsSaving(true);
      await onUpdateRequest(request.id, {
        title: title.trim(),
        description: description.trim(),
        applicant: applicant.trim(),
        status,
        priority
      });
      setSaveSuccess(true);
      setSaveError(null);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err: any) {
      setSaveError(err.message || 'Error al actualizar la solicitud');
    } finally {
      setIsSaving(false);
    }
  };

  const statusColorClass =
    status === 'completada'
      ? 'border-emerald-300 bg-emerald-50/50 text-emerald-800'
      : status === 'en_proceso'
      ? 'border-amber-300 bg-amber-50/50 text-amber-900'
      : 'border-slate-300 bg-slate-100 text-slate-700';

  const statusBoxBg =
    status === 'completada' ? 'bg-[#86EFAC]' : status === 'en_proceso' ? 'bg-[#FCD34D]' : 'bg-[#94A3B8]';

  const priorityColorClass =
    priority === 'alta'
      ? 'border-red-300 bg-red-50/50 text-red-800'
      : priority === 'media'
      ? 'border-amber-300 bg-amber-50/50 text-amber-900'
      : 'border-slate-300 bg-slate-100 text-slate-700';

  const priorityBoxBg =
    priority === 'alta' ? 'bg-[#F87171]' : priority === 'media' ? 'bg-[#FCD34D]' : 'bg-[#94A3B8]';

  const formattedCreatedDate = new Date(request.createdAt).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedUpdatedDate = request.updatedAt
    ? new Date(request.updatedAt).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        {/* Drawer Panel */}
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200 text-slate-800">
          {/* Drawer Header */}
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="bg-slate-200 text-slate-700 font-mono text-xs px-2.5 py-1 rounded-md border border-slate-300 font-bold select-none cursor-not-allowed" title="Número de ticket (No editable)">
                {shortId}
              </span>
              <span className="text-xs text-slate-500 font-medium">Editar Solicitud</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm font-semibold"
              title="Cerrar panel"
            >
              ✕
            </button>
          </div>

          {/* Drawer Form Body */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            <p className="text-[11px] text-slate-500">
              Los campos marcados con <span className="text-red-500 font-bold ml-0.5">*</span> son obligatorios.
            </p>

            {saveError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {saveError}
              </div>
            )}

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
                <span>✓</span> Solicitud actualizada correctamente
              </div>
            )}

            {/* Status & Priority Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Estado <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className={`relative flex items-center justify-between text-xs font-medium rounded-lg px-3 py-2 border ${statusColorClass}`}>
                  <div className="flex items-center gap-2 w-full">
                    <span className={`w-2.5 h-2.5 rounded shrink-0 ${statusBoxBg}`}></span>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as RequestStatus)}
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer appearance-none pr-4"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_proceso">En proceso</option>
                      <option value="completada">Completada</option>
                    </select>
                  </div>
                  <span className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">▼</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Prioridad <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className={`relative flex items-center justify-between text-xs font-medium rounded-lg px-3 py-2 border ${priorityColorClass}`}>
                  <div className="flex items-center gap-2 w-full">
                    <span className={`w-2.5 h-2.5 rounded shrink-0 ${priorityBoxBg}`}></span>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as RequestPriority)}
                      className="w-full bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer appearance-none pr-4"
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                  <span className="absolute right-2.5 pointer-events-none text-slate-400 text-[10px]">▼</span>
                </div>
              </div>
            </div>

            {/* Title Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
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
                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 font-semibold focus:outline-none transition-colors ${
                  titleError
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 focus:border-blue-500'
                }`}
                placeholder="Título de la solicitud..."
              />
              {titleError && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">{titleError}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Descripción <span className="text-red-500 font-bold ml-0.5">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setTouched((prev) => ({ ...prev, description: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
                rows={5}
                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none transition-colors resize-y leading-relaxed ${
                  descriptionError
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 focus:border-blue-500'
                }`}
                placeholder="Descripción detallada de la solicitud..."
              />
              {descriptionError && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">{descriptionError}</p>
              )}
            </div>

            {/* Applicant Field */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
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
                className={`w-full bg-white border rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none transition-colors ${
                  applicantError
                    ? 'border-red-500 bg-red-50/20 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-slate-200 focus:border-blue-500'
                }`}
                placeholder="Nombre o correo del solicitante..."
              />
              {applicantError && (
                <p className="mt-1 text-[11px] text-red-500 font-medium">{applicantError}</p>
              )}
            </div>

            {/* Timestamps */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-[11px] text-slate-500">
              <div className="flex justify-between">
                <span>Número de Ticket (Fijo):</span>
                <span className="font-mono font-semibold text-slate-700">{shortId}</span>
              </div>
              <div className="flex justify-between">
                <span>Fecha de creación:</span>
                <span className="font-medium text-slate-700">{formattedCreatedDate}</span>
              </div>
              {formattedUpdatedDate && (
                <div className="flex justify-between">
                  <span>Última actualización:</span>
                  <span className="font-medium text-slate-700">{formattedUpdatedDate}</span>
                </div>
              )}
            </div>

            {/* Hidden Submit Button */}
            <button type="submit" className="hidden" />
          </form>

          {/* Drawer Footer */}
          <div className="px-5 sm:px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
            {!isConfirmingDelete ? (
              <>
                {onDeleteRequest && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    🗑 Eliminar Solicitud
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors shadow-2xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-2 animate-fade-in">
                <span className="text-xs font-medium text-red-800">
                  ¿Estás seguro de eliminar esta solicitud?
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(false)}
                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-md hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-md transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
