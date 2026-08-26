using DecoCafe.Condimentos.Abstracciones;
using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Condimentos
{
    public class Caramel : Condimento
    {
        private readonly Infusion _infusion;

        public Caramel(Infusion infusion)
        {
            _infusion = infusion;
            CostoBase = 400;
        }

        public override string Descripcion => $"{_infusion.Descripcion}, Caramel";

        public override double Costo()
        {
            return CostoBase + _infusion.Costo();
        }
    }
}