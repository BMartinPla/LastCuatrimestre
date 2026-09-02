using System.Formats.Asn1;
using System.Security.Cryptography.X509Certificates;

namespace PizzaMaster
{
    public class Menu
    {
        string[] Items;
        public Menu(string[] items)
        {
            Items = items;
        }

        public string Mostrar(string? sucursal = null)
        {
            while(true)
            {
                int opcion = 1;
                Console.Clear();
                Encabezado(sucursal);
                foreach(string item in Items)
                {
                    Console.WriteLine($"\t\t{opcion}: {item}");
                    opcion++;
                }
                Console.WriteLine($"\t\tX: Salir");
                Console.Write($"\n\t\tSeleccione una opción: ");
                String sel = Console.ReadLine()!;
                if (sel.ToUpper().Equals("X")) 
                { 
                    return sel; 
                }
                else
                {
                    if (int.TryParse(sel, out int seleccion))
                    {
                        if (seleccion <= Items.Length && seleccion != 0)
                        {
                            return Items[seleccion -1];   
                        }
                    }
                    OpcionIncorrecta();
                }
            }
        }

        void Encabezado(string? sucursal = null)
        {
            string titulo = "Pizzas Gourmet El Profe";
            string linea = "-----------------------------------------------------";
            Console.WriteLine($"{linea}");
            Console.WriteLine($"\t\t{titulo}");
            if (sucursal != null)
                Console.WriteLine($"\t\t\t{sucursal}");
            Console.WriteLine($"{linea}");
        }
        void OpcionIncorrecta()
        {
            Console.WriteLine("\n\t\tOpción Incorrecta!");
            Console.WriteLine("\t\tPulse Enter para reintentar");
            Console.ReadLine();
        }
    }
}