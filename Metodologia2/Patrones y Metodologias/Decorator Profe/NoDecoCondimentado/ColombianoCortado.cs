using System;

namespace NoDecoCafe
{
    internal class ColombianoCortado : Cafe 
    {
        public ColombianoCortado() : base("Colombiano")
        {
            Leche = true;
        }
        public override float Costo()
        {
            return BuscarCosto(Descripcion);
        }

        private float BuscarCosto(string Descripcion)
        {
            // Consultar a la base de datos
            // Ponele: select costo from Costos where tipo = 'Colombiano'
            return 1350.50F;
        }
        public override string ToString()
        {
            return $"{base.ToString()} cortado\n\t{"Precio"}: ${BuscarCosto(Descripcion)}";
        }
    }
}