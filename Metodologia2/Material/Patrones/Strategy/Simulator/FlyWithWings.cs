using System;

namespace Strategy
{
    public class FlyWithWings : IFlyBehavior
    {
        public FlyWithWings()
        {
            
        }

        public void fly()
        {
            Console.WriteLine("Flying witjh wings");
        }
    }
}