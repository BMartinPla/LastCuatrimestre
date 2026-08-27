# Usando una "custom made library"

Para usar una biblioteca personalizada en C#, primero debe compilarla en un archivo de biblioteca de vínculos dinámicos (.dll) y luego hacer referencia a ella dentro de su aplicación de destino.  

A continuación, se describe el proceso paso a paso para crear y usar una biblioteca de clases C# personalizada con Microsoft Visual Studio.

## 1. Crear y compilar la biblioteca personalizada 

1. Abra Visual Studio y elija Crear un nuevo proyecto. 
2. Busque Biblioteca de clases, seleccione la plantilla C# y haga clic en Siguiente. 
3. Asigne un nombre a su proyecto (por ejemplo, LibPesona) y seleccione su marco de destino preferido (como .NET 8.0 o .NET 6.0). 
4. Reemplace el código predeterminado con su funcionalidad personalizada:
```
namespace LibPersona;

public class Pais
{
    int Id { get; set; }
    string Nombre { get; set; }

    public Pais(int id, string nombre)
    {
        Id = id;
        Nombre = nombre;
    }

    public override string ToString()
    {
        return $"Pais: Id: {Id}, Nombre: {Nombre}";
    }
}
``` 
5. Cambia la configuración de compilación de Depuración a Versión. 
6. Haz clic en Compilar > Compilar solución en la barra de menú superior. Esto generará tu archivo .dll personalizado dentro del directorio bin/Release/ de tu proyecto.

## 2. Referenciar la biblioteca en una aplicación 
Para usar este código en un proyecto independiente (como una aplicación de consola o web), debe vincular el archivo .dll: 
1. Si ambos proyectos están en la misma solución: Haga clic con el botón derecho en Dependencias (o Referencias) en el proyecto de su aplicación -> Agregar referencia de proyecto -> Marque la casilla junto al proyecto de su biblioteca -> Haga clic en Aceptar. 
2. Si la biblioteca es un archivo independiente: Haga clic con el botón derecho en Dependencias -> Agregar referencia de ensamblado -> Haga clic en Examinar -> Busque y seleccione el archivo compilado LibPersona.dll -> Haga clic en Aceptar.

## 3. Consume la biblioteca en tu código. 
Una vez referenciada, incorpora el espacio de nombres de la biblioteca a tu script C# usando la palabra clave `using`.
```
using System;
// Import your custom library namespace
using LibPersona; 

namespace MyApp
{
    class Program
    {
        static void Main(string[] args)
        {
            // Instanciar clases de la biblioteca personalizada
            Pais pais = new Pais(1, "Argentina");
            Provincia provincia = new Provincia(1, pais, "Buenos Aires");

            Console.WriteLine(pais);
            Console.WriteLine(provincia);
        }
    }
}
``` 
FALTA PERSONA Y TODOS LOS _pepe

