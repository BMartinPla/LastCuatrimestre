using PizzaMaster.Pizzas;

namespace PizzaMaster.Pizzas.Peruana
{
    public class Jamon : Pizza
    {
        public Jamon()
        {
            Tipo = "Jamón";

            Console.WriteLine(this);
            Preparar();
            Hornear();
            Cortar();
            PonerEnCaja();
            Console.WriteLine($"Precio Final: ${Precio}");
        }
        public override void CargarIngredientes()
        {
            Ingredientes.Add(new Ingrediente("Jamón Cocido de 1ra",1100F));
            Ingredientes.Add(new Ingrediente("Queso Mozzarella",1000F));
            Ingredientes.Add(new Ingrediente("Aceitunas Verdes",5000F));
            Ingredientes.Add(new Ingrediente("Orégano",100F));
        }
        public override void Preparar()
        {
            Console.WriteLine($"\tPreparando Pizza: {Tipo}");
            CargarIngredientes();
            AgregarIngredientes();
        }
        public override string ToString()
        {
            return $"Pizza pedida: {Tipo}, Precio Base: ${Precio}";
        }
    }
}