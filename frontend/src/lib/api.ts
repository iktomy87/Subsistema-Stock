import { PaginatedProducts, Category, Product, ReservaCreateInput, ReservaInfo } from './definitions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:3000/api';

// ===== Productos =====
export async function getProduct(id: number): Promise<Product> {
    return fetcher<Product>(`${API_BASE_URL}/productos/${id}`, { cache: 'no-store' });
}
export async function createProduct(body: Partial<Product>) {
    return fetcher<Product>(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}
export async function updateProduct(id: number, body: Partial<Product>) {
    return fetcher<Product>(`${API_BASE_URL}/productos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}
export async function deleteProduct(id: number) {
    return fetcher<void>(`${API_BASE_URL}/productos/${id}`, { method: 'DELETE' });
}

// ===== Categorías =====
export async function createCategory(body: Partial<Category>) {
    return fetcher<Category>(`${API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}
export async function updateCategory(id: number, body: Partial<Category>) {
    return fetcher<Category>(`${API_BASE_URL}/categorias/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}
export async function deleteCategory(id: number) {
    return fetcher<void>(`${API_BASE_URL}/categorias/${id}`, { method: 'DELETE' });
}

// ===== Reservas (rutas reales del backend) =====
export async function createReservation(input: ReservaCreateInput) {
    return fetcher<ReservaInfo>(`${API_BASE_URL}/reservas/reservar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
}
export async function getReservation(idReserva: number) {
    return fetcher<ReservaInfo>(`${API_BASE_URL}/reservas/reservas/${idReserva}`, { cache: 'no-store' });
}
export async function releaseReservation(idReserva: number) {
    // El back exige body con idReserva + estado + expiresAt
    return fetcher<ReservaInfo>(`${API_BASE_URL}/reservas/liberar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            idReserva,
            estado: "LIBERADA",
            expiresAt: new Date().toISOString(),
        }),
    });
}
