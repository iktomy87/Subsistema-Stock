import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from '../checkbox';

describe('Checkbox Component', () => {

  it('debería renderizarse en el DOM', () => {
    render(<Checkbox aria-label="Aceptar términos" />);
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('debería estar sin marcar (unchecked) por defecto', () => {
    render(<Checkbox aria-label="Notificación" />);
    const checkbox = screen.getByRole('checkbox');
    
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
  });

  it('debería cambiar de estado al hacer clic', async () => {
    const user = userEvent.setup();
    const mockOnCheckedChange = jest.fn();

    render(
      <Checkbox
        aria-label="Toggle"
        onCheckedChange={mockOnCheckedChange}
        
      />
    );

    const checkbox = screen.getByRole('checkbox');

    await user.click(checkbox);

    expect(mockOnCheckedChange).toHaveBeenCalledTimes(1);
  });

  it('debería renderizarse como deshabilitado cuando se pasa la propiedad disabled', () => {
    render(<Checkbox aria-label="No disponible" disabled />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeDisabled();
  });

  it('no debería cambiar de estado cuando está deshabilitado', async () => {
    const user = userEvent.setup();
    const mockOnCheckedChange = jest.fn();

    render(
      <Checkbox
        aria-label="Deshabilitado"
        disabled
        onCheckedChange={mockOnCheckedChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');

	await user.click(checkbox);

    expect(mockOnCheckedChange).not.toHaveBeenCalled();
    
    expect(checkbox).not.toBeChecked();
  });

  it('debería estar marcado (checked) cuando se pasa la prop checked o defaultChecked', () => {
    render(<Checkbox aria-label="Marcado" defaultChecked />);
    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

});