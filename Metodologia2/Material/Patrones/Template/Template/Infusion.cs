using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template
{
    public abstract class Infusion
    {
        public void Preparar()
        {
            HervirAgua();
            Mezclar();
            Complementar();
            Servir();
        }

        public void HervirAgua()
        {
            Console.WriteLine("Ponemos el agua a hervir");
        }
        public abstract void Complementar();
        public abstract void Mezclar();

        public void Servir() 
        {
            Console.WriteLine("Estamos sirviendo");
        }

    }
}
