import { PaginatedProducts, Category } from './definitions';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:3000/api';

// Helper function to handle API responses
async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody.message || 'Failed to fetch data');
    }
    return res.json();
  } catch (error) {
    console.error('API Fetcher Error:', error);
    // In a real app, you'd want to handle this more gracefully
    // For now, we'll re-throw to let the component handle it.
    throw error;
  }
}

// Fetch products with pagination and filtering
export async function getProducts(
  page: number = 1,
  limit: number = 10,
  nombre?: string,
  categoriaId?: number
): Promise<PaginatedProducts> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (nombre) params.append('nombre', nombre);
  if (categoriaId) params.append('categoriaId', categoriaId.toString());

  const url = `${API_BASE_URL}/productos?${params.toString()}`;
  return fetcher<PaginatedProducts>(url, { cache: 'no-store' }); // Use no-store to ensure fresh data
}

// Fetch all active categories
export async function getCategories(): Promise<Category[]> {
  const url = `${API_BASE_URL}/categorias`;
  return fetcher<Category[]>(url, { cache: 'no-store' });
}
