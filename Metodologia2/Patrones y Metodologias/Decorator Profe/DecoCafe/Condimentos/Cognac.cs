using DecoCafe.Condimentos.Abstracciones;
using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Condimentos
{
    public class Cognac : Condimento
    {
        private readonly Infusion _infusion;
        public Cognac(Infusion infusion)
        {
            _infusion = infusion;
            CostoBase = 1000L;
        }
        public override string Descripcion => $"{_infusion.Descripcion}, Cognac";
        public override double Costo()
        {
            return CostoBase + _infusion.Costo();
        }
    }
}