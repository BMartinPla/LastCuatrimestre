using System;

namespace NoDecoCafe
{
    internal class DescafeinadoSinLactosa : Cafe 
    {
        public DescafeinadoSinLactosa() : base("Descafeinado")
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
            // Ponele: select costo from Costos where tipo = 'Descafeinado'
            return 915F;
        }
        public override string ToString()
        {
            return $"{base.ToString()} cortado con lecha de soja\n\t{"Precio"}: ${BuscarCosto(Descripcion)}";
        }
    }
}