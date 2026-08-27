# Observer

El patrón de diseño **Observer** es un patrón de comportamiento donde un objeto (el **Sujeto**)
mantiene una lista de sus dependientes (**Observadores**) y les notifica automáticamente cualquier cambio de estado.\
El patrón define un tipo de dependencia uno a muchos entre objetos.\
Es un patrón fundamental en la implementación de arquitecturas basadas en eventos.\

# Básicos del patrón Observador

## Concepto

El patrón Observador se centra en "escuchar" los cambios.\
Proporciona una forma para que los objetos comuniquen sus cambios a otros objetos interesados ​​en ellos.

## Participantes

- **Sujeto**: Conoce a sus observadores y proporciona una interfaz para adjuntar y desvincular objetos Observador.
- **Observador**: Define una interfaz de actualización para los objetos que deben ser notificados de los cambios en un sujeto.
- **SujetoConcreto**: Almacena el estado de interés para los objetos ObservadorConcreto y envía una notificación a sus observadores cuando su estado cambia.
- **ObservadorConcreto**: Mantiene una referencia a un objeto SujetoConcreto e implementa la interfaz de actualización del Observador para mantener su estado coherente con el del sujeto.

En C#, esta patrón se implementa típicamente de tres maneras:

1. Utilizando el enfoque "clásico" basado en interfaces
2. Los eventos/delegados idiomáticos de C#
3. El integrado .NET.

## Implementación sencilla (Interfaces)

Comencemos con un ejemplo básico: una agencia de noticias y sus suscriptores.

```
// Subject
public interface INewsAgency
{
    void Attach(ISubscriber subscriber);
    void Detach(ISubscriber subscriber);
    void Notify();
}

// ConcreteSubject
public class NewsAgency : INewsAgency
{
    private List<ISubscriber> _subscribers = new List<ISubscriber>();
    private string _news;
    public void Attach(ISubscriber subscriber)
    {
        _subscribers.Add(subscriber);
    }
    public void Detach(ISubscriber subscriber)
    {
        _subscribers.Remove(subscriber);
    }
    public void Notify()
    {
        foreach (var subscriber in _subscribers)
        {
            subscriber.Update(_news);
        }
    }
    public void ReleaseNews(string news)
    {
        _news = news;
        Notify();
    }
}
// Observer
public interface ISubscriber
{
    void Update(string news);
}
// ConcreteObserver
public class Newspaper : ISubscriber
{
    public void Update(string news)
    {
        Console.WriteLine($"Newspaper received news: {news}");
    }
}
```
