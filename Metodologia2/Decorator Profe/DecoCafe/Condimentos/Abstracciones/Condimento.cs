using DecoCafe.Infusiones.Abstracciones;

namespace DecoCafe.Condimentos.Abstracciones
{
    public abstract class Condimento : Infusion
    {
        public abstract override string Descripcion { get; }
    }
}