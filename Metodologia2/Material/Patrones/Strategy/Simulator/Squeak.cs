using System;

namespace Strategy
{
    public class Squeak: IQuackBehavior
    {
        
        public Squeak() {}

        public void quack()
        {
            Console.WriteLine("squeak...");
        }
    }
}