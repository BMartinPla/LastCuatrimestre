using System;
using System.Runtime.CompilerServices;

namespace Strategy
{
    public abstract class Duck
    {
        public IFlyBehavior? flybehavior ;
        public IQuackBehavior? quackbehavior;

        protected Duck() {}

        public void performQuack()
        {
            quackbehavior?.quack();
        }
        public void setQuackBehavior(IQuackBehavior qb)
        {
            quackbehavior = qb;
        }

        public void performFly() {
            flybehavior?.fly();
        }

        public void setFlyBehavior(IFlyBehavior fb)
        {
            flybehavior = fb;
        }

        public void swim()
        {
            Console.WriteLine("All ducks can swim, or at least float...");
        }

        public abstract void display();
    }
}