using Observer;

public class DatosAlemanes : IObservador , IComunicador
{
    float Temperatura;
    int PorcentajeHumedad;  
    int Presion;
    DatosMeteorologicos Datos;

    public DatosAlemanes(DatosMeteorologicos datos)
    {
        Datos = datos;
        Datos.RegistrarObservador(this);
    }

    public void Actualizar(float temperatura, int porcentajeHumedad, int presion)
    {
        Temperatura = temperatura;
        PorcentajeHumedad = porcentajeHumedad;
        Presion = presion;
        Comunicar();
    }

    public void Comunicar()
    {
        Console.WriteLine("Daten Actualizaten:");
        Console.WriteLine($"\tTemperaturren: {Temperatura}º");
        Console.WriteLine($"\tPorcentajen de Humedaden: {PorcentajeHumedad}%");
        Console.WriteLine($"\tPresiónken Atmosfériken: {Presion} HectoPascales");
    }
}