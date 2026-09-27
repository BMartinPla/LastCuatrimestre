using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Te
{
    public class Negro : Infusion
    {
        public Negro()
        {
            Descripcion = "Té Negro";
            CostoBase = 1000L;
        }   
        public override double Costo()
        {
            return CostoBase;
        }
        public override string ToString()
        {
            return $"{Descripcion}";
        }
    }
}