using PizzaMaster.Pizzas;
using System.Collections.Generic;

namespace PizzaMaster.Pizzas.Boliviana
{
    public class Mozzarella : Pizza
    {
        public Mozzarella()
        {
            Tipo = "Mozzarella";
            Console.WriteLine(this);

            Preparar();
            Hornear();
            Cortar();
            PonerEnCaja();
            Console.WriteLine($"Precio Final: ${Precio}");
        }
        public override void CargarIngredientes()
        {
            Ingredientes.Add(new Ingrediente("Queso Mozzarella",1000F));
            Ingredientes.Add(new Ingrediente("Aceitunas Verdes",500F));
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