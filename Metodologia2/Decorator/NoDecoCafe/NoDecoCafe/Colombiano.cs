using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoDecoCafe
{
    internal class Colombiano : Cafe
    {
        public Colombiano() : base("Colombiano") { }
        public override float Costo()
        {
            return BuscarCosto(Descripcion);
        }

        private float BuscarCosto(string descripcion)
        {
            // Consultar a la base de datos
            return 1250.50F;
        }
        public override string ToString()
        {
            return $"{base.ToString()}\n\t{Descripcion}: ${BuscarCosto(Descripcion)}";
        }
    }
}
