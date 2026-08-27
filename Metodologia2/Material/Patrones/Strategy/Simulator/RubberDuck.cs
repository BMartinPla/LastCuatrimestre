using System;

namespace Strategy
{
    public class RubberDuck : Duck    {

        public RubberDuck()
        {
            flybehavior = new FlyNoWay();
            quackbehavior = new Squeak();
        }
        public override void display()
        {
            Console.WriteLine("I am a rubber duck!");
        }
    }
}