using System.Reflection;
using PizzaMaster.Pizzas;

namespace PizzaMaster
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string PathRaiz = "PizzaMaster";
            string PathPizzas = $"{PathRaiz}.Pizzas";
            Assembly assembly = Assembly.GetExecutingAssembly();
            Pizzeria? pizzeria;
            string[] Sucursales = {"Argentina","Boliviana","Brasilera","Chilena","Paraguaya","Uruguaya"};

            while(true)
            {
                Menu menupizzerias = new Menu(Sucursales);
                string opcionpizzeria = menupizzerias.Mostrar();
                if (opcionpizzeria.ToUpper().Equals("X"))
                {
                    Environment.Exit(0);
                }
                else
                {
                    pizzeria = new Pizzeria(opcionpizzeria);
                    Menu menupizzas = new Menu(Pizza.Lista(assembly, $"{PathPizzas}.{opcionpizzeria}").ToArray());
                    string opcionpizza = menupizzas.Mostrar(opcionpizzeria);
                    if (opcionpizza.ToUpper().Equals("X"))
                    {
                        continue;
                    }
                    else
                    {
                        Console.Clear();
                        pizzeria.Cartel();
                        Console.WriteLine("\n--------------------------------");
                        pizzeria.OrdenarPizza($"{PathPizzas}.{opcionpizzeria}.{opcionpizza}");
                        Console.WriteLine("--------------------------------");
                    }
                    Console.Write("Pulse Enter para continuar");
                    Console.ReadKey();
                }
            }
        }
    }
}
