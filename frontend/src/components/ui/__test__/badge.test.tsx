import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge Component", () => {
    
    it("debería renderizar el componente con la variante por defecto 'default'", () => {
        render(<Badge>Nuevo</Badge>);

        const badgeElement = screen.getByText("Nuevo");
        expect(badgeElement).toBeInTheDocument();

        expect(badgeElement).toHaveClass("bg-primary");
        expect(badgeElement).toHaveTextContent("Nuevo");
    });

    it("debería renderizar con la variante 'secondary'", () => {
        render(<Badge variant="secondary">Secundario</Badge>);
        const badgeElement = screen.getByText("Secundario");
        
        expect(badgeElement).toHaveClass("bg-secondary");
        expect(badgeElement).not.toHaveClass("bg-primary"); 
    });

    it("debería renderizar con la variante 'destructive'", () => {
        render(<Badge variant="destructive">Peligro</Badge>);
        const badgeElement = screen.getByText("Peligro");

        expect(badgeElement).toHaveClass("bg-destructive");
    }); 

    it("debería renderizar con la variante 'outline'", () => {
        render(<Badge variant="outline">Esquema</Badge>);
        const badgeElement = screen.getByText("Esquema");

        expect(badgeElement).toHaveClass("text-foreground");
        expect(badgeElement).toHaveClass("rounded-full"); 
    });


    it("debería aplicar clases personalizadas pasadas por la prop 'className'", () => {
        render(<Badge className="custom-class">Personalizado</Badge>);
        const badgeElement = screen.getByText("Personalizado");
        
        expect(badgeElement).toHaveClass("custom-class"); 
        expect(badgeElement).toHaveClass("bg-primary");
    });

    it("debería pasar propiedades HTML nativas (como 'data-testid')", () => {
        render(<Badge data-testid="test-badge">HTML Props</Badge>);
        const badgeElement = screen.getByTestId("test-badge");

        expect(badgeElement).toBeInTheDocument();
        expect(badgeElement).toHaveTextContent("HTML Props");
    });

});