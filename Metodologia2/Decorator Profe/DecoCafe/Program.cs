using System;
using DecoCafe.Infusiones;
using DecoCafe.Condimentos;
using DecoCafe.Infusiones.Abstracciones;
using DecoCafe.Infusiones.Tipos.Cafe;
using DecoCafe.Infusiones.Tipos.Te;
using DecoCafe.Infusiones.Tipos.Mate;
using System.Reflection.Metadata;

namespace DecoCafe
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string separador = "# ----------------------------------------------";

            Infusion delacasa = new Expreso();
            Console.WriteLine(separador);
            Console.WriteLine(delacasa.Descripcion + " $" + delacasa.Costo());

            Infusion te = new Negro();
            Console.WriteLine(separador);
            Console.WriteLine(te.Descripcion + " $" + te.Costo());

            Infusion teconleche = new Negro();
            teconleche = new Leche(teconleche);
            Console.WriteLine(separador);
            Console.WriteLine(teconleche.Descripcion + " $" + teconleche.Costo());

            Infusion teespecial = new Negro();
            teespecial = new Leche(teespecial);
            teespecial = new Whisky(teespecial);
            Console.WriteLine(separador);
            Console.WriteLine(teespecial.Descripcion + " $" + teespecial.Costo());

            Infusion brasilerosolo = new Brasilero();
            Console.WriteLine(separador);
            Console.WriteLine(brasilerosolo.Descripcion + " $" + brasilerosolo.Costo());

            Infusion brasilero = new Brasilero();
            brasilero = new Caramel(brasilero);
            brasilero = new Cognac(brasilero);
            brasilero = new CocoRallado(brasilero);
            brasilero = new ChocolateRallado(brasilero);
            brasilero = new Whisky(brasilero);
            brasilero = new Leche(brasilero);
            brasilero = new LecheDeSoja(brasilero);
            brasilero = new Crema(brasilero);
            Console.WriteLine(separador);
            Console.WriteLine(brasilero.Descripcion + " $" + brasilero.Costo());
        }
    }
}
