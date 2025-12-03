import React from 'react';
import { render, screen } from '@testing-library/react';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../select';

describe('Select Component', () => {

  it('debería renderizar el trigger y el placeholder inicial', () => {
    render(
      <Select>
        <SelectTrigger data-testid="select-trigger">
          <SelectValue placeholder="Selecciona un producto" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="producto">Laptop Gamer</SelectItem>
        </SelectContent>
      </Select>
    );
    
    const placeholderText = 'Selecciona un producto';

    const placeholderSpan = screen.getByText(placeholderText); 

    const trigger = screen.getByRole('combobox'); 

    expect(trigger).toBeInTheDocument();

    expect(trigger).toContainElement(placeholderSpan); 
    
    expect(screen.queryByText('Laptop Gamer')).not.toBeInTheDocument();
  });

  it('debería aplicar el atributo disabled al trigger', () => {
    render(
      <Select disabled>
        <SelectTrigger data-testid="disabled-trigger">
          <SelectValue placeholder="Deshabilitado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    );
    
    const trigger = screen.getByTestId('disabled-trigger');

    expect(trigger).toBeDisabled(); 
  });
});