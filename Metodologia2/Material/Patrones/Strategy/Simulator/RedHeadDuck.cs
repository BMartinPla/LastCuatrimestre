using System;

namespace Strategy
{
    public class RedHeadDuck : Duck
    {

        public RedHeadDuck()
        {
            flybehavior = new FlyWithWings();
            quackbehavior = new Quack();
        }
        public override void display()
        {
            Console.WriteLine("I am a red head duck!");
        }

    }
}