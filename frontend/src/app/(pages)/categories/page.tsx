import { getCategories } from "@/lib/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Definir la Server Action fuera del componente
async function handleDelete(formData: FormData) {
    "use server";
    
    const categoryId = formData.get('categoryId') as string;
    
    try {
        const session: Session | null = await getServerSession(authOptions);
        
        if (!session?.accessToken) {
            throw new Error('No autorizado');
        }

        // Importar dinámicamente para evitar problemas de build
        const { eliminarCategoria } = await import("@/lib/api");
        
        await eliminarCategoria(Number(categoryId), session.accessToken);
        
        // Revalidar la página para reflejar cambios
        revalidatePath('/categories');
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        throw error;
    }
}

export default async function CategoriesPage() {
    console.log('=== Categories Page Debug ===');
    const session: Session | null = await getServerSession(authOptions);
    console.log('Session exists:', !!session);
    console.log('Access token exists:', !!session?.accessToken);
    
    let cats = [];
    let error = null;
    
    try {
        cats = await getCategories(session?.accessToken);
        console.log('Categories loaded:', cats.length);
    } catch (err) {
        console.error('Error cargando categorías:', err);
        error = err instanceof Error ? err.message : 'Error al cargar las categorías';
    }

    return (
        <section className="space-y-4">
            <header className="flex items-center">
                <h1 className="text-xl font-semibold">Categorías</h1>
                <a href="/categories/new" className="ml-auto border px-3 py-1 rounded">Nueva</a>
            </header>

            {error && (
                <div className="text-red-500 border border-red-300 rounded p-4 bg-red-50">
                    {error}
                </div>
            )}

            {!error && cats.length === 0 ? (
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
                                    <form action={handleDelete}>
                                        <input type="hidden" name="categoryId" value={c.id} />
                                        <button 
                                            type="submit"
                                            className="underline text-red-700 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
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
