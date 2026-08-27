using System;

namespace Strategy
{
    public class Quack: IQuackBehavior
    {
        
        public Quack() {}

        public void quack()
        {
            Console.WriteLine("QUACK!!!!!");
        }
    }
}