using PizzaMaster.Pizzas;
using System.Collections.Generic;

namespace PizzaMaster.Pizzas.Uruguaya
{
    public class Uruguaya : Pizza
    {
        public Uruguaya()
        {
            Tipo = "Uruguaya";
            Console.WriteLine(this);

            Preparar();
            Hornear();
            Cortar();
            PonerEnCaja();
            Console.WriteLine($"Precio Final: ${Precio}");
        }
        public override void CargarIngredientes()
        {
            Ingredientes.Add(new Ingrediente("Queso Mozzarella (de Uruguay)", 1000F));
            Ingredientes.Add(new Ingrediente("Aceitunas Verdes (de Uruguay)", 500F));
            Ingredientes.Add(new Ingrediente("Orégano (de Uruguay)", 100F));
            Ingredientes.Add(new Ingrediente("Dulce de Leche (de Uruguay)", 100F));
            Ingredientes.Add(new Ingrediente("Mate (de Uruguay)", 100F));
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