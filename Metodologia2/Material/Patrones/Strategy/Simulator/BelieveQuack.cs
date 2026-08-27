using System;

namespace Strategy
{
    public class BelieveQuack: IQuackBehavior
    {
        
        public BelieveQuack() {}

        public void quack()
        {
            Console.WriteLine("I believe I can quack, I believe I can reach the sky....");
        }
    }
}