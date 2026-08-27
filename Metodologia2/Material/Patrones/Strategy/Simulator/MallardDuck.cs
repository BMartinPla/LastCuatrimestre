using System;

namespace Strategy
{
    public class MallardDuck : Duck
    {

        public MallardDuck()
        {
            flybehavior = new FlyWithWings();
            quackbehavior = new Quack();
        }
        public override void display()
        {
            Console.WriteLine("I am a mallard duck!");
        }

    }
}