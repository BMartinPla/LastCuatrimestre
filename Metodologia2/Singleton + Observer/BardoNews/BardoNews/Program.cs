using System;

namespace BardoNews
{
    class Program
    {
        public static void Main(string[] args)
        {
            Console.Clear();
            Agencia agencia;
            Noticia uno = new Noticia("Se fue todo al carajo. Agarren lo que puedan y corran.");
            Noticia dos = new Noticia("El Ministro", "No tenemos nada que ver, pedimos calma.");
            Noticia tres = new Noticia("Licha Martinez", "La patria no se vende (las finales puede ser).");
            Noticia cuatro = new Noticia("Tristelme", "Yo pense que Almada era mi amigo.");

            if (args.Length == 0)
            {
                agencia = Agencia.GetAgencia();
                agencia.Informa(uno);
                agencia.Informa(dos);
                agencia.Informa(tres);
                agencia.Informa(cuatro);
            }
            else if (args.Length == 1)
            {
                agencia = Agencia.GetAgencia(args[0]);
                agencia.Informa(uno);
                agencia.Informa(dos);
                agencia.Informa(tres);
                agencia.Informa(cuatro);

            }
            else
            {
                Console.WriteLine("Uso: dotnet run [agencia]");
                Environment.Exit(1);
            }

            Environment.Exit(0);

        }
       
    }

}