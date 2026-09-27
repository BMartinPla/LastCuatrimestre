using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Mate
{
    public class Playadito : Infusion
    {
        public Playadito()
        {
            Descripcion = "Mate Cocido Payadito";
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