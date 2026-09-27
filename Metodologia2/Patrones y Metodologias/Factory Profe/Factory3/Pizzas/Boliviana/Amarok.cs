using PizzaMaster.Pizzas;
using System.Collections.Generic;

namespace PizzaMaster.Pizzas.Boliviana
{
    public class Amarok : Pizza
    {
        public Amarok()
        {
            Tipo = "Amarok";
            Console.WriteLine(this);

            Preparar();
            Hornear();
            Cortar();
            PonerEnCaja();
            Console.WriteLine($"Precio Final: ${Precio}");
        }
        public override void CargarIngredientes()
        {
            Ingredientes.Add(new Ingrediente("Cebolla", 200F));
            Ingredientes.Add(new Ingrediente("Papa", 200F));
            Ingredientes.Add(new Ingrediente("Zanahoria", 200F));
            Ingredientes.Add(new Ingrediente("Lechuga", 200F));
            Ingredientes.Add(new Ingrediente("Tomate", 200F));
            Ingredientes.Add(new Ingrediente("Morrón", 200F));
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