import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../button'

describe('Button Component', () => {

  it('debe renderizar el botón con el texto correcto', () => {
    render(<Button>Click Me</Button>)

    const buttonElement = screen.getByRole('button', { name: /click me/i })

    expect(buttonElement).toBeInTheDocument()
  })

  
  it('debe llamar a la función onClick cuando se hace click', async () => {
    const user = userEvent.setup()
    const mockOnClick = jest.fn()
    render(<Button onClick={mockOnClick}>Click Me</Button>)
    const buttonElement = screen.getByRole('button', { name: /click me/i })

    await user.click(buttonElement)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('debe aplicar las clases de la variante "destructive"', () => {
    render(<Button variant="destructive">Delete</Button>)
    const buttonElement = screen.getByRole('button', { name: /delete/i })

    expect(buttonElement).toHaveClass('bg-destructive')
    expect(buttonElement).toHaveClass('text-white')
  })

  it('NO debe llamar a onClick y debe tener el atributo disabled cuando la prop disabled es true', async () => {
    const user = userEvent.setup()
    const mockOnClick = jest.fn()
    render(<Button disabled onClick={mockOnClick}>Disabled</Button>)
    const buttonElement = screen.getByRole('button', { name: /disabled/i })

    expect(buttonElement).toBeDisabled() 
    expect(buttonElement).toHaveClass('disabled:opacity-50') 

    await user.click(buttonElement)

    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('debe aplicar las clases del tamaño "sm"', () => {
    render(<Button size="sm">Small Button</Button>)
    const buttonElement = screen.getByRole('button', { name: /small button/i })

    expect(buttonElement).toHaveClass('h-8')
    expect(buttonElement).toHaveClass('px-3')
  })

  it('debe mezclar clases de `className` y sobrescribir variantes', () => {
    render(
      <Button variant="default" className="mt-4 bg-red-500">
        Merge Test
      </Button>
    )
    const buttonElement = screen.getByRole('button', { name: /merge test/i })

    expect(buttonElement).toHaveClass('mt-4')
    
    expect(buttonElement).toHaveClass('bg-red-500')

    expect(buttonElement).not.toHaveClass('bg-primary')
  })

  it('debe renderizar como un <a> cuando se usa asChild con un link', () => {
    render(
      <Button asChild>
        <a href="/login">Log In</a>
      </Button>
    )

    const linkElement = screen.getByRole('link', { name: /log in/i })

    expect(linkElement).toBeInTheDocument()

    expect(linkElement.tagName).toBe('A')

    expect(linkElement).toHaveAttribute('href', '/login')

    expect(linkElement).toHaveClass('inline-flex')

    const buttonElement = screen.queryByRole('button')
    expect(buttonElement).not.toBeInTheDocument()
  })

})