using DecoCafe.Condimentos.Abstracciones;
using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Condimentos
{
    public class Crema : Condimento
    {
        private readonly Infusion _infusion;
        public Crema(Infusion infusion)
        {
            _infusion = infusion;
            CostoBase = 350L;
        }
        public override string Descripcion => $"{_infusion.Descripcion}, Crema";
        public override double Costo()
        {
            return CostoBase + _infusion.Costo();
        }
    }
}