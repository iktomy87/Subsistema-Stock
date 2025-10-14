import { z } from "zod";

export const productSchema = z.object({
    nombre: z.string().min(2, "Mínimo 2 caracteres"),
    descripcion: z.string().optional(),
    precio: z.coerce.number().nonnegative("≥ 0"),
    stock: z.coerce.number().int().nonnegative("Entero ≥ 0"),
    categoriaId: z.coerce.number().int("Elegí una categoría"),
    activo: z.boolean().default(true),
});
export type ProductInput = z.infer<typeof productSchema>;

export const categorySchema = z.object({
    nombre: z.string().min(2, "Mínimo 2 caracteres"),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const reservationSchema = z.object({
    idCompra: z.string().min(1, "Obligatorio"),
    productos: z.array(
        z.object({
            idProducto: z.coerce.number().int().positive(),
            cantidad: z.coerce.number().int().positive(),
        })
    ).min(1, "Agregá al menos un producto"),
});
export type ReservationInput = z.infer<typeof reservationSchema>;
