using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BardoNews
{
    internal class Agencia
    {
        String Nombre {  get; set; }

        DateOnly FInicio { get; set; }

        static Agencia instancia = null;

        private Agencia()
        {
            FInicio = DateOnly.FromDateTime(DateTime.Now);
        }

        public override string ToString()
        {
            return $"\tAgencia: {Nombre}. Fundada el {FInicio.ToString()}";
        }

        public static Agencia GetAgencia()
        {
            if (instancia == null)
            {
                instancia = new Agencia();
                instancia.Nombre = "El Bardo News!";
            }
            return instancia;
        }

        public static Agencia GetAgencia(string nombre)
        {
            if (instancia == null)
            {
                instancia = new Agencia();
                instancia.Nombre = nombre;
            }
            return instancia;
        }

        public void Informa(Noticia noticia)
        {
            Console.WriteLine("#---------------------");
            Console.WriteLine($"{this}\nInforma: ");
            Console.WriteLine(noticia);
        }

        public string Comunicar(Noticia noticia)
        {
            return $"#---------------------" +
                $"\n{this}\nInforma: " +
                $"\n{noticia}";
        }

    }
}
