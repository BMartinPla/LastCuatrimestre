using System;
using StarbuzzCoffe.Components;
using StarbuzzCoffe.Decorators;

namespace StarbuzzCoffe.Decorators
{
    public class Whip : CondimentDecorator
    {
        private readonly Beverage _beverage;

        public Whip(Beverage beverage)
        {
            _beverage = beverage;
        }

        public override string Description => _beverage.Description + ", Whip";

        public override double Cost()
        {
            return .10 + _beverage.Cost();
        }
    }
}

