using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoDecoCondimentado
{
    internal class ExpresoChocolatado : Cafe
    {
        public ExpresoChocolatado() : base("Expreso Chocolatado") 
        {
            ChocolateRallado = true;
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
