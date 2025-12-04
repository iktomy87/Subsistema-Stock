import { obtenerReservaPorId, cancelarReserva } from "@/lib/api";
import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface CustomSession extends Session {
    accessToken?: string;
}

export default async function ReservationDetailPage({
    params,
    searchParams
}: {
    params: { id: string };
    searchParams: { usuarioId?: string };
}) {
    const session: CustomSession | null = await getServerSession(authOptions);
    const token = session?.accessToken;

    const idReserva = Number(params.id);
    const usuarioId = Number(searchParams.usuarioId);

    if (!usuarioId) {
        redirect('/reservations');
    }

    const info = await obtenerReservaPorId(idReserva, usuarioId, token);

    return (
        <section className="space-y-4">
            <h1 className="text-xl font-semibold">Reserva #{info.idReserva}</h1>
            <p className="text-sm">ID Compra: <b>{info.idCompra}</b></p>
            <p className="text-sm">Estado: <b>{info.estado}</b></p>
            <p className="text-sm">Usuario ID: <b>{usuarioId}</b></p>
            <p className="text-sm">Expira: {new Date(info.expiresAt).toLocaleString()}</p>

            {info.detalles && info.detalles.length > 0 && (
                <div>
                    <h2 className="font-semibold mb-2">Productos Reservados:</h2>
                    <ul className="list-disc list-inside">
                        {info.detalles.map((detalle) => (
                            <li key={detalle.id}>
                                Producto ID {detalle.productoId} - Cantidad: {detalle.cantidad}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <form action={async () => {
                "use server";
                const session: CustomSession | null = await getServerSession(authOptions);
                const token = session?.accessToken;
                await cancelarReserva(idReserva, { motivoCancelacion: 'Cancelado desde la UI' }, token);
                redirect(`/reservations`);
            }}>
                <button className="border px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">
                    Liberar Reserva
                </button>
            </form>
        </section>
    );
}