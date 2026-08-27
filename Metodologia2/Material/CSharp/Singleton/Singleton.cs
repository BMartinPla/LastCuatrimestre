using System;

namespace Patrones;

// La clase Singleton define el método `GetInstance` que sirve como
// alternativa al constructor y permite a los clientes acceder a 
// la misma instancia de esta clase repetidamente.

// La clase Singleton siempre debe ser una clase 'sealed' 
// para evitar la herencia de clases a través de clases 
// externas y también a través de clases anidadas.

public sealed class Singleton
{
    // El constructor del Singleton siempre debe ser privado para evitar
    // llamadas directas a la construcción con el operador `new`.
    private Singleton() {}

    // La instancia de Singleton se almacena en un campo estático. 
    // Hay  múltiples formas de inicializar este campo, 
    // todas ellas tienen varias ventajas y contras. 
    // En este ejemplo mostraremos la más simple de estas formas, 
    // que, sin embargo, no funciona muy bien en programas multiproceso.
    private static Singleton ?_instance;

    // Este es el método estático que controla el acceso a la instancia singleton.
    // En la primera ejecución, crea un objeto singleton y lo coloca
    // en el campo estático. En ejecuciones posteriores, devuelve el cliente
    // existente almacenado en el campo estático.
    public static Singleton GetInstance()
    {
        if (_instance == null)
        {
            _instance = new Singleton();
        }
        return _instance;
    }

    // Finalmente, cualquier singleton debe definir alguna lógica de negocio, que pueda
    // ejecutarse en su instancia.
     public void algunaLogicaDeNegocio()
    {
        // Por ejemplo mostrar algo
        if (_instance == null) {
            Console.WriteLine("Aún no se ha creado el Singleton");
        }
        else {
            // GetHashCode() en C# es un método que devuelve un valor numérico entero (int) 
            // que representa los datos de un objeto, utilizado para buscar e identificar 
            // objetos rápidamente .

            Console.WriteLine($"Ya se ha creado el Singleton: {_instance.GetHashCode()}");
        }
    }
}