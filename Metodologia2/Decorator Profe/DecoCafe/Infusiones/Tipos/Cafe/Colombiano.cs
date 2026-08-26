using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Cafe
{
    public class Colombiano : Infusion
    {
        public Colombiano()
        {
            Descripcion = "Café Colombiano";
            CostoBase = 2500L;
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