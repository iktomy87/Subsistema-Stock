import { obtenerReservaPorId, cancelarReserva } from "@/lib/api";
import { redirect } from "next/navigation";
import { getServerSession } from 'next-auth/next';
import { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

interface CustomSession extends Session {
    accessToken?: string;
}

export default async function ReservationDetailPage({ params }: { params: { id: string } }) {
    const session: CustomSession | null = await getServerSession(authOptions);
    const token = session?.accessToken;

    const idReserva = Number(params.id);
    // TODO: Get usuarioId from session
    const usuarioId = 2;
    const info = await obtenerReservaPorId(idReserva, usuarioId, token);

    return (
        <section className="space-y-4">
            <h1 className="text-xl font-semibold">Reserva #{info.idReserva}</h1>
            <p className="text-sm">Estado: <b>{info.estado}</b></p>
            <p className="text-sm">Expira: {new Date(info.expiresAt).toLocaleString()}</p>

            <form action={async () => {
                "use server";
                const session: CustomSession | null = await getServerSession(authOptions);
                const token = session?.accessToken;
                await cancelarReserva(idReserva, { motivoCancelacion: 'Cancelado desde la UI' }, token);
                redirect(`/reservations`);
            }}>
                <button className="border px-3 py-1 rounded">Liberar</button>
            </form>
        </section>
    );
}