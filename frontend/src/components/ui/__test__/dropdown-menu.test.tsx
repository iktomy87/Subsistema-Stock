import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '../dropdown-menu';

const BasicMenu = (props = {}) => (
  <DropdownMenu {...props}>
    <DropdownMenuTrigger>
      <span data-testid="menu-trigger">Opciones</span>
    </DropdownMenuTrigger>
    <DropdownMenuContent data-testid="menu-content">
      <DropdownMenuItem>Item Estándar</DropdownMenuItem>
      <DropdownMenuItem disabled>Item Deshabilitado</DropdownMenuItem>
      <DropdownMenuCheckboxItem checked>Check A</DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const RadioMenu = () => {
  const [flavor, setFlavor] = useState('vainilla');
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <span data-testid="radio-trigger">Sabores</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={flavor} onValueChange={setFlavor}>
          <DropdownMenuRadioItem value="chocolate">Chocolate</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="vainilla">Vainilla</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const SubMenu = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <span data-testid="submenu-trigger">Submenú</span>
    </DropdownMenuTrigger>
    <DropdownMenuContent data-testid="main-content">
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          Subopciones
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent data-testid="sub-content">
          <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    </DropdownMenuContent>
  </DropdownMenu>
);


describe('DropdownMenu Component', () => {
  const user = userEvent.setup();

  it('debería abrir y cerrar el menú al hacer clic en el trigger', async () => {
    render(<BasicMenu />);
    
    const trigger = screen.getByTestId('menu-trigger');
    const menuContent = screen.queryByTestId('menu-content');

    expect(menuContent).not.toBeInTheDocument();

    await user.click(trigger);
    const openMenu = await screen.findByTestId('menu-content');
    expect(openMenu).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
        expect(screen.queryByTestId('menu-content')).not.toBeInTheDocument();
    });
  });

  it('debería ejecutar la acción del ítem y cerrar el menú', async () => {
    const mockOnClick = jest.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger><span data-testid="action-trigger">Acción</span></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={mockOnClick}>Guardar</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByTestId('action-trigger'));
    const item = screen.getByText('Guardar');
    
    await user.click(item);

    expect(mockOnClick).toHaveBeenCalledTimes(1);

    await waitFor(() => {
        expect(screen.queryByTestId('menu-content')).not.toBeInTheDocument();
    });
  });

  it('el ítem deshabilitado no debería disparar la acción ni cerrar el menú', async () => {
    const mockOnSelect = jest.fn(); 
    render(
      <DropdownMenu defaultOpen={true}>
        <DropdownMenuTrigger><span data-testid="disabled-trigger">Deshabilitado</span></DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={mockOnSelect} disabled>Item Deshabilitado</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const disabledItem = screen.getByText('Item Deshabilitado');

    await user.click(disabledItem);

    expect(mockOnSelect).not.toHaveBeenCalled(); 

    expect(screen.getByRole('menu')).toBeInTheDocument();
	});

  it('debería cambiar el valor seleccionado del DropdownMenuRadioItem', async () => {
    render(<RadioMenu />);
    
    await user.click(screen.getByTestId('radio-trigger'));
    
    const chocolateItem = screen.getByText('Chocolate');
    const vainillaItem = screen.getByText('Vainilla');

    expect(vainillaItem).toHaveAttribute('data-state', 'checked');
    expect(chocolateItem).toHaveAttribute('data-state', 'unchecked');

    await user.click(chocolateItem);

    expect(chocolateItem).toHaveAttribute('data-state', 'checked');
    expect(vainillaItem).toHaveAttribute('data-state', 'unchecked');

  });

  it('debería abrir y cerrar un DropdownMenuSub', async () => {
    render(<SubMenu />);

    await user.click(screen.getByTestId('submenu-trigger'));

    expect(screen.queryByTestId('sub-content')).not.toBeInTheDocument();
    
    const subTrigger = screen.getByText('Subopciones');

    await user.click(subTrigger); 

    const subContent = await screen.findByTestId('sub-content');
    expect(subContent).toBeInTheDocument();
    expect(screen.getByText('Sub Item 1')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    
    await waitFor(() => {
        expect(screen.queryByTestId('sub-content')).not.toBeInTheDocument();
        expect(screen.queryByTestId('main-content')).not.toBeInTheDocument();
    });
  });
});