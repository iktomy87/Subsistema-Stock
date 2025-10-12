import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Sistema de Gestión de Stock
          </CardTitle>
          <CardDescription className="text-lg pt-2">
            Una solución integral para la administración de tu inventario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-300">
            Bienvenido al panel de control. Desde aquí podrás gestionar productos,
            categorías, y realizar un seguimiento de las reservas de stock de
            manera eficiente.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild size="lg">
            <Link href="/products">Ir al Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}