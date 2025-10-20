import { PaginatedProducts, Category, Product, ReservaInput, ReservaOutput, ReservaCompleta, CancelacionReservaInput, ActualizarReservaInput, ProductoInput, ProductoUpdate, ProductoCreado, CategoriaInput, PaginatedReservas } from './definitions';

const API_BASE_URL = typeof window === 'undefined' 
    ? process.env.NEXT_PUBLIC_API_URL || 'http://backend:3000' 
    : '/api';

async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
        const response = await fetch(url, options);

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
    
    // Usamos <any> porque la estructura de la respuesta del backend puede variar.
    const data = await fetcher<any>(`${API_BASE_URL}/productos?${params.toString()}`, { cache: 'no-store' });

    // Adaptamos la estructura del backend a nuestra interfaz PaginatedProducts.
    // Esto nos da flexibilidad si el backend cambia.
    return {
        items: data.items ?? data.data ?? [],
        total: data.total ?? data.meta?.totalItems ?? 0,
        page: data.page ?? data.meta?.currentPage ?? page,
        limit: data.limit ?? data.meta?.itemsPerPage ?? limit,
    };
}


export async function obtenerProductoPorId(id: number): Promise<Product> {
    return fetcher<Product>(`${API_BASE_URL}/productos/${id}`, { cache: 'no-store' });
}

export async function crearProducto(body: ProductoInput): Promise<ProductoCreado> {
    return fetcher<ProductoCreado>(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

export async function actualizarProducto(id: number, body: ProductoUpdate): Promise<Product> {
    return fetcher<Product>(`${API_BASE_URL}/productos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

export async function eliminarProducto(id: number) {
    return fetcher<void>(`${API_BASE_URL}/productos/${id}`, { method: 'DELETE' });
}

// ===== Categorías =====
export async function getCategories(): Promise<Category[]> {
    return fetcher<Category[]>(`${API_BASE_URL}/categorias`, { cache: 'no-store' });
}

export async function obtenerCategoriaPorId(id: number): Promise<Category> {
    return fetcher<Category>(`${API_BASE_URL}/categorias/${id}`, { cache: 'no-store' });
}

export async function crearCategoria(body: CategoriaInput): Promise<Category> {
    return fetcher<Category>(`${API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

export async function actualizarCategoria(id: number, body: CategoriaInput): Promise<Category> {
    return fetcher<Category>(`${API_BASE_URL}/categorias/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

export async function eliminarCategoria(id: number) {
    return fetcher<void>(`${API_BASE_URL}/categorias/${id}`, { method: 'DELETE' });
}

// ===== Reservas =====
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
    
    const data = await fetcher<any>(`${API_BASE_URL}/reservas?${params.toString()}`, { cache: 'no-store' });

    return {
        items: data.items ?? data.data ?? [],
        total: data.total ?? data.meta?.totalItems ?? 0,
        page: data.page ?? data.meta?.currentPage ?? page,
        limit: data.limit ?? data.meta?.itemsPerPage ?? limit,
    };
}

export async function obtenerReservaPorId(idReserva: number): Promise<ReservaCompleta> {
    const params = new URLSearchParams({
        // usuarioId: usuarioId.toString(),
    });
    return fetcher<ReservaCompleta>(`${API_BASE_URL}/reservas/${idReserva}?${params.toString()}`, { cache: 'no-store' });
}

export async function crearReserva(input: ReservaInput): Promise<ReservaOutput> {
    return fetcher<ReservaOutput>(`${API_BASE_URL}/reservas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
}

export async function actualizarReserva(idReserva: number, input: ActualizarReservaInput): Promise<ReservaCompleta> {
    return fetcher<ReservaCompleta>(`${API_BASE_URL}/reservas/${idReserva}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
}

export async function cancelarReserva(idReserva: number, input: CancelacionReservaInput): Promise<void> {
    return fetcher<void>(`${API_BASE_URL}/reservas/${idReserva}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
}
