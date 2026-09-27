using System;

namespace NoDecoCafe
{
    internal class Descafeinado : Cafe 
    {
        public Descafeinado():base("Descafeinado"){}
        public override float Costo()
        {
            return BuscarCosto(Descripcion);
        }

        private float BuscarCosto(string Descripcion)
        {
            // Consultar a la base de datos
            // Ponele: select costo from Costos where tipo = 'Descafeinado'
            return 850F;
        }
        public override string ToString()
        {
            return $"{base.ToString()}\n\t{"Precio"}: ${BuscarCosto(Descripcion)}";
        }
    }
}