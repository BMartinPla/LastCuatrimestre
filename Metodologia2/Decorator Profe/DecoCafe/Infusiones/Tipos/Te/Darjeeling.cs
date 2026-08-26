using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Te
{
    public class Darjeeling : Infusion
    {
        public Darjeeling()
        {
            Descripcion = "Té Darjeeling";
            CostoBase = 1200L;
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