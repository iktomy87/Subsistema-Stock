import { getReservation, releaseReservation } from "@/lib/api";


export default async function ReservationDetailPage({ params }: { params: { id: string } }) {
    const idReserva = Number(params.id);
    const info = await getReservation(idReserva);

    return (
        <section className="space-y-4">
            <h1 className="text-xl font-semibold">Reserva #{info.idReserva}</h1>
            <p className="text-sm">Estado: <b>{info.estado}</b></p>
            <p className="text-sm">Expira: {new Date(info.expiresAt).toLocaleString()}</p>

            <form action={async () => {
                "use server";
                await releaseReservation(idReserva);
                return Response.redirect(`/reservations/${idReserva}`);
            }}>
                <button className="border px-3 py-1 rounded">Liberar</button>
            </form>
        </section>
    );
}
