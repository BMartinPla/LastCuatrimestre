namespace Factory
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Pizzeria Millonarios = new Pizzeria(new Fabrica());
            Millonarios.OrdenarPizza("Mozzarella");
            Millonarios.OrdenarPizza("Jamon");
            Millonarios.OrdenarPizza("Hawaiana");
            Millonarios.OrdenarPizza("Fugazzeta");
        }
    }
}