using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template
{
    public class Cafe : Infusion
    {
        Boolean cortado = false;

        public override void Mezclar()
        {
            Console.WriteLine("Molesmos el cafe, lo ponemos en el colador y echamos agua.");
        }

        public override void Complementar()
        {
            if (cortado)
            {
                Console.WriteLine("Un toque de crema para mi");
            }
            else
            {
                Console.WriteLine("Negro para mi");
            }
        }

        public Cafe() {}

        public Cafe(Boolean cortado) 
        { 
            this.cortado = cortado;
        }
    }
}
