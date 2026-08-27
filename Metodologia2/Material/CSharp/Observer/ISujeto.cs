namespace Observer;

public interface ISujeto
{
    public void RegistrarObservador(IObservador o);
    public void RemoverObservador(IObservador o);
    public void NotificarObservadores();
}