using PizzaMaster.Pizzas;
using System.Collections.Generic;

namespace PizzaMaster.Pizzas.Peruana
{
    public class Voladora : Pizza
    {
        public Voladora()
        {
            Tipo = "Voladora";
            Console.WriteLine(this);

            Preparar();
            Hornear();
            Cortar();
            PonerEnCaja();
            Console.WriteLine($"Precio Final: ${Precio}");
        }
        public override void CargarIngredientes()
        {
            Ingredientes.Add(new Ingrediente("Queso Mozzarella", 1000F));
            Ingredientes.Add(new Ingrediente("Leche de Tigre", 1000F));
            Ingredientes.Add(new Ingrediente("PAjaro coLOrado taMAyo", 1000F));
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