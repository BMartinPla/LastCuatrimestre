using System;

namespace Strategy
{
    public class MuteQuack: IQuackBehavior
    {
        
        public MuteQuack() {}

        public void quack()
        {
            Console.WriteLine("silence...");
        }
    }
}