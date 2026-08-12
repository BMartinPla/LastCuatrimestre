using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BardoNews
{
    public class SuscriptorInstagram : ISuscriptor
    {
        string Nombre { get; set; }
        string Destino { get; set; }

        public SuscriptorInstagram(string nombre, string destino)
        {
            Nombre = nombre;
            Destino = destino;
        }

        public void Actualizar(Noticia noticia)
        {
            Console.WriteLine($"Querido usuario de Instagram {Nombre} con perfil {Destino}");
            Console.WriteLine("Te enviamos, por estar suscripto, esta noticia:");
            Console.WriteLine(noticia);
        }

    }
}