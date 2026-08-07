
namespace Singleton;

public class Program
{
    static void Main (string[] args)
    {
        Singleton s1 = Singleton.GetInstance();
        Singleton s2 = Singleton.GetInstance();

        if (s1 == s2)
        {
            Console.WriteLine("El patron Singleton funciona, ambas variables contienen la misma instancia");
        } else
        {
            Console.WriteLine("El patron Singleton fallo, las variables contienen diferentes instancias");
        }

        s1.algunaLogicaDeNegocio();
        s2.algunaLogicaDeNegocio();

    }
}