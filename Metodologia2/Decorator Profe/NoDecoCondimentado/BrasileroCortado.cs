using System;

namespace NoDecoCafe
{
    internal class BrasileroCortado : Cafe 
    {
        public BrasileroCortado() : base("Brasilero")
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
            // Ponele: select costo from Costos where tipo = 'Brasilero'
            return 1900.00F;
        }
        public override string ToString()
        {
            return $"{base.ToString()} cortado\n\t{"Precio"}: ${BuscarCosto(Descripcion)}";
        }
    }
}