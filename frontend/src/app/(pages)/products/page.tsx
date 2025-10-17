'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { listarProductos, getCategories, eliminarProducto } from '@/lib/api';
import { Product, Category } from '@/lib/definitions';
import { ProductRow } from '@/components/shared/ProductRow';
import { ConfirmModal } from '@/components/shared/ConfirmModal';

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoryId = categoryFilter !== 'all' ? parseInt(categoryFilter) : undefined;
      const paginatedProducts = await listarProductos(currentPage, 10, searchTerm, categoryId);
      setProducts(paginatedProducts.items);
      setTotalPages(Math.ceil(paginatedProducts.total / 10));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, categoryFilter]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    router.push(`/products/${product.id}/edit`);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedProduct) {
      try {
        await eliminarProducto(selectedProduct.id);
        fetchProducts(); // Refetch products after deletion
      } catch (error) {
        console.error('Error deleting product:', error);
      }
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const SkeletonRow = () => (
    <TableRow>
      <TableCell className="h-12 w-12 animate-pulse rounded-md bg-gray-200"></TableCell>
      <TableCell className="h-4 w-1/4 animate-pulse rounded-md bg-gray-200"></TableCell>
      <TableCell className="h-4 w-1/4 animate-pulse rounded-md bg-gray-200"></TableCell>
      <TableCell className="h-4 w-1/6 animate-pulse rounded-md bg-gray-200"></TableCell>
      <TableCell className="h-4 w-1/6 animate-pulse rounded-md bg-gray-200"></TableCell>
      <TableCell className="h-4 w-1/12 animate-pulse rounded-md bg-gray-200"></TableCell>
    </TableRow>
  );

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select onValueChange={setCategoryFilter} value={categoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => router.push('/products/new')}>Agregar Producto</Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : products.length > 0 ? (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
      <ConfirmModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="¿Estás seguro?"
        description={`Esta acción eliminará permanentemente el producto "${selectedProduct?.nombre}".`}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default ProductsPage;
