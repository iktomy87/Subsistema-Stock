import { obtenerProductoPorId } from '@/lib/api';
import { ProductForm } from '../../product-form';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ExtendedSession } from '@/app/api/auth/[...nextauth]/route';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const session: ExtendedSession | null = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (!token) {
    throw new Error("No se encontró token de autenticación.");
  }

  const product = await obtenerProductoPorId(Number(id), token);

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Editar Producto</h1>
      <ProductForm initial={product} />
    </div>
  );
}
