using PizzaMaster.Pizzas;
using System.Collections.Generic;

namespace PizzaMaster.Pizzas.Chilena
{
    public class Terremoto : Pizza
    {
        public Terremoto()
        {
            Tipo = "Terremoto";
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
            Ingredientes.Add(new Ingrediente("Huevo Revuelto", 1000F));
            Ingredientes.Add(new Ingrediente("Carne Picada", 1000F));
            Ingredientes.Add(new Ingrediente("Aceitunas Verdes (Procesadas)", 500F));
            Ingredientes.Add(new Ingrediente("Pimentón", 100F));
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