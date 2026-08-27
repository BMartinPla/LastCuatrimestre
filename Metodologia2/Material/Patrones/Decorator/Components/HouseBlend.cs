using StarbuzzCoffe.Components;

namespace StarbuzzCoffe.Components
{
    public class HouseBlend : Beverage
    {
        public HouseBlend()
        {
            Description = "House Blend Coffe";
        }

        public override double Cost()
        {
            return .89;
        }
    }
}