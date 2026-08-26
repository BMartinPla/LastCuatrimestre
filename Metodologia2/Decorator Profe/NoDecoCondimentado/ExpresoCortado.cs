using System;

namespace NoDecoCafe
{
    internal class ExpresoCortado : Cafe 
    {
        public ExpresoCortado() : base("Expreso")
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
            // Ponele: select costo from Costos where tipo = 'Expreso'
            return 1370F;
        }
        public override string ToString()
        {
            return $"{base.ToString()} cortado\n\t{"Precio"}: ${BuscarCosto(Descripcion)}";
        }
    }
}