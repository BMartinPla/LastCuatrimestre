using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Mate
{
    public class Canarias : Infusion
    {
        public Canarias()
        {
            Descripcion = "Mate Cocido Canarias";
            CostoBase = 800L;
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