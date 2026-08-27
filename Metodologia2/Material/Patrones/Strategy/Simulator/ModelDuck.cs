using System; 

namespace Strategy
{
    public class ModelDuck: Duck
    {
        public ModelDuck()
        {
            flybehavior = new FlyNoWay();
            quackbehavior = new MuteQuack();
        }

        public override void display()
        {
            Console.WriteLine("I am a model duck...");
        }
    }
}