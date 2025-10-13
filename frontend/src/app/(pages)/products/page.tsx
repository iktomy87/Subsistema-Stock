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
import { mockProducts } from '@/lib/mock';
import { mockCategories } from '@/lib/mock';
import { Product } from '@/lib/definitions';
import { ProductRow } from '@/components/shared/ProductRow';
import { ConfirmModal } from '@/components/shared/ConfirmModal';

const ITEMS_PER_PAGE = 10;

const ProductsPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    let updatedProducts = products;

    if (searchTerm) {
      updatedProducts = updatedProducts.filter((product) =>
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      updatedProducts = updatedProducts.filter((product) =>
        product.categorias?.some(cat => cat.id === parseInt(categoryFilter))
      );
    }

    setFilteredProducts(updatedProducts);
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, products]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (product: Product) => {
    router.push(`/products/${product.id}`);
  };

  const handleEdit = (product: Product) => {
    console.log('Edit:', product);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      const updatedProducts = products.filter(
        (p) => p.id !== selectedProduct.id
      );
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
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
              {mockCategories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button>Agregar Producto</Button>
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
            ) : paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
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