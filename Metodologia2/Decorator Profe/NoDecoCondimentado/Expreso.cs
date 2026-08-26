using System;

namespace NoDecoCafe
{
    internal class Expreso : Cafe 
    {
        public Expreso():base("Expreso"){}
        public override float Costo()
        {
            return BuscarCosto(Descripcion);
        }
        private float BuscarCosto(string Descripcion)
        {
            // Consultar a la base de datos
            // Ponele: select costo from Costos where tipo = 'Expreso'
            return 1300F;
        }
        public override string ToString()
        {
            return $"{base.ToString()}\n\t{"Precio"}: ${BuscarCosto(Descripcion)}";
        }
    }
}