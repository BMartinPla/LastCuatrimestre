using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Cafe
{
    public class DeLaCasa : Infusion
    {
        public DeLaCasa()
        {
            Descripcion = "Café de la casa";
            CostoBase = 2000L;
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