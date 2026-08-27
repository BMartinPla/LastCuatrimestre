En C#, esto se implementa típicamente de tres maneras:

1. Utilizando el enfoque "clásico" basado en interfaces
2. Los eventos/delegados idiomáticos de C#
3. El integrado .NET.

## El método clásico: Interfaces

Este método sigue la definición estricta del Grupo de los Cuatro.\
Es altamente independiente y útil para comprender la mecánica del patrón.

```
// 1. The Observer Interface
public interface IObserver {
    void Update(string message);
}

// 2. The Subject Interface
public interface ISubject {
    void Attach(IObserver observer);
    void Detach(IObserver observer);
    void Notify(string message);
}

// 3. Concrete Subject
public class NewsAgency : ISubject {
    private List<IObserver> _observers = new List<IObserver>();

    public void Attach(IObserver observer) => _observers.Add(observer);
    public void Detach(IObserver observer) => _observers.Remove(observer);

    public void Notify(string message) {
        foreach (var observer in _observers) {
            observer.Update(message);
        }
    }
}

// 4. Concrete Observer
public class NewsReader : IObserver {
    public string Name { get; set; }
    public void Update(string message) => Console.WriteLine($"{Name} received: {message}");
}

```

## Los eventos/delegados idiomáticos de C#

El lenguaje C# incorpora el patrón Observer mediante la palabra clave `event`.\
Esta es la implementación más común en el desarrollo moderno de .NET.

- Sujeto: Utiliza un evento para difundir cambios.
- Observador: Se suscribe al evento mediante el operador `+=`.

```
public class WeatherStation {
    // Define the event using the built-in EventHandler
    public event EventHandler<string>? WeatherChanged;

    public void UpdateWeather(string condition) {
        Console.WriteLine($"Weather updated to: {condition}");
        // Trigger the event (Notify observers)
        WeatherChanged?.Invoke(this, condition);
    }
}

// Usage
var station = new WeatherStation();
station.WeatherChanged += (sender, condition) => Console.WriteLine($"Phone App: {condition}");
station.WeatherChanged += (sender, condition) => Console.WriteLine($"TV Station: {condition}");

station.UpdateWeather("Sunny");
```

## 338

Interfaces integradas de .NET (IObservable<T> e IObserver<T>)\
Para escenarios más complejos, especialmente en programación reactiva,\
 .NET proporciona **System.IObservable<T>** y **System.IObserver<T>**.

- OnNext: Envía nuevos datos al observador.
- OnError: Notifica al observador sobre una excepción.
- OnCompleted: Indica que no se enviarán más datos.
