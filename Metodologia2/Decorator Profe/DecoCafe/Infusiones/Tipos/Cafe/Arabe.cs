using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Infusiones.Tipos.Cafe
{
    public class Arabe : Infusion
    {
        public Arabe()
        {
            Descripcion = "Café Arabe";
            CostoBase = 4000L;
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