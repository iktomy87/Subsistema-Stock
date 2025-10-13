export interface Dimensiones {
  largoCm: number;
  anchoCm: number;
  altoCm: number;
}

export interface UbicacionAlmacen {
  almacenId: number;
  pasillo: string;
  estanteria: string;
  nivel: number;
}

export interface ImagenProducto {
  url: string;
  esPrincipal: boolean;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stockDisponible: number;
  pesoKg?: number;
  dimensiones?: Dimensiones;
  ubicacion?: UbicacionAlmacen;
  imagenes?: ImagenProducto[];
  categorias?: Category[];
}

export const getCategory = (id: number, cats: Category[]) => {
  return cats.find((cat) => cat.id === id);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};
