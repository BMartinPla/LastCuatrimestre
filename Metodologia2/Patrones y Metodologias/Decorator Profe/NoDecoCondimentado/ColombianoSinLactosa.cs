using System;

namespace NoDecoCafe
{
    internal class ColombianoSinLactosa : Cafe 
    {
        public ColombianoSinLactosa() : base("Colombiano")
        {
            LecheSoja = true;
        }
        public override float Costo()
        {
            return BuscarCosto(Descripcion);
        }

        private float BuscarCosto(string Descripcion)
        {
            // Consultar a la base de datos
            // Ponele: select costo from Costos where tipo = 'Colombiano'
            return 1450.50F;
        }
        public override string ToString()
        {
            return $"{base.ToString()} cortado con leche de soja\n\t{"Precio"}: ${BuscarCosto("Precio")}";
        }
    }
}