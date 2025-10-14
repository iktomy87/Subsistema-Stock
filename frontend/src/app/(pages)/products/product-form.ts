"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductInput } from "@/src/lib/schemas";
import { createProduct, updateProduct, getCategories } from "@/src/lib/api";
import type { Category, Product } from "@/src/lib/definitions";

export function ProductForm({ initial }: { initial?: Product }) {
    const router = useRouter();
    const [cats, setCats] = useState<Category[]>([]);

    const form = useForm<ProductInput>({
        resolver: zodResolver(productSchema),
        defaultValues: initial
            ? {
                nombre: initial.nombre,
                descripcion: initial.descripcion ?? "",
                precio: initial.precio,
                stock: initial.stock,
                categoriaId: initial.categoria.id,
                activo: initial.activo,
            }
            : { nombre: "", descripcion: "", precio: 0, stock: 0, categoriaId: 0, activo: true },
    });

    useEffect(() => {
        getCategories().then(setCats).catch(console.error);
    }, []);

    const onSubmit = async (values: ProductInput) => {
        try {
            if (initial) await updateProduct(initial.id, values);
            else await createProduct(values);
            router.push("/products");
        } catch (e: any) {
            alert(e.message || "Error al guardar");
        }
    };

    const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

    return (
        <form onSubmit= { handleSubmit(onSubmit) } className = "space-y-3 max-w-xl" >
            <div>
            <label className="text-sm" > Nombre < /label>
                < input className = "border rounded w-full px-2 py-1" {...register("nombre") } />
    {
        errors.nombre && <p className="text-red-600 text-sm" > { errors.nombre.message } < /p>}
            < /div>
            < div >
            <label className="text-sm" > Descripci�n < /label>
                < textarea className = "border rounded w-full px-2 py-1" rows = { 3} {...register("descripcion") } />
                    < /div>
                    < div className = "grid grid-cols-2 gap-3" >
                        <div>
                        <label className="text-sm" > Precio < /label>
                            < input type = "number" step = "0.01" className = "border rounded w-full px-2 py-1" {...register("precio") } />
        {
            errors.precio && <p className="text-red-600 text-sm" > { errors.precio.message } < /p>}
                < /div>
                < div >
                <label className="text-sm" > Stock < /label>
                    < input type = "number" className = "border rounded w-full px-2 py-1" {...register("stock") } />
            {
                errors.stock && <p className="text-red-600 text-sm" > { errors.stock.message } < /p>}
                    < /div>
                    < /div>
                    < div >
                    <label className="text-sm" > Categor�a < /label>
                        < select className = "border rounded w-full px-2 py-1" {...register("categoriaId") }>
                            <option value="" > Seleccion�</option>
                {
                    cats.map(c => <option key={ c.id } value = { c.id } > { c.nombre } < /option>)}
                        < /select>
        {
                            errors.categoriaId && <p className="text-red-600 text-sm"> { errors.categoriaId.message } < /p>}
                                < /div>
                                < label className="inline-flex items-center gap-2" >
                                <input type="checkbox" { ...register("activo") } /> Activo
                                    < /label>

                                    < div className="pt-2 flex gap-2" >
                                    <button disabled={ isSubmitting } className = "border px-3 py-1 rounded" > { initial? "Guardar": "Crear" } < /button>
                                    < a className = "border px-3 py-1 rounded" href = "/products" > Cancelar < /a>
                                    < /div>
                                    < /form>
                    );
                }
