using DecoCafe.Condimentos.Abstracciones;
using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Condimentos
{
    public class Miel : Condimento
    {
        private readonly Infusion _infusion;
        public Miel(Infusion infusion)
        {
            _infusion = infusion;
            CostoBase = 200;
        }
        public override string Descripcion => $"{_infusion.Descripcion}, Miel";
        public override double Costo()
        {
            return CostoBase + _infusion.Costo();
        }
    }
}