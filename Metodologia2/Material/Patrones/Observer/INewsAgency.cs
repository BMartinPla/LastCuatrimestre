// This is the Subject

namespace Observer;

public interface INewsAgency
{
    void Attach(ISubscriber subscriber);
    void Detach(ISubscriber subscriber);
    void Notify();
}