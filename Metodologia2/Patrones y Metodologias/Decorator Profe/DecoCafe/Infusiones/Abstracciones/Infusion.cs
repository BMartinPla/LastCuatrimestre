namespace DecoCafe.Infusiones.Abstracciones
{
    public abstract class Infusion
    {
        public virtual string Descripcion { get; protected set; } = "Infusion Desconocida";
        public virtual double CostoBase { get; protected set; } = 0L;
        public abstract double Costo();
        public override string ToString()
        {
            return $"\t{Descripcion}: ${CostoBase}";
        }
    }
}