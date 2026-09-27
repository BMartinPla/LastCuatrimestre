using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Cafe
{
    public class Expreso : Infusion
    {
        public Expreso()
        {
            Descripcion = "Café Expreso";
            CostoBase = 3400L;
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