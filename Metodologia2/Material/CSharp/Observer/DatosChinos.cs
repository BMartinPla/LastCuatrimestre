using Observer;

public class DatosChinos : IObservador , IComunicador
{
    float Temperatura;
    int PorcentajeHumedad;  
    int Presion;
    DatosMeteorologicos Datos;

    public DatosChinos(DatosMeteorologicos datos)
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
        Console.WriteLine($"\tTempelatura: {Temperatura}º");
        Console.WriteLine($"\tPolcentaje de Humedad: {PorcentajeHumedad}%");
        Console.WriteLine($"\tlresión Atmosfélica: {Presion} HectoPascales");
    }
}