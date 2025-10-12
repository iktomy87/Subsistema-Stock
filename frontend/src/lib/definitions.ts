export type Category = {
  id: number;
  nombre: string;
};

export type ProductImage = {
  id: number;
  url: string;
};

export type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: Category;
  imagenes: ProductImage[];
  activo: boolean;
};

// Type for paginated product response from the API
export type PaginatedProducts = {
  data: Product[];
  total: number;
  page: number;
  limit: number;
};
