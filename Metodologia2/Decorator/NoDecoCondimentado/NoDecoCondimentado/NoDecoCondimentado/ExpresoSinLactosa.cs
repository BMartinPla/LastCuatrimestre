using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoDecoCondimentado
{
    internal class ExpresoSinLactosa : Cafe
    {
        public ExpresoSinLactosa() : base("Expreso Sin Lactosa") 
        {
            LecheSoja = true;
        }
        public override float Costo()
        {
            return BuscarCosto(Descripcion);
        }

        private float BuscarCosto(string descripcion)
        {
            // Consultar a la base de datos
            return 850F;
        }
        public override string ToString()
        {
            return $"{base.ToString()}\n\t{Descripcion}: ${BuscarCosto(Descripcion)}";
        }
    }
}
