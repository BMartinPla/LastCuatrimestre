using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BardoNews
{
    class Program
    {
        public static void Main(string[] args)
        {
            Console.Clear();
            Agencia agencia = Agencia.GetAgencia();
            List<Noticia> Noticias = new List<Noticia>();

            agencia.RegistrarSuscriptor(new SuscriptorFacebook("Pepe", "PepeFB"));
            agencia.RegistrarSuscriptor(new SuscriptorInstagram("Pepepe", "PepepeIG"));
            agencia.RegistrarSuscriptor(new SuscriptorMail("Pepon", "Pepon@Mail"));
            agencia.RegistrarSuscriptor(new SuscriptorSMS("Peppe", "PeppeSMS"));
            agencia.RegistrarSuscriptor(new SuscriptorTikTok("Popis", "PopisTikTok"));
            agencia.RegistrarSuscriptor(new SuscriptorWhatsApp("Profe", "543364123456"));

            Noticias.Add(new Noticia("Se fue todo al carajo. Agarren lo que puedan y corran."));
            Noticias.Add(new Noticia("El Ministro", "No tenemos nada que ver, pedimos calma."));
            Noticias.Add(new Noticia("Licha Martinez", "La patria no se vende (las finales puede ser)."));
            Noticias.Add(new Noticia("Tristelme", "Yo pense que Almada era mi amigo."));

            //if (args.Length == 0)
            //{
            //    agencia = Agencia.GetAgencia();
            //    agencia.Informa(uno);
            //    agencia.Informa(dos);
            //    agencia.Informa(tres);
            //    agencia.Informa(cuatro);
            //}
            //else if (args.Length == 1)
            //{
            //    agencia = Agencia.GetAgencia(args[0]);
            //    agencia.Informa(uno);
            //    agencia.Informa(dos);
            //    agencia.Informa(tres);
            //    agencia.Informa(cuatro);

            //}
            //else
            //{
            //    Console.WriteLine("Uso: dotnet run [agencia]");
            //    Environment.Exit(1);
            //}

            foreach(Noticia n in Noticias)
            {
                foreach(ISuscriptor isus in agencia.Suscriptores)
                {
                    Console.ResetColor();
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine("\n#------------ ATENCION ------------#");
                    Console.ResetColor();
                    Console.ForegroundColor = ConsoleColor.Magenta;
                    isus.Actualizar(n);
                }
            }

            Console.ReadKey();

            Environment.Exit(0);

        }
       
    }

}