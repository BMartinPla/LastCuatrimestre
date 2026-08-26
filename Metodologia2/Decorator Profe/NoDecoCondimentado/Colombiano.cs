using System;

namespace NoDecoCafe
{
    internal class Colombiano : Cafe 
    {
        public Colombiano():base("Colombiano"){}
        public override float Costo()
        {
            return BuscarCosto(Descripcion);
        }

        private float BuscarCosto(string Descripcion)
        {
            // Consultar a la base de datos
            // Ponele: select costo from Costos where tipo = 'Colombiano'
            return 1250.50F;
        }
        public override string ToString()
        {
            return $"{base.ToString()}\n\t{"Precio"}: " +
                $"{BuscarCosto(Descripcion)}";
        }
    }
}