using StarbuzzCoffe.Components;

namespace StarbuzzCoffe.Decorators
{
    public abstract class CondimentDecorator : Beverage
    {
        public abstract override string Description { get; }
    }
}
