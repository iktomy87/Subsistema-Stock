import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import { 
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	CardAction, 
} from "../card"

describe("Card Component", () => {
  it("debería renderizar la Card correctamente con clases por defecto", () => {
    render(<Card>Contenido de prueba</Card>)
    const card = screen.getByText("Contenido de prueba")

    expect(card).toBeInTheDocument()
    expect(card).toHaveAttribute("data-slot", "card")

    expect(card).toHaveClass("flex")
    expect(card).toHaveClass("rounded-xl")
  })

  it("debería aplicar clases personalizadas a la Card", () => {
    render(<Card className="bg-red-500">Contenido</Card>)
    const card = screen.getByText("Contenido")
    expect(card).toHaveClass("bg-red-500")

  })
})

describe("Card Composition and Subcomponents", () => {
  it("debería renderizar el componente completo con todos los subcomponentes", () => {
    const { container } = render( 
      <Card>
        <CardHeader>
          <CardTitle>Título del Componente</CardTitle>
          <CardDescription>Descripción corta</CardDescription>
          <CardAction>Acción</CardAction>
        </CardHeader>
        <CardContent>Contenido principal</CardContent>
        <CardFooter>Pie de página</CardFooter>
      </Card>
    )

    const title = screen.getByText("Título del Componente")
    expect(title).toBeInTheDocument()
    expect(title).toHaveAttribute("data-slot", "card-title")
    expect(title).toHaveClass("font-semibold")

    const description = screen.getByText("Descripción corta")
    expect(description).toBeInTheDocument()
    expect(description).toHaveAttribute("data-slot", "card-description")
    expect(description).toHaveClass("text-sm")

    const action = screen.getByText("Acción")
    expect(action).toBeInTheDocument()
    expect(action).toHaveAttribute("data-slot", "card-action")
	expect(action).toHaveClass("col-start-2")
	expect(action).toHaveClass("row-start-1")
	expect(action).toHaveClass("self-start")

    const content = screen.getByText("Contenido principal")
    expect(content).toBeInTheDocument()
    expect(content).toHaveAttribute("data-slot", "card-content")

    expect(content).toHaveClass("px-6")

    const footer = screen.getByText("Pie de página")
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveAttribute("data-slot", "card-footer")

    expect(footer).toHaveClass("px-6")

    const header = container.querySelector('[data-slot="card-header"]')

    expect(header).toBeInTheDocument()

    expect(header).toHaveClass("has-data-[slot=card-action]:grid-cols-[1fr_auto]")
  })
})
