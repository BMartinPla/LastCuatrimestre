namespace Strategy;

class Program
{
    static void Main(string[] args)
    {
        MallardDuck mallardduck = new MallardDuck();
        Console.WriteLine("-------------------------------------------");
        mallardduck.display();
        mallardduck.swim();
        mallardduck.performQuack();
        mallardduck.performFly();

        RedHeadDuck redheadduck = new RedHeadDuck();
        Console.WriteLine("-------------------------------------------");
        redheadduck.display();
        redheadduck.swim();
        redheadduck.performQuack();
        redheadduck.performFly();

        RubberDuck rubberduck = new RubberDuck();
        Console.WriteLine("-------------------------------------------");
        rubberduck.display();
        rubberduck.swim();
        rubberduck.performQuack();
        rubberduck.performFly();

        DecoyDuck decoyduck = new DecoyDuck();
        Console.WriteLine("-------------------------------------------");
        decoyduck.display();
        decoyduck.swim();
        decoyduck.performQuack();
        decoyduck.performFly();

        ModelDuck modelduck = new ModelDuck();
        Console.WriteLine("-------------------------------------------");
        modelduck.display();
        modelduck.swim();
        modelduck.performQuack();
        modelduck.setQuackBehavior(new BelieveQuack());
        modelduck.performQuack();

        modelduck.performFly();
        modelduck.setFlyBehavior(new FlyRocketPowered());
        modelduck.performFly();
    }
}
