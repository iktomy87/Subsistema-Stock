import { getSession } from 'next-auth/react';
import { PaginatedProducts, Category, Product, ReservaInput, ReservaOutput, ReservaCompleta, CancelacionReservaInput, ActualizarReservaInput, ProductoInput, ProductoUpdate, ProductoCreado, CategoriaInput, PaginatedReservas } from './definitions';

// IMPORTANTE: En el servidor necesitamos URL absoluta, en el cliente usamos rutas relativas
// Las API routes manejan la autenticación y hacen proxy al backend
function getApiBaseUrl() {
    if (typeof window === 'undefined') {
        // Server-side: Vercel u otro entorno serverless
        if (process.env.VERCEL_URL) {
            return `https://${process.env.VERCEL_URL}`;
        }
        // Fallback para otros entornos (ej. Docker) o si NEXTAUTH_URL está explícitamente seteado
        return process.env.NEXTAUTH_URL || 'http://localhost:8080';
    }
    // Client-side: usar ruta relativa (mismo origen)
    return '';
}

const API_BASE_URL = getApiBaseUrl();

interface SessionWithToken {
    accessToken?: string;
}

async function fetcher<T>(url: string, options: RequestInit = {}, token?: string | null): Promise<T> {
    try {
        let sessionToken = token; // Usar el token pasado si existe

        // Si no se pasó un token, intentar obtenerlo de la sesión (lado cliente)
        if (sessionToken === undefined) {
            const session = await getSession() as SessionWithToken | null;
            sessionToken = session?.accessToken;
        }


        const newOptions = { ...options };
        newOptions.headers = { ...newOptions.headers } as Record<string, string>;

        if (sessionToken) { // Usar la variable sessionToken
            newOptions.headers['Authorization'] = `Bearer ${sessionToken}`;
        }

        // No establecer Content-Type si el body es FormData
        if (newOptions.body && !(newOptions.body instanceof FormData)) {
            if (!newOptions.headers['Content-Type']) {
                newOptions.headers['Content-Type'] = 'application/json';
            }
        }

        const response = await fetch(url, newOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`HTTP error! status: ${response.status}`, errorBody);
            throw new Error(`Error en la petición: ${response.statusText}`);
        }

        if (response.status === 204) {
            return undefined as T;
        }

        return response.json();

    } catch (error) {
        console.error("Error en fetcher:", error);
        throw error;
    }
}

// ===== Productos =====
interface BackendPaginatedProducts {
    items?: Product[];
    data?: Product[];
    total?: number;
    meta?: {
        totalItems?: number;
        currentPage?: number;
        itemsPerPage?: number;
    };
    page?: number;
    limit?: number;
}

export async function listarProductos(
    page: number = 1,
    limit: number = 10,
    q: string = '',
    categoriaId?: number
): Promise<PaginatedProducts> {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (q) {
        params.append('q', q);
    }

    if (categoriaId) {
        params.append('categoriaId', categoriaId.toString());
    }

    const data = await fetcher<BackendPaginatedProducts>(`${API_BASE_URL}/api/productos?${params.toString()}`, { cache: 'no-store' });

    return {
        items: data.items ?? data.data ?? [],
        total: data.total ?? data.meta?.totalItems ?? 0,
        page: data.page ?? data.meta?.currentPage ?? page,
        limit: data.limit ?? data.meta?.itemsPerPage ?? limit,
    };
}


export async function obtenerProductoPorId(id: number, token?: string | null): Promise<Product> {
    // Pasar el token a fetcher
    return fetcher<Product>(`${API_BASE_URL}/api/productos/${id}`, { cache: 'no-store' }, token);
}

export async function crearProducto(
    productData: ProductoInput,
    token?: string
): Promise<ProductoCreado> {
    // Paso 1: Crear el producto con los datos de texto/numéricos.
    return fetcher<ProductoCreado>(`${API_BASE_URL}/api/productos`, {
        method: 'POST',
        body: JSON.stringify(productData),
        headers: {
            'Content-Type': 'application/json',
        }
    }, token);
}

export async function uploadImage(productId: number, image: File, token?: string): Promise<void> {
    const formData = new FormData();
    // El nombre 'file' debe coincidir con el que espera el backend (usualmente definido en el FileInterceptor)
    formData.append('file', image);

    // Asumimos que el endpoint del backend es /productos/{id}/upload
    return fetcher<void>(`${API_BASE_URL}/api/productos/${productId}/upload`, {
        method: 'POST',
        body: formData,
    }, token);
}

export async function actualizarProducto(id: number, body: ProductoUpdate): Promise<Product> {
    return fetcher<Product>(`${API_BASE_URL}/api/productos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
}

export async function eliminarProducto(id: number) {
    return fetcher<void>(`${API_BASE_URL}/api/productos/${id}`, { method: 'DELETE' });
}

// ===== Categorías =====
// Agregar esta versión mejorada al archivo lib/api.ts

export async function getCategories(token?: string): Promise<Category[]> {
    try {
        console.log('getCategories called with token:', !!token);
        
        // En el servidor, pasar el token en el header
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const url = `${API_BASE_URL}/api/categorias`;
        console.log('Fetching categories from:', url);
        
        const response = await fetch(url, { 
            cache: 'no-store',
            headers,
        });
        
        console.log('Categories response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Categories fetch error:', response.status, errorText);
            throw new Error(`Error al obtener categorías: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categories fetched:', Array.isArray(data) ? data.length : 'not an array');
        
        return data;
    } catch (error) {
        console.error('Error in getCategories:', error);
        throw error;
    }
}

export async function obtenerCategoriaPorId(id: number): Promise<Category> {
    return fetcher<Category>(`${API_BASE_URL}/api/categorias/${id}`, { cache: 'no-store' });
}

export async function crearCategoria(body: CategoriaInput): Promise<Category> {
    return fetcher<Category>(`${API_BASE_URL}/api/categorias`, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

export async function actualizarCategoria(id: number, body: CategoriaInput): Promise<Category> {
    return fetcher<Category>(`${API_BASE_URL}/api/categorias/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
}

export async function eliminarCategoria(id: number, token?: string) {
    return fetcher<void>(`${API_BASE_URL}/api/categorias/${id}`, { method: 'DELETE' }, token);
}

// ===== Reservas =====
interface BackendPaginatedReservas {
    items?: ReservaCompleta[];
    data?: ReservaCompleta[];
    total?: number;
    meta?: {
        totalItems?: number;
        currentPage?: number;
        itemsPerPage?: number;
    };
    page?: number;
    limit?: number;
}

export async function listarReservas(
    usuarioId: number,
    page: number = 1,
    limit: number = 10,
    estado?: 'confirmado' | 'pendiente' | 'cancelado'
): Promise<PaginatedReservas> {
    const params = new URLSearchParams({
        usuarioId: usuarioId.toString(),
        page: page.toString(),
        limit: limit.toString(),
    });
    if (estado) {
        params.append('estado', estado);
    }

    const data = await fetcher<BackendPaginatedReservas>(`${API_BASE_URL}/api/reservas?${params.toString()}`, { cache: 'no-store' });

    return {
        items: data.items ?? data.data ?? [],
        total: data.total ?? data.meta?.totalItems ?? 0,
        page: data.page ?? data.meta?.currentPage ?? page,
        limit: data.limit ?? data.meta?.itemsPerPage ?? limit,
    };
}

export async function obtenerReservaPorId(idReserva: number, usuarioId: number, token?: string | null): Promise<ReservaCompleta> {
    const params = new URLSearchParams({
        usuarioId: usuarioId.toString(),
    });
    return fetcher<ReservaCompleta>(`${API_BASE_URL}/api/reservas/${idReserva}?${params.toString()}`, { cache: 'no-store' }, token);
}

export async function crearReserva(input: ReservaInput): Promise<ReservaOutput> {
    return fetcher<ReservaOutput>(`${API_BASE_URL}/api/reservas`, {
        method: 'POST',
        body: JSON.stringify(input),
    });
}

export async function actualizarReserva(idReserva: number, input: ActualizarReservaInput): Promise<ReservaCompleta> {
    return fetcher<ReservaCompleta>(`${API_BASE_URL}/api/reservas/${idReserva}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });
}

export async function cancelarReserva(idReserva: number, input: CancelacionReservaInput, token?: string | null): Promise<void> {
    return fetcher<void>(`${API_BASE_URL}/api/reservas/${idReserva}`, {
        method: 'DELETE',
        body: JSON.stringify(input),
    }, token);
}
