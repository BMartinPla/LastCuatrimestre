using Observer;

public class DatosActuales : IObservador , IComunicador
{
    float Temperatura;
    int PorcentajeHumedad;  
    int Presion;
    DatosMeteorologicos Datos;

    public DatosActuales(DatosMeteorologicos datos)
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
        Console.WriteLine("Datos Actualizados:");
        Console.WriteLine($"\tTemperatura: {Temperatura}º");
        Console.WriteLine($"\tPorcentaje de Humedad: {PorcentajeHumedad}%");
        Console.WriteLine($"\tPresión Atmosférica: {Presion} HectoPascales");
    }
}