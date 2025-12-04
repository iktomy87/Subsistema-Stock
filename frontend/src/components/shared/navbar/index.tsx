"use client"; // Necesario para usar hooks de React como useSession

import React from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Search, Bell, User, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";

// Extender el tipo Session para incluir nuestros campos personalizados
interface SessionWithRoles extends Session {
  roles?: string[];
}

const Navbar = () => {
  const { data: session, status } = useSession();

  const roles = status === "authenticated" ? (session as SessionWithRoles)?.roles || [] : [];
  const canReadUsers = roles.includes("usuarios:read");
  const canWriteUsers = roles.includes("usuarios:write");

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            {status === "authenticated" && session.user
              ? `Bienvenido, ${session.user.name || session.user.email || 'Usuario'}` // Asegura un fallback
              : "Dashboard"}
          </h1>
        </div>
        <div className="flex items-center w-1/2 justify-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full border rounded-md"
            />
          </div>
        </div>
        <div className="flex items-center">
          {/* Solo mostrar el menú de usuario si la sesión está autenticada */}
          {status === "authenticated" && session.user && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Bell className="mr-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center focus:outline-none">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full mr-2"
                    />
                  ) : (
                    <User className="mr-2" />
                  )}
                  <span className="hidden md:inline">
                    {session.user.name || session.user.email || 'Mi Cuenta'}
                  </span>
                  <ChevronDown className="ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  {/* Mostrar enlaces de administración basados en roles */}
                  {(canReadUsers || canWriteUsers) && <DropdownMenuSeparator />}
                  {canReadUsers && (
                    <DropdownMenuItem>Gestionar Usuarios</DropdownMenuItem>
                  )}
                  {canWriteUsers && <DropdownMenuItem>Crear Usuario</DropdownMenuItem>}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Configuración</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => signOut({ callbackUrl: '/' })}>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;