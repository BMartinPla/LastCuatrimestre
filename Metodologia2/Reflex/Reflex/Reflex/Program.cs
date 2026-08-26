using System.Collections.Specialized;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Reflex
{
    class Program
    {
        static void Main(string[] args)
        {
            Car toyota = new Car("Toyota", "Camry", 2024);

            Console.WriteLine($"My car is a {toyota.Make}.");
            toyota.StartEngine();
            Console.WriteLine(Util.Xml(nameof(toyota), toyota));
            Console.WriteLine(Util.Json(nameof(toyota), toyota));

        }
    }
}