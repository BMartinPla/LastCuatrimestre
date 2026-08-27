using System; 

namespace Strategy
{
    public class DecoyDuck: Duck
    {
        public DecoyDuck()
        {
            flybehavior = new FlyNoWay();
            quackbehavior = new MuteQuack();
        }

        public override void display()
        {
            Console.WriteLine("I am a decoy duck...");
        }
    }
}