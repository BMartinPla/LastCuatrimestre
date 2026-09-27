using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Cafe
{
    public class Descafeinado : Infusion
    {
        public Descafeinado()
        {
            Descripcion = "Café Descafeinado";
            CostoBase = 2300L;
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