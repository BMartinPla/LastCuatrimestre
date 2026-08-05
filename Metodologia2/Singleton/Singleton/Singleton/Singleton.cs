using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Singleton
{
    public sealed class Singleton
    {

        private Singleton() { }

        private static Singleton ?_instance;

        public static Singleton GetInstance()
        {
            if (_instance == null)
            {
                _instance = new Singleton();
            }
            return _instance;
        }

        public void algunaLogicaDeNegocio()
        {
            // Por ejemplo mostrar algo
            if (_instance == null)
            {
                Console.WriteLine("Aún no se ha creado el Singleton");
            } else
            {
                // GetHasCode() en C# es un método que devuelve un valor numerico entero
                // que representa los datos de un objeto, utilizado para buscar e identificar
                // objetos rápidamente.

                Console.WriteLine($"Ya se ha creado el Singleton: {_instance.GetHashCode()}");
            }
        }

    }
}
