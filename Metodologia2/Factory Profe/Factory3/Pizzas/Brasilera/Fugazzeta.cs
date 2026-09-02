using PizzaMaster.Pizzas;
using System.Collections.Generic;

namespace PizzaMaster.Pizzas.Brasilera
{
    public class Fugazzeta : Pizza
    {
        public Fugazzeta()
        {
            Tipo = "Fugazzeta";
            Console.WriteLine(this);

            Preparar();
            Hornear();
            Cortar();
            PonerEnCaja();
            Console.WriteLine($"Precio Final: ${Precio}");
        }
        public override void CargarIngredientes()
        {
            Ingredientes.Add(new Ingrediente("Cebolla en mariposa",100F));
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