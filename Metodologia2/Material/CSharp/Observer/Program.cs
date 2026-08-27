using System;

namespace Observer;

public class Program
{
    public static void Main(string[] args)
    {
        DatosMeteorologicos datos = new DatosMeteorologicos();
        DatosActuales datosActuales = new DatosActuales(datos);
        DatosChinos chinos = new DatosChinos(datos);
        DatosAlemanes alemanes = new DatosAlemanes(datos);

        datos.RegistrarCambios(12, 75, 60);
        datos.RegistrarCambios(20, 60, 90);
        //datos.RegistrarCambios(27, 90, 40);
        //datos.RegistrarCambios(10, 55, 90);

        datos.RemoverObservador(chinos);
        datos.RegistrarCambios(22, 35, 99);
    }
}
