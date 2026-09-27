using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Factory
{
    public class Fugazzeta : Pizza, IPizza
    {
        public Fugazzeta()
        {
            Tipo = "Fugazzeta";
            Precio = 14000F;
            Console.WriteLine(this);
            Preparar();
            Hornear();
            Cortar();
            PonerEnCaja();
        }

        public void Preparar()
        {
            Console.WriteLine($"\tPreparando Pizza: {Tipo}");
        }

        public void Hornear()
        {
            Console.WriteLine($"\tHorneando Pizza: {Tipo}");
        }

        public void Cortar()
        {
            Console.WriteLine($"\tCortando Pizza: {Tipo}");
        }

        public void PonerEnCaja()
        {
            Console.WriteLine($"\tPoniendo en caja Pizza: {Tipo}\n");
        }

        public override string ToString()
        {
            return $"Pizza pedida: {Tipo}, Precio ${Precio}";
        }
    }
}
