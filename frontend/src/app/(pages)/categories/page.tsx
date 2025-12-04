import { getCategories, eliminarCategoria } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions, ExtendedSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
    const session: ExtendedSession | null = await getServerSession(authOptions) as ExtendedSession | null;
    const cats = await getCategories(session?.accessToken);

    return (
        <section className="space-y-4">
            <header className="flex items-center">
                <h1 className="text-xl font-semibold">Categorías</h1>
                <a href="/categories/new" className="ml-auto border px-3 py-1 rounded">Nueva</a>
            </header>

            {cats.length === 0 ? (
                <div className="text-sm text-gray-500 border rounded p-6">No hay categorías.</div>
            ) : (
                <table className="w-full border rounded">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-2 text-left">Nombre</th>
                            <th className="p-2 w-40"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cats.map(c => (
                            <tr key={c.id} className="border-t">
                                <td className="p-2">{c.nombre}</td>
                                <td className="p-2 text-right">
                                    {/* Si luego agregás editar: <a className="underline mr-3" href={`/categories/${c.id}/edit`}>Editar</a> */}
                                    <form action={async () => {
                                        "use server";
                                        const session: ExtendedSession | null = await getServerSession(authOptions) as ExtendedSession | null;
                                        await eliminarCategoria(c.id, session?.accessToken);
                                        redirect("/categories");
                                    }}>
                                        <button className="underline text-red-700">Eliminar</button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}
