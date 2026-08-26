using DecoCafe.Condimentos.Abstracciones;
using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Condimentos
{
    public class ChocolateRallado : Condimento
    {
        private readonly Infusion _infusion;
        public ChocolateRallado(Infusion infusion)
        {
            _infusion = infusion;
            CostoBase = 500L;
        }
        public override string Descripcion => $"{_infusion.Descripcion}, Chocolate Rallado";
        public override double Costo()
        {
            return CostoBase + _infusion.Costo();
        }
    }
}