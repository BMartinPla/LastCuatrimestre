using System;

namespace NoDecoCafe
{
    internal class ColombianoChocolatado : Cafe 
    {
        public ColombianoChocolatado() : base("Colombiano")
        {
            ChocolateRallado = true;
        }
        public override float Costo()
        {
            return BuscarCosto(Descripcion);
        }

        private float BuscarCosto(string Descripcion)
        {
            // Consultar a la base de datos
            // Ponele: select costo from Costos where tipo = 'Colombiano'
            return 1650.50F;
        }
        public override string ToString()
        {
            return $"{base.ToString()} con chocolate rallado" + 
                $"\n\t{"Precio"}: ${BuscarCosto(Descripcion)}";
        }
    }
}