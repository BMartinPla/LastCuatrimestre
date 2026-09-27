using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Mate
{
    public class Taragui : Infusion
    {
        public Taragui()
        {
            Descripcion = "Mate CocidoTaragüí";
            CostoBase = 1150L;
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