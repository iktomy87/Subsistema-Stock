import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '../table'; 

interface MinimalTableProps {
  captionText: string;
}

const MinimalTable = ({ captionText }: MinimalTableProps) => (
  <Table data-testid="test-table">
    <TableCaption>{captionText}</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>Producto</TableHead>
        <TableHead>Stock</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Monitor LED 24"</TableCell>
        <TableCell>MON-LED-001</TableCell>
        <TableCell>15</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={3}>Productos en Stock: 1</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
);

describe('Table Component', () => {

  const caption = 'Reporte de inventario actual';

  it('debería renderizar la estructura completa de la tabla con todos los componentes hijos', () => {
    render(<MinimalTable captionText={caption} />);

    const tableContainer = screen.getByRole('table');
    expect(tableContainer).toBeInTheDocument();

    expect(screen.getByRole('columnheader', { name: 'Producto' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Stock' })).toBeInTheDocument();

    const productCell = screen.getByRole('cell', { name: 'Monitor LED 24"' });
    expect(productCell).toBeInTheDocument();

    expect(screen.getByText('Productos en Stock: 1')).toBeInTheDocument();

    expect(screen.getByText(caption)).toBeInTheDocument();

    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('debería aplicar clases personalizadas a los elementos principales', () => {
    render(
      <TableRow className="bg-success" data-testid="stock-row">
        <TableCell className="text-large">99</TableCell>
      </TableRow>
    );

    expect(screen.getByTestId('stock-row')).toHaveClass('bg-success');

    expect(screen.getByText('99')).toHaveClass('text-large');
  });
});