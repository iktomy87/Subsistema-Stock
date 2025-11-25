"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCategories, actualizarProducto, obtenerProductoPorId } from "@/lib/api";
import { Category, ProductoInput } from "@/lib/definitions";
import { productSchema } from "@/lib/schemas";

export default function EditProductPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [categories, setCategories] = useState<Category[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<ProductoInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      precio: 0,
      stockInicial: 0,
      dimensiones: { largoCm: 0, anchoCm: 0, altoCm: 0 },
      ubicacion: { street: "", city: "", state: "", postalCode: "", country: "" },
      categoriaIds: [],
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset, 
  } = form;

  useEffect(() => {
    if (session?.accessToken) {
      getCategories(session.accessToken)
        .then((data) => setCategories(data))
        .catch((err) => console.error("Error fetching categories:", err));

      if (id) {
        obtenerProductoPorId(Number(id), session.accessToken)
          .then((product) => {
            reset({
              nombre: product.nombre,
              descripcion: product.descripcion,
              precio: product.precio,
              stockInicial: product.stock,
              dimensiones: product.dimensiones || { largoCm: 0, anchoCm: 0, altoCm: 0 },
              ubicacion: product.ubicacion || { street: "", city: "", state: "", postalCode: "", country: "" },
              categoriaIds: product.categorias.map(c => c.id),
            });
          })
          .catch((err) => {
            console.error("Error fetching product:", err);
            setApiError("No se pudo cargar el producto. " + err.message);
          });
      }
    }
  }, [session, id, reset]);

  const onSubmit = async (data: ProductoInput) => {
    setApiError(null);

    try {
      await actualizarProducto(Number(id), data, session?.accessToken);
      router.push("/products");
    } catch (error) {
      console.error("Error updating product:", error);
      if (error instanceof Error) {
        setApiError(`Error al actualizar el producto: ${error.message}`);
      } else {
        setApiError("Error al actualizar el producto. Por favor, intente de nuevo.");
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Producto</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="nombre" className="text-sm font-medium">Nombre del Producto</label>
              <Input id="nombre" placeholder="Nombre del producto" {...register("nombre")} />
              {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="precio" className="text-sm font-medium">Precio</label>
              <Input id="precio" type="number" placeholder="Precio del producto" {...register("precio")} />
              {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio.message}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="stockInicial" className="text-sm font-medium">Stock</label>
              <Input id="stockInicial" type="number" placeholder="Stock del producto" {...register("stockInicial")} />
              {errors.stockInicial && <p className="text-red-500 text-xs mt-1">{errors.stockInicial.message}</p>}
            </div>
            {/* Campos para Dimensiones */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="largoCm" className="text-sm font-medium">Largo (cm)</label>
                <Input id="largoCm" type="number" placeholder="Largo" {...register("dimensiones.largoCm")} />
                {errors.dimensiones?.largoCm && <p className="text-red-500 text-xs mt-1">{errors.dimensiones.largoCm.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="anchoCm" className="text-sm font-medium">Ancho (cm)</label>
                <Input id="anchoCm" type="number" placeholder="Ancho" {...register("dimensiones.anchoCm")} />
                {errors.dimensiones?.anchoCm && <p className="text-red-500 text-xs mt-1">{errors.dimensiones.anchoCm.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="altoCm" className="text-sm font-medium">Alto (cm)</label>
                <Input id="altoCm" type="number" placeholder="Alto" {...register("dimensiones.altoCm")} />
                {errors.dimensiones?.altoCm && <p className="text-red-500 text-xs mt-1">{errors.dimensiones.altoCm.message}</p>}
              </div>
            </div>
            {/* Campos para Ubicacion */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="street" className="text-sm font-medium">Calle</label>
              <Input id="street" placeholder="Calle del almacén" {...register("ubicacion.street")} />
              {errors.ubicacion?.street && <p className="text-red-500 text-xs mt-1">{errors.ubicacion.street.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="city" className="text-sm font-medium">Ciudad</label>
                <Input id="city" placeholder="Ciudad" {...register("ubicacion.city")} />
                {errors.ubicacion?.city && <p className="text-red-500 text-xs mt-1">{errors.ubicacion.city.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="state" className="text-sm font-medium">Provincia/Estado</label>
                <Input id="state" placeholder="Provincia" {...register("ubicacion.state")} />
                {errors.ubicacion?.state && <p className="text-red-500 text-xs mt-1">{errors.ubicacion.state.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="postalCode" className="text-sm font-medium">Código Postal (CPA)</label>
                <Input
                  id="postalCode"
                  placeholder="Código Postal (Ej: C1024AAB)"
                  {...register("ubicacion.postalCode")}
                />
                {errors.ubicacion?.postalCode && <p className="text-red-500 text-xs mt-1">{errors.ubicacion.postalCode.message}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="country" className="text-sm font-medium">País (código 2 letras)</label>
                <Input
                  id="country"
                  placeholder="País (Ej: AR)"
                  {...register("ubicacion.country")}
                  maxLength={2}
                />
                {errors.ubicacion?.country && <p className="text-red-500 text-xs mt-1">{errors.ubicacion.country.message}</p>}
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="description" className="text-sm font-medium">Descripción</label>
              <Textarea id="description" placeholder="Descripción del producto" {...register("descripcion")} />
              {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion.message}</p>}
            </div>
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="category" className="text-sm font-medium">Categoría</label>
              <Select onValueChange={(value) => form.setValue("categoriaIds", [Number(value)])} disabled={isSubmitting}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoriaIds && <p className="text-red-500 text-xs mt-1">{errors.categoriaIds.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          {apiError && <p className="text-red-500 text-sm mb-4">{apiError}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
