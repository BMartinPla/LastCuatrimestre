using DecoCafe.Condimentos.Abstracciones;
using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Condimentos
{
    public class CocoRallado : Condimento
    {
        private readonly Infusion _infusion;
        public CocoRallado(Infusion infusion)
        {
            _infusion = infusion;
            CostoBase = 700L;
        }
        public override string Descripcion => $"{_infusion.Descripcion}, Coco Rallado";
        public override double Costo()
        {
            return CostoBase + _infusion.Costo();
        }
    }
}