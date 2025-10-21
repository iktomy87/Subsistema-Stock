// frontend/src/app/page.tsx
"use client"; // Marcar como componente de cliente para usar hooks

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthButton from "@/components/ui/AuthButton"; // Importar el componente de autenticación

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">
            Sistema de Gestión de Stock 📦
          </CardTitle>
          <CardDescription className="text-lg pt-2">
            Por favor, inicia sesión para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {/* Usar el componente AuthButton que maneja el estado de sesión */}
          <AuthButton />
        </CardContent>
        {/* Puedes remover el CardFooter o dejarlo vacío si ya no es necesario */}
        {/* <CardFooter className="flex justify-center"></CardFooter> */}
      </Card>
    </main>
  );
}