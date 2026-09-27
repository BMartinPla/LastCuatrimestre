using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BardoNews
{
    public class SuscriptorSMS : ISuscriptor
    {
        string Nombre { get; set; }
        string Destino { get; set; }

        public SuscriptorSMS(string nombre, string destino)
        {
            Nombre = nombre;
            Destino = destino;
        }

        public void Actualizar(Noticia noticia)
        {
            Console.WriteLine($"Querido usuario de SMS {Nombre} con perfil {Destino}");
            Console.WriteLine("Te enviamos, por estar suscripto, esta noticia:");
            Console.WriteLine(noticia);
        }

    }
}