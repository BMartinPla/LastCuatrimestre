using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Mate
{
    public class Rosamonte : Infusion
    {
        public Rosamonte()
        {
            Descripcion = "Mate Cocido Rosamonte";
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