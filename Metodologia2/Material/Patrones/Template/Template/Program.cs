using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Template
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Te te = new Te();
            Cafe cafe = new Cafe();

            Console.WriteLine("\n preparando un tecito...");
            te.Preparar();

            Console.WriteLine("\n Un cafecito tranki...");
            cafe.Preparar();

            Console.WriteLine("\n un te con limon...");
            Te teConLimon = new Te(true, false);
            teConLimon.Preparar();

            Console.WriteLine("\n un te con leche...");
            Te teConLeche = new Te(false, true);
            teConLeche.Preparar();

            Console.WriteLine("\n un cafe cortado...");
            Cafe cortado = new Cafe(true);
            cortado.Preparar();

            Console.ReadKey();

        }
    }
}
