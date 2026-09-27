using System;

namespace NoDecoCafe
{
    class Program
    {
        public static void Main(string[] args)
        {
            Expreso expreso = new Expreso();
            Console.WriteLine(expreso);
            Brasilero brasilero = new Brasilero();
            Console.WriteLine(brasilero);
            Colombiano colombiano = new Colombiano();
            Console.WriteLine(colombiano);
            Descafeinado descafeinado = new Descafeinado();
            Console.WriteLine(descafeinado);

            ColombianoCortado colombianocortado = new ColombianoCortado();
            Console.WriteLine(colombianocortado);
            ColombianoSinLactosa colombianosinlactosa = new ColombianoSinLactosa();
            Console.WriteLine(colombianosinlactosa);
            ColombianoChocolatado colombianochocolatado = new ColombianoChocolatado();
            Console.WriteLine(colombianochocolatado);

            ExpresoCortado expresocortado = new ExpresoCortado();
            Console.WriteLine(expresocortado);

            DescafeinadoCortado descafeinadocortado = new DescafeinadoCortado();
            Console.WriteLine(descafeinadocortado);
            DescafeinadoSinLactosa descafeinadosinlactosa = new DescafeinadoSinLactosa();
            Console.WriteLine(descafeinadosinlactosa);
            DescafeinadoChocolatado descafeinadochocolatado = new DescafeinadoChocolatado();
            Console.WriteLine(descafeinadochocolatado);

            BrasileroCortado brasilerocortado = new BrasileroCortado();
            Console.WriteLine(brasilerocortado);
            BrasileroSinLactosa brasilerosinlactosa = new BrasileroSinLactosa();
            Console.WriteLine(brasilerosinlactosa);
            BrasileroChocolatado brasilerochocolatado = new BrasileroChocolatado();
            Console.WriteLine(brasilerochocolatado);

            Console.WriteLine("\n\nMartes y Jueves 20% descuento a jubilados!!!!");

        }
    }
}