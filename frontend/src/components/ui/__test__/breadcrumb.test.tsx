import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '../breadcrumb';
import { cn } from '@/lib/utils';

jest.mock('@/lib/utils', () => ({
  cn: (...inputs: (string | number | boolean | Record<string, any> | null | undefined)[]) => inputs.filter(Boolean).join(' '),
}));

jest.mock('@radix-ui/react-slot', () => ({
  Slot: ({ children, ...props }: { children: React.ReactNode; [key: string]: any }) => {
    if (React.isValidElement(children)) {
		const child = children as React.ReactElement<any>;

		const mergedClassName = cn(props.className, child.props.className);

		return React.cloneElement(child, {
        ...props,
        ...child.props, 
        className: mergedClassName, 
      });
    }
    return <div {...props}>{children}</div>;
  },
}));

describe('Breadcrumb Component', () => {

	it('debería renderizar la estructura básica de Breadcrumb con atributos de accesibilidad', () => {
		render(
		<Breadcrumb>
			<BreadcrumbList>
			<BreadcrumbItem>
				<BreadcrumbLink href="/">Home</BreadcrumbLink>
			</BreadcrumbItem>
			<BreadcrumbSeparator />
			<BreadcrumbItem>
				<BreadcrumbPage>Pagina actual</BreadcrumbPage>
			</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
		);

		const navElement = screen.getByRole('navigation', { name: 'breadcrumb' });
		expect(navElement).toBeInTheDocument();

		const listElement = screen.getByRole('list');
		expect(listElement).toBeInTheDocument();

		const listItems = screen.getAllByRole('listitem');
		expect(listItems).toHaveLength(2);
	});

  	it('debería renderizar BreadcrumbLink como una etiqueta <a> por defecto', () => {
		render(<BreadcrumbLink href="/about">About</BreadcrumbLink>);
		const link = screen.getByRole('link', { name: 'About' });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute('href', '/about');
		expect(link.tagName).toBe('A');
	});

  	it('debería renderizar BreadcrumbLink usando el slot cuando asChild es true', () => {	
		type CustomLinkProps = React.ComponentPropsWithoutRef<'a'> & { 
			customProp: string; 
		};
		
		const CustomLink: React.FC<CustomLinkProps> = ({ customProp, className, ...props }) => {
		
		return (
			<a 
			data-testid="custom-link" 
			className={cn(className, 'custom-class')} 
			{...props}
			>
			{props.children} - {customProp}
			</a>
			);
		};

		render(
			<BreadcrumbLink asChild className="text-blue-500">
				<CustomLink href="/custom" customProp="test-value">Custom</CustomLink>
			</BreadcrumbLink>
		);

		const customLink = screen.getByTestId('custom-link');
		expect(customLink).toBeInTheDocument();
		expect(customLink.tagName).toBe('A');

		expect(customLink).toHaveClass('hover:text-foreground transition-colors text-blue-500 custom-class'); 
  	});

  	it('debería renderizar BreadcrumbPage con atributos de página actual deshabilitada', () => {
		render(<BreadcrumbPage>Dashboard</BreadcrumbPage>);
		const page = screen.getByText('Dashboard');
		expect(page).toBeInTheDocument();
		
		
		expect(page).toHaveAttribute('role', 'link');
		expect(page).toHaveAttribute('aria-disabled', 'true');
		expect(page).toHaveAttribute('aria-current', 'page');
		expect(page).toHaveClass('text-foreground');
	});

  	it('debe renderizar BreadcrumbSeparator con el icono ChevronRight por defecto', () => {
		render(
		<BreadcrumbSeparator />
		);

		const separatorListItem = screen.getByRole('presentation', { hidden: true });
		expect(separatorListItem).toBeInTheDocument();

		expect(separatorListItem.querySelector('svg')).toBeInTheDocument(); 
	});

  	it('debe renderizar BreadcrumbSeparator con un children personalizado', () => {
		render(
		<BreadcrumbSeparator>
			<span data-testid="custom-separator">/</span>
		</BreadcrumbSeparator>
		);
		expect(screen.getByTestId('custom-separator')).toBeInTheDocument();
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});

  	it('debe renderizar BreadcrumbEllipsis con el icono MoreHorizontal y texto oculto', () => {
		render(<BreadcrumbEllipsis />);
		
		const ellipsis = screen.getByRole('presentation', { hidden: true });
		expect(ellipsis).toBeInTheDocument();

		const srOnlyText = screen.getByText('More');
		expect(srOnlyText).toBeInTheDocument();
		expect(srOnlyText).toHaveClass('sr-only');

		expect(ellipsis.querySelector('svg')).toBeInTheDocument();
	});
});