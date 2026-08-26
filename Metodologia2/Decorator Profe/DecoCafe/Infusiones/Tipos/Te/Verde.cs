using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Te
{
    public class Verde : Infusion
    {
        public Verde()
        {
            Descripcion = "Té Verde Japonés";
            CostoBase = 1100L;
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