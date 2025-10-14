export default function ReservationsPage() {
    return (
        <section className="space-y-4">
            <header className="flex items-center">
                <h1 className="text-xl font-semibold">Reservas</h1>
                <a href="/reservations/new" className="ml-auto border px-3 py-1 rounded">Nueva</a>
            </header>

            <form className="flex items-end gap-2" action={(fd) => {
                "use server";
                const id = String(fd.get("id") || "");
                if (id) return Response.redirect(`/reservations/${id}`);
                return null;
            }}>
                <div className="flex flex-col">
                    <label className="text-sm">Consultar por ID</label>
                    <input name="id" className="border rounded px-2 py-1" placeholder="e.g. 123" />
                </div>
                <button className="border px-3 py-1 rounded" formAction={undefined}>Ver</button>
            </form>
        </section>
    );
}
