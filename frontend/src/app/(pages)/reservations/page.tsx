'use client';

import { useState } from 'react';
import Link from 'next/link';
import { listarReservas, obtenerReservaPorId, cancelarReserva } from '@/lib/api';
import { ReservaCompleta } from '@/lib/definitions';

export default function ReservationsPage() {
    const [usuarioId, setUsuarioId] = useState('');
    const [reservas, setReservas] = useState<ReservaCompleta[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedReserva, setSelectedReserva] = useState<ReservaCompleta | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!usuarioId) return;

        setLoading(true);
        setError('');
        try {
            const result = await listarReservas(Number(usuarioId), 1, 100);
            setReservas(result.items);
        } catch (err) {
            setError('Error al cargar las reservas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (reservaId: number) => {
        setLoadingDetails(true);
        try {
            const details = await obtenerReservaPorId(reservaId, Number(usuarioId));
            setSelectedReserva(details);
        } catch (err) {
            console.error('Error loading reservation details:', err);
            setError('Error al cargar detalles de la reserva');
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleCancelReservation = async () => {
        if (!selectedReserva) return;

        setCancelling(true);
        try {
            await cancelarReserva(selectedReserva.idReserva, { motivoCancelacion: 'Cancelado desde la UI' });
            setSelectedReserva(null);
            // Refrescar la lista de reservas
            handleSubmit(new Event('submit') as any);
        } catch (err) {
            console.error('Error cancelling reservation:', err);
            setError('Error al cancelar la reserva');
        } finally {
            setCancelling(false);
        }
    };

    const closeModal = () => {
        setSelectedReserva(null);
    };

    return (
        <section className="space-y-4">
            <header className="flex items-center">
                <h1 className="text-xl font-semibold">Reservas</h1>
                <Link href="/reservations/new" className="ml-auto border px-3 py-1 rounded">Nueva</Link>
            </header>

            <form className="flex items-end gap-2" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                    <label className="text-sm">ID de Usuario</label>
                    <input
                        type="number"
                        value={usuarioId}
                        onChange={(e) => setUsuarioId(e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="ej. 12345"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="border px-3 py-1 rounded"
                    disabled={loading}
                >
                    {loading ? 'Buscando...' : 'Buscar Reservas'}
                </button>
            </form>

            {error && (
                <div className="text-red-600 text-sm">{error}</div>
            )}

            {reservas.length > 0 && (
                <div className="rounded-md border">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-2 text-left">ID Reserva</th>
                                <th className="p-2 text-left">ID Compra</th>
                                <th className="p-2 text-left">Estado</th>
                                <th className="p-2 text-left">Expira</th>
                                <th className="p-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((reserva) => (
                                <tr key={reserva.id} className="border-t">
                                    <td className="p-2">{reserva.id}</td>
                                    <td className="p-2">{reserva.idCompra}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded text-xs ${reserva.estado === 'confirmado' ? 'bg-green-100 text-green-800' :
                                                reserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {reserva.estado}
                                        </span>
                                    </td>
                                    <td className="p-2">{new Date(reserva.expiresAt).toLocaleString()}</td>
                                    <td className="p-2 text-right">
                                        <button
                                            onClick={() => handleViewDetails(reserva.id)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Ver detalles
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!loading && reservas.length === 0 && usuarioId && (
                <div className="text-gray-500 text-sm text-center p-4 border rounded">
                    No se encontraron reservas para el usuario {usuarioId}
                </div>
            )}

            {/* Modal de Detalles */}
            {selectedReserva && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        {loadingDetails ? (
                            <div className="text-center py-8">Cargando detalles...</div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold">Detalles de Reserva #{selectedReserva.idReserva}</h2>
                                    <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">ID de Compra</p>
                                            <p className="font-semibold">{selectedReserva.idCompra}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Estado</p>
                                            <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${selectedReserva.estado === 'confirmado' ? 'bg-green-100 text-green-800' :
                                                    selectedReserva.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {selectedReserva.estado}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Usuario ID</p>
                                            <p className="font-semibold">{selectedReserva.usuarioId}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Expira</p>
                                            <p className="font-semibold">{new Date(selectedReserva.expiresAt).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Fecha de Creación</p>
                                            <p className="font-semibold">{new Date(selectedReserva.fechaCreacion).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Última Actualización</p>
                                            <p className="font-semibold">{new Date(selectedReserva.fechaActualizacion).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {selectedReserva.detalles && selectedReserva.detalles.length > 0 && (
                                        <div className="mt-6">
                                            <h3 className="font-semibold text-lg mb-3">Productos Reservados</h3>
                                            <div className="border rounded overflow-hidden">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="p-3 text-left">ID Detalle</th>
                                                            <th className="p-3 text-left">Producto ID</th>
                                                            <th className="p-3 text-left">Cantidad</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedReserva.detalles.map((detalle) => (
                                                            <tr key={detalle.id} className="border-t">
                                                                <td className="p-3">{detalle.id}</td>
                                                                <td className="p-3">{detalle.productoId}</td>
                                                                <td className="p-3">{detalle.cantidad}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-6 pt-4 border-t">
                                        <button
                                            onClick={handleCancelReservation}
                                            disabled={cancelling || selectedReserva.estado === 'cancelado'}
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {cancelling ? 'Cancelando...' : 'Liberar Reserva'}
                                        </button>
                                        <button
                                            onClick={closeModal}
                                            className="px-4 py-2 border rounded hover:bg-gray-50"
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
