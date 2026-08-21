using System;

namespace NoDecoCondimentado
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
        }
    }
}