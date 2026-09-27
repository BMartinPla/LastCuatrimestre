using DecoCafe.Condimentos.Abstracciones;
using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Condimentos
{
    public class LecheDeSoja : Condimento
    {
        private readonly Infusion _infusion;
        public LecheDeSoja(Infusion infusion)
        {
            _infusion = infusion;
             CostoBase = 400;
        }
        public override string Descripcion => $"{_infusion.Descripcion}, Leche de Soja";
        public override double Costo()
        {
            return CostoBase + _infusion.Costo();
        }
    }
}