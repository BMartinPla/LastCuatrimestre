namespace Observer;

public interface IObservador
{
    public void Actualizar(float Temperatura, int PorcentajeHumedad, int Presion);
}