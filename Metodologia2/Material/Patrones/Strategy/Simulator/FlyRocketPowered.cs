using System;

namespace Strategy
{
    public class FlyRocketPowered : IFlyBehavior
    {
        public FlyRocketPowered()
        {
            
        }

        public void fly()
        {
            Console.WriteLine("Flying like a rocket!!! Mars, here we go!!!!");
        }
    }
}