using System;

namespace NoDecoCafe
{
    internal class DescafeinadoChocolatado : Cafe 
    {
        public DescafeinadoChocolatado() : base("Descafeinado")
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
            // Ponele: select costo from Costos where tipo = 'Descafeinado'
            return 890F;
        }
        public override string ToString()
        {
            return $"{base.ToString()} con chocolate rallado\n\t{"Precio"}: ${BuscarCosto(Descripcion)}";
        }
    }
}