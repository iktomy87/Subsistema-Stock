import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import type { Category } from "@/lib/definitions";

export const dynamic = "force-dynamic";

// Función para obtener categorías directamente del backend
async function fetchCategoriesFromBackend(token: string): Promise<Category[]> {
    try {
        console.log('Fetching categories from backend with token:', !!token);
        
        const response = await fetch('https://api.cubells.com.ar/stock/categorias', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        console.log('Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', response.status, errorText);
            throw new Error(`Error del backend: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Categories fetched:', Array.isArray(data) ? data.length : 'not an array');
        
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

// Función para eliminar categoría directamente del backend
async function deleteCategoryFromBackend(categoryId: number, token: string): Promise<void> {
    const response = await fetch(`https://api.cubells.com.ar/stock/categorias/${categoryId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error al eliminar: ${response.status}`);
    }
}

// Server Action para eliminar
async function handleDelete(formData: FormData) {
    "use server";
    
    const categoryId = formData.get('categoryId') as string;
    
    try {
        const session: Session | null = await getServerSession(authOptions);
        
        if (!session?.accessToken) {
            throw new Error('No autorizado');
        }

        await deleteCategoryFromBackend(Number(categoryId), session.accessToken);
        
        // Revalidar la página
        revalidatePath('/categories');
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        throw error;
    }
}

export default async function CategoriesPage() {
    console.log('=== Categories Page Render ===');
    
    const session: Session | null = await getServerSession(authOptions);
    console.log('Session exists:', !!session);
    console.log('Access token exists:', !!session?.accessToken);
    
    let cats: Category[] = [];
    let error: string | null = null;
    
    // Verificar si hay sesión
    if (!session?.accessToken) {
        error = 'No hay sesión activa. Por favor, inicia sesión.';
    } else {
        try {
            cats = await fetchCategoriesFromBackend(session.accessToken);
            console.log('Categories loaded successfully:', cats.length);
        } catch (err) {
            console.error('Error cargando categorías:', err);
            error = err instanceof Error ? err.message : 'Error al cargar las categorías';
        }
    }

    return (
        <section className="space-y-4">
            <header className="flex items-center">
                <h1 className="text-xl font-semibold">Categorías</h1>
                <a href="/categories/new" className="ml-auto border px-3 py-1 rounded hover:bg-gray-50">
                    Nueva
                </a>
            </header>

            {error && (
                <div className="text-red-500 border border-red-300 rounded p-4 bg-red-50">
                    <p className="font-semibold">Error:</p>
                    <p>{error}</p>
                </div>
            )}

            {!error && cats.length === 0 ? (
                <div className="text-sm text-gray-500 border rounded p-6">
                    No hay categorías.
                </div>
            ) : (
                <div className="border rounded overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-left font-medium">ID</th>
                                <th className="p-3 text-left font-medium">Nombre</th>
                                <th className="p-3 text-right font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cats.map(c => (
                                <tr key={c.id} className="border-t hover:bg-gray-50">
                                    <td className="p-3">{c.id}</td>
                                    <td className="p-3">{c.nombre}</td>
                                    <td className="p-3 text-right">
                                        <form action={handleDelete} className="inline">
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
                </div>
            )}
        </section>
    );
}
