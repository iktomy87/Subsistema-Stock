import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../dialog';

const renderDialog = (props = {}) => {
  return render(
	<Dialog {...props}>
	  <DialogTrigger>
		<span data-testid="open-button">Abrir Diálogo</span>
	  </DialogTrigger>
	  <DialogContent>
		<DialogTitle>Título del Diálogo</DialogTitle>
		<DialogDescription>Contenido de prueba</DialogDescription>
		<DialogClose>
		  <span data-testid="custom-close-button">Cerrar</span>
		</DialogClose>
	  </DialogContent>
	</Dialog>
  );
};

describe('Dialog Component', () => {
	const user = userEvent.setup();

	it('debería abrir el diálogo al hacer clic en el trigger', async () => {
		renderDialog();
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

		const openButton = screen.getByTestId('open-button');
		await user.click(openButton);

		const dialog = await screen.findByRole('dialog');
		expect(dialog).toBeInTheDocument();
	});

	it('debería cerrar el diálogo al hacer clic en el botón X', async () => {
		renderDialog();

		const openButton = screen.getByTestId('open-button');
		await user.click(openButton);

		await screen.findByRole('dialog'); 

		const closeButtonX = screen.getByRole('button', { name: 'Close' }); 
		await user.click(closeButtonX);

		await waitFor(() => {
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	it('debería cerrar el diálogo al hacer clic en el botón de cierre personalizado', async () => {
		renderDialog();

		const openButton = screen.getByTestId('open-button');
		await user.click(openButton);

		await screen.findByRole('dialog');

		const customCloseButton = screen.getByTestId('custom-close-button'); 
		await user.click(customCloseButton);

		await waitFor(() => {
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	it('debería cerrar el diálogo al presionar la tecla ESC', async () => {

		renderDialog();

		const openButton = screen.getByTestId('open-button');
		await user.click(openButton);

		await screen.findByRole('dialog');

		await user.keyboard('{Escape}');

		await waitFor(() => {
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
		});
	});

	it('debería tener los atributos ARIA correctos (Title, Description)', async () => {
		renderDialog();
		await user.click(screen.getByTestId('open-button'));

		const dialog = screen.getByRole('dialog');
		const title = screen.getByText('Título del Diálogo');
		const description = screen.getByText('Contenido de prueba');

		expect(dialog).toHaveAttribute('aria-labelledby', title.id);

		expect(dialog).toHaveAttribute('aria-describedby', description.id);

	});

	it('no debería mostrar el botón X si showCloseButton es false', async () => {

		render(
		<Dialog open={true}>
			<DialogContent showCloseButton={false}>
				<DialogTitle>Título Oculto</DialogTitle>
				<DialogDescription>Descripción Oculta</DialogDescription>
			<p>Contenido</p>
			</DialogContent>
		</Dialog>
		);

		expect(screen.queryByLabelText('Close')).not.toBeInTheDocument();
		expect(screen.getByText('Contenido')).toBeInTheDocument();
	});
});