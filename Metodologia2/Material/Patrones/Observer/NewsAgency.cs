using System.Reflection.Metadata;

namespace Observer;

public class NewsAgency : INewsAgency
{
    private List<ISubscriber> _subscribers = new List<ISubscriber>();
    private string _news = "No news :(";

    public void Attach(ISubscriber subscriber)
    {
        _subscribers.Add(subscriber);
    }

    public void Detach(ISubscriber subscriber)
    {
        Console.WriteLine("Y ahora me voy. chau!!! No quiero mas noticias!!! Y me calenté!!!");
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