using System;

namespace NoDecoCafe
{
    internal class BrasileroChocolatado : Cafe 
    {
        public BrasileroChocolatado() : base("Brasilero")
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
            // Ponele: select costo from Costos where tipo = 'Brasilero'
            return 2000.00F;
        }
        public override string ToString()
        {
            return $"{base.ToString()} con chocolate rallado\n\t{"Precio"}: ${BuscarCosto(Descripcion)}";
        }
    }
}