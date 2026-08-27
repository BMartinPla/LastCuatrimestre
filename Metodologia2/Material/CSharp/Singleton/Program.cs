using System;

namespace Patrones;

class Program
    {
        static void Main(string[] args)
        {
            // The client code.
            Singleton s1 = Singleton.GetInstance();
            Singleton s2 = Singleton.GetInstance();

            if (s1 == s2)
            {
                Console.WriteLine("El patrón Singleton funciona, ambas variables contienen la misma instancia.");
            }
            else
            {
                Console.WriteLine("El patrón Singleton falló, las variables contienen diferentes instancias.");
            }

            s1.algunaLogicaDeNegocio();
            s1.algunaLogicaDeNegocio();
        }
    }