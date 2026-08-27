using StarbuzzCoffe.Components;

namespace StarbuzzCoffe.Components
{
    public class DarkRoast : Beverage
    {
        public DarkRoast()
        {
            Description = "Dark Roast Coffe";
        }

        public override double Cost()
        {
            return .99;
        }
    }
}