using PizzaMaster.Pizzas;
using System.Collections.Generic;
using System.Reflection;

namespace PizzaMaster.Pizzas
{
    public abstract class Pizza
    {
        protected String Tipo = "Pizza";
        protected float Precio = 5000F;
        public List<Ingrediente> Ingredientes = new List<Ingrediente>();
        public Pizza()  { }
        public abstract void Preparar();
        public abstract void CargarIngredientes();
        public void Hornear()
        {
            Console.WriteLine($"\tHorneando Pizza: {Tipo}");
        }
        public void Cortar()
        {
            Console.WriteLine($"\tCortando Pizza: {Tipo}");
        }
        public void PonerEnCaja()
        {
            Console.WriteLine($"\tPoniendo en caja Pizza: {Tipo}");
        }
        public void AgregarIngredientes()
        {
            foreach(Ingrediente ing in Ingredientes!)
            {
                Precio += ing.Precio;
                Console.WriteLine($"\t\tAgregando {ing.Nombre}...");
            }
        }
        public static List<string> Lista(Assembly assembly, string nspace)
        {
            List<string> lista = new List<string>();
            var datos = assembly.GetTypes()
                      .Where(t => t.IsClass && t.Namespace == nspace).ToList(); 
            foreach (var dato in datos)
            {
                lista.Add(dato.Name);
            }            
            return lista;
        }
    }
}