import { useState, useEffect, useCallback } from 'react';
import { InternalRequest, CreateRequestInput, RequestStatus, RequestPriority } from './types/request.types';
import { apiService } from './services/api';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { RequestCard } from './components/RequestCard';
import { KanbanBoard } from './components/KanbanBoard';
import { RequestModal } from './components/RequestModal';
import { RequestDrawer } from './components/RequestDrawer';
import { Toast, ToastNotification } from './components/Toast';

// Normalize text for filters
const normalizeText = (text: string): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export function App() {
  const [requests, setRequests] = useState<InternalRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'kanban' | 'grid'>('kanban');
  const [selectedRequest, setSelectedRequest] = useState<InternalRequest | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), message, type });
  }, []);

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedPriority, setSelectedPriority] = useState<string>('todas');

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiService.getRequests();
      setRequests(data);
    } catch (err: any) {
      setError(err.message || 'Fallo al conectar con el servidor backend');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleCreateRequest = async (input: CreateRequestInput) => {
    const created = await apiService.createRequest(input);
    setRequests((prev) => [created, ...prev]);
    showToast('Solicitud creada exitosamente', 'success');
  };

  const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
    // 1. Optimistic update immediately in React state to prevent race conditions during drag-and-drop
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r))
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    try {
      // 2. Persist in backend API
      const updated = await apiService.updateRequestStatus(id, newStatus);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(updated);
      }
      showToast('Estado actualizado correctamente', 'success');
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      showToast('Error al actualizar el estado', 'error');
      fetchRequests();
    }
  };

  const handlePriorityChange = async (id: string, newPriority: RequestPriority) => {
    // 1. Optimistic update immediately in React state
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, priority: newPriority, updatedAt: new Date().toISOString() } : r))
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, priority: newPriority } : null));
    }

    try {
      // 2. Persist in backend API
      const updated = await apiService.updateRequestPriority(id, newPriority);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(updated);
      }
      showToast('Prioridad actualizada correctamente', 'success');
    } catch (err) {
      console.error('Error al actualizar prioridad:', err);
      showToast('Error al actualizar la prioridad', 'error');
      fetchRequests();
    }
  };

  const handleUpdateRequest = async (id: string, data: Partial<InternalRequest>) => {
    // 1. Optimistic update in React state
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r))
    );
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest((prev) => (prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null));
    }

    try {
      // 2. Persist full update in backend API
      const updated = await apiService.updateRequest(id, data);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest(updated);
      }
      showToast('Se guardaron los cambios correctamente', 'success');
    } catch (err) {
      console.error('Error al actualizar solicitud:', err);
      showToast('Error al guardar los cambios', 'error');
      fetchRequests();
      throw err;
    }
  };

  const handleDeleteRequest = async (id: string) => {
    // 1. Optimistic update in React state
    setRequests((prev) => prev.filter((r) => r.id !== id));
    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest(null);
    }

    try {
      // 2. Persist deletion in backend API
      await apiService.deleteRequest(id);
      showToast('Solicitud eliminada correctamente', 'success');
    } catch (err) {
      console.error('Error al eliminar solicitud:', err);
      showToast('Error al eliminar la solicitud', 'error');
      fetchRequests();
      throw err;
    }
  };

  // Filtered requests logic con normalización de tildes y caracteres
  const normalizedQuery = normalizeText(searchTerm);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      normalizeText(r.title).includes(normalizedQuery) ||
      normalizeText(r.description).includes(normalizedQuery) ||
      normalizeText(r.applicant).includes(normalizedQuery);

    const matchesStatus = selectedStatus === 'todos' || r.status === selectedStatus;
    const matchesPriority = selectedPriority === 'todas' || r.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Navbar */}
      <Navbar
        onOpenModal={() => setIsModalOpen(true)}
        onRefresh={fetchRequests}
        isLoading={isLoading}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Row */}
        <StatsCards requests={requests} />

        {/* Search & Filter Bar con Switcher de Vista */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-6 shadow-2xs flex flex-col xl:flex-row gap-3 items-stretch xl:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full xl:w-auto">
            {/* Toggle Kanban / Grid */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0 justify-center">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  viewMode === 'kanban'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tablero
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cuadrícula
              </button>
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar solicitud..."
              className="w-full sm:w-64 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full xl:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 xl:flex-none bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="en_proceso">En proceso</option>
              <option value="completada">Completadas</option>
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="flex-1 xl:flex-none bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer transition-colors"
            >
              <option value="todas">Todas las prioridades</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && requests.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs font-medium">
            Cargando solicitudes...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center max-w-md mx-auto my-6">
            <p className="text-xs font-medium text-red-700 mb-3">{error}</p>
            <button
              onClick={fetchRequests}
              className="bg-red-600 hover:bg-red-700 text-white text-xs px-3.5 py-1.5 rounded-md transition-colors shadow-2xs"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredRequests.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center max-w-md mx-auto my-6 shadow-2xs">
            <p className="text-xs text-slate-500 mb-4">No hay solicitudes que coincidan con la búsqueda.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3.5 py-1.5 rounded-md transition-colors shadow-2xs"
            >
              + Nueva solicitud
            </button>
          </div>
        )}

        {/* Content View: Kanban Board vs Grid */}
        {!isLoading && !error && filteredRequests.length > 0 && (
          viewMode === 'kanban' ? (
            <KanbanBoard
              requests={filteredRequests}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onSelectRequest={(r) => setSelectedRequest(r)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onStatusChange={handleStatusChange}
                  onPriorityChange={handlePriorityChange}
                  onSelectRequest={(r) => setSelectedRequest(r)}
                />
              ))}
            </div>
          )
        )}
      </main>

      {/* Modal Form */}
      <RequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateRequest}
      />

      {/* Detail Drawer */}
      <RequestDrawer
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onUpdateRequest={handleUpdateRequest}
        onDeleteRequest={handleDeleteRequest}
      />

      {/* Antd Style Toast Notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
