using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Te
{
    public class LemonGinger : Infusion
    {
        public LemonGinger()
        {
            Descripcion = "Lemon Ginger Tea";
            CostoBase = 1800L;
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