import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';

describe('Input Component', () => {
  const user = userEvent.setup();

  it('debería renderizarse y funcionar como tipo "text" por defecto (sin atributo)', async () => {
    render(<Input data-testid="test-input" />);
    
    const inputElement = screen.getByTestId('test-input');
    const testValue = 'prueba';

    expect(inputElement.getAttribute('type')).toBeNull();

    await user.type(inputElement, testValue);
    expect(inputElement).toHaveValue(testValue); 
  });

  it('debería aceptar y aplicar la prop "type"', () => {
    render(<Input type="email" data-testid="email-input" />);
    const inputElement = screen.getByTestId('email-input');

    expect(inputElement.getAttribute('type')).toBe('email');
  });

  it('debería mostrar el valor inicial si se pasa la prop "value"', () => {
    const initialValue = 'Valor inicial';
    render(<Input value={initialValue} readOnly data-testid="value-input" />);
    
    const inputElement = screen.getByTestId('value-input');
    
    expect(inputElement).toHaveValue(initialValue);
  });

  it('debería estar deshabilitado cuando se pasa la prop "disabled"', async () => {
    const mockOnChange = jest.fn();
    render(<Input disabled onChange={mockOnChange} data-testid="disabled-input" />);
    
    const inputElement = screen.getByTestId('disabled-input');

    expect(inputElement).toBeDisabled();

    await user.type(inputElement, 'texto prohibido');

    expect(inputElement).toHaveValue('');
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('debería aplicar el atributo aria-invalid cuando se pasa la prop', () => {

    render(<Input aria-invalid data-testid="invalid-input" />);
    
    const inputElement = screen.getByTestId('invalid-input');

    expect(inputElement).toHaveAttribute('aria-invalid', 'true');

  });

  it('debería mostrar el placeholder correctamente', () => {
    const placeholderText = 'Escribe aquí...';
    render(<Input placeholder={placeholderText} data-testid="placeholder-input" />);
    
    const inputElement = screen.getByTestId('placeholder-input');

    expect(screen.getByPlaceholderText(placeholderText)).toBeInTheDocument();

    expect(inputElement).toHaveAttribute('placeholder', placeholderText);
  });

});