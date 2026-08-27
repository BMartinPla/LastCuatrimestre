using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template
{
    public class Te : Infusion
    {
        Boolean limon = false;
        Boolean leche = false;

        public Te() { }

        public Te(Boolean limon, Boolean leche)
        {
            this.limon = limon;
            this.leche = leche;
        }

        public override void Complementar()
        {
            if (limon)
            {
                Console.WriteLine("Un poco de limon");
            }
            if (leche) 
            {
                Console.WriteLine("Ponele un poco de leche");
            }
            else
            {
                Console.WriteLine("Sin leche por favor");
            }
        }

        public override void Mezclar()
        {
            Console.WriteLine("Con el saquito en la taza, echamos el agua y esperamos unos minutos");
        }
    }
}
