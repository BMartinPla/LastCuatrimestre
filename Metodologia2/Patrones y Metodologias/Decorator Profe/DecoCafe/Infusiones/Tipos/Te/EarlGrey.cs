using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Te
{
    public class EarlGrey : Infusion
    {
        public EarlGrey()
        {
            Descripcion = "Earl Grey Tea";
            CostoBase = 1500L;
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