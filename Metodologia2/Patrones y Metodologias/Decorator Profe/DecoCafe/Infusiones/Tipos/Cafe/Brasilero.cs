using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Cafe
{
    public class Brasilero : Infusion
    {
        public Brasilero()
        {
            Descripcion = "Café Brasilero";
            CostoBase = 3000L;
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