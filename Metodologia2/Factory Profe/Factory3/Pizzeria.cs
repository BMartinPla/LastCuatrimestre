using System;
using PizzaMaster.Pizzas;

namespace PizzaMaster
{
    public class Pizzeria
    {
        string Nombre = "Pizzeria a designar";
        public Pizzeria(string nombre)
        {
            Nombre = nombre;
            Cartel();
        }
        public Pizza OrdenarPizza(String tipo)
        {
            Pizza pizza = CrearPizza(tipo);
            return pizza;
        }
        public Pizza CrearPizza(string tipo)
        {
            Type? pizzaType = Type.GetType(tipo);
            if (pizzaType == null) { return null!; }
            return (Pizza?)Activator.CreateInstance(pizzaType)!;
        }
        public override string ToString()
        {
            return $"Pizzeria {Nombre}";
        }
        public void Cartel()
        {
            Console.Clear();
            Console.WriteLine("***********************************************");
            Console.WriteLine("***********************************************");
            Console.WriteLine($"******** Gran Pizzería {Nombre} **************");
            Console.WriteLine("***********************************************");
            Console.WriteLine("***********************************************");
        }
    }
}