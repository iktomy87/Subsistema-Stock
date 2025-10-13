'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProductById } from '@/lib/mock';
import { Product } from '@/lib/definitions';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/definitions';

const ProductDetailPage = () => {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const id = parseInt(params.id as string);
      const foundProduct = getProductById(id);
      setProduct(foundProduct || null);
      setLoading(false);
    }
  }, [params.id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const status = product.stockDisponible > 0 ? 'En Stock' : 'Agotado';

  return (
    <div className="container mx-auto py-10">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Productos</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.nombre}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid md:grid-cols-2 gap-8 mt-6">
        <div>
          <Card>
            <CardContent className="p-0">
              {product.imagenes && product.imagenes.length > 0 ? (
                <img
                  src={product.imagenes.find((img) => img.esPrincipal)?.url}
                  alt={product.nombre}
                  className="w-full h-auto object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{product.nombre}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 mt-2">{product.descripcion}</p>
              <div className="flex items-center mt-4">
                <span className="text-2xl font-bold">{formatCurrency(product.precio)}</span>
                <Badge variant={product.stockDisponible > 0 ? 'default' : 'destructive'} className="ml-4">
                  {status}
                </Badge>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Categorías</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product.categorias?.map((cat) => (
                    <Badge key={cat.id} variant="secondary">{cat.nombre}</Badge>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold">Detalles</h3>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  {product.pesoKg && <li>Peso: {product.pesoKg} kg</li>}
                  {product.dimensiones && (
                    <li>
                      Dimensiones: {product.dimensiones.largoCm}cm x {product.dimensiones.anchoCm}cm x {product.dimensiones.altoCm}cm
                    </li>
                  )}
                  {product.ubicacion && (
                    <li>
                      Ubicación: Almacén {product.ubicacion.almacenId}, Pasillo {product.ubicacion.pasillo}, Estantería {product.ubicacion.estanteria}, Nivel {product.ubicacion.nivel}
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;