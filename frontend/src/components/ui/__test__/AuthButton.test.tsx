import {render, screen, fireEvent } from '@testing-library/react';
import AuthButton from '../AuthButton';

jest.mock("next-auth/react", () => ({
	useSession: jest.fn(),
	signIn: jest.fn(), 
	signOut: jest.fn(),
}));

describe('AuthButton Component', () => {

  let mockUseSession: jest.Mock;
  let mockSignIn: jest.Mock;
  let mockSignOut: jest.Mock;
  
  beforeEach(() => {
    mockUseSession = require("next-auth/react").useSession as jest.Mock;
    mockSignIn = require("next-auth/react").signIn as jest.Mock;
    mockSignOut = require("next-auth/react").signOut as jest.Mock;
    jest.clearAllMocks();
  });

  it('debería mostrar "Cargando sesión..." cuando el estado es "loading"', () => {
    
    mockUseSession.mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<AuthButton />);
    
    expect(screen.getByText('Cargando sesión...')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  
  it('debería mostrar el botón de "Iniciar Sesión" y llamar a signIn al hacer click', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<AuthButton />);

    expect(screen.getByText('No has iniciado sesión')).toBeInTheDocument();

    const signInButton = screen.getByRole('button', { name: /Iniciar Sesión con Keycloak/i });
    expect(signInButton).toBeInTheDocument();
    
    fireEvent.click(signInButton);

    expect(mockSignIn).toHaveBeenCalledTimes(1);
    expect(mockSignIn).toHaveBeenCalledWith("keycloak", { callbackUrl: "/products" });
  });

  
  it('debería mostrar el nombre de usuario y el botón de "Cerrar Sesión"', () => {
    const mockUser = {
      name: "Juan Perez",
      email: "juan@ejemplo.com",
    };

    mockUseSession.mockReturnValue({
      data: { user: mockUser, expires: "1h" },
      status: "authenticated",
    });

    render(<AuthButton />);

    expect(screen.getByText(`¡Hola, ${mockUser.name}!`)).toBeInTheDocument();

    const signOutButton = screen.getByRole('button', { name: /Cerrar Sesión/i });
    expect(signOutButton).toBeInTheDocument();

    
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    expect(mockSignOut).toHaveBeenCalledWith();
  });
  
  it('debería mostrar el email si el nombre es nulo', () => {
    const mockUser = {
      name: null,
      email: "sofia@ejemplo.com",
    };

    mockUseSession.mockReturnValue({
      data: { user: mockUser, expires: "1h" },
      status: "authenticated",
    });

    render(<AuthButton />);

    expect(screen.getByText(`¡Hola, ${mockUser.email}!`)).toBeInTheDocument();
  });
  
  it('debería mostrar "Usuario" si el nombre y el email son nulos', () => {
    const mockUser = {
      name: null,
      email: null,
    };

    mockUseSession.mockReturnValue({
      data: { user: mockUser, expires: "1h" },
      status: "authenticated",
    });

    render(<AuthButton />);

    expect(screen.getByText(`¡Hola, Usuario!`)).toBeInTheDocument();
  });

});