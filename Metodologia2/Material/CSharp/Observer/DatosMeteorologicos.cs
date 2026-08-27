using System;
using System.Collections.Generic;

namespace Observer;

public class DatosMeteorologicos : ISujeto
{
    List<IObservador> Observadores = new List<IObservador>();
    float Temperatura { get; set; }
    int PorcentajeHumedad { get; set; }
    int Presion { get; set; }
    public void RegistrarObservador(IObservador o)
    {
        Observadores.Add(o);
    }
    public void RemoverObservador(IObservador o)
    {
        Observadores.Remove(o);
    }
    public void NotificarObservadores()
    {
        foreach(IObservador o in Observadores)
        {
            o.Actualizar(Temperatura, PorcentajeHumedad, Presion);
        }
    }

    public void NotificarCambios()
    {
        NotificarObservadores();
    }
    public void RegistrarCambios(float temperatura, int porcentajeHumedad, int presion)
    {
        Temperatura = temperatura;
        PorcentajeHumedad = porcentajeHumedad;
        Presion = presion;
        NotificarCambios();
    }
}
