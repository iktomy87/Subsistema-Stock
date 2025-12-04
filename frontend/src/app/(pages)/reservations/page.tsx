'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { listarReservas } from '@/lib/api';
import { ReservaCompleta } from '@/lib/definitions';

export default function ReservationsPage() {
    const router = useRouter();
    const [usuarioId, setUsuarioId] = useState('');
    const [reservas, setReservas] = useState<ReservaCompleta[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
                                        <Link
                                            href={`/reservations/${reserva.id}?usuarioId=${usuarioId}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Ver detalles
                                        </Link>
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
        </section>
    );
}
