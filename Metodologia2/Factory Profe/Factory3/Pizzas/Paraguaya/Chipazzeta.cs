using PizzaMaster.Pizzas;
using System.Collections.Generic;

namespace PizzaMaster.Pizzas.Paraguaya
{
    public class Chipazzetta : Pizza
    {
        public Chipazzetta()
        {
            Tipo = "Chipazzetta";
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
            Ingredientes.Add(new Ingrediente("Queso Parmesano", 800F));
            Ingredientes.Add(new Ingrediente("Harina de Maiz", 5000F));
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