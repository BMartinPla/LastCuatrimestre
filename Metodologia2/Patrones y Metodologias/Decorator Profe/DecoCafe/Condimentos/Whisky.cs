using DecoCafe.Condimentos.Abstracciones;
using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Condimentos
{
    // El Whisky es 30 Pelusas
    public class Whisky : Condimento
    {
        private readonly Infusion _infusion;
        public Whisky(Infusion infusion)
        {
            _infusion = infusion;
            CostoBase = 600L;
        }
        public override string Descripcion => $"{_infusion.Descripcion}, Whisky";
        public override double Costo()
        {
            return CostoBase + _infusion.Costo();
        }
    }
}