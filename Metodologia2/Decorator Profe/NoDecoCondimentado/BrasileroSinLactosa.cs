using System;

namespace NoDecoCafe
{
    internal class BrasileroSinLactosa : Cafe 
    {
        public BrasileroSinLactosa() : base("Brasilero")
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
            // Ponele: select costo from Costos where tipo = 'Brasilero'
            return 2100.00F;
        }
        public override string ToString()
        {
            return $"{base.ToString()} cortado con leche de soja\n\t{"Precio"}: ${BuscarCosto("Precio")}";
        }
    }
}