using DecoCafe.Condimentos.Abstracciones;
using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Condimentos
{
    public class Leche : Condimento
    {
        private readonly Infusion _infusion;
        public Leche(Infusion infusion)
        {
            _infusion = infusion;
            CostoBase = 200L;
        }
        public override string Descripcion => $"{_infusion.Descripcion}, Leche";
        public override double Costo()
        {
            return CostoBase + _infusion.Costo();
        }
    }
}