using LibSueldos;
using LibPersona;

namespace Recibos;

public class Program
{
    public static void Main(string[] args)
    {
        Persona p = new Persona();
        Empleado e = new Empleado();
        p._nombre = "Lionel";
        Console.WriteLine(p._nombre);
    }
}

// mongosh 127.0.0.1:27017 -u admin -p Soler225 < ./cols.js > TP3.txt