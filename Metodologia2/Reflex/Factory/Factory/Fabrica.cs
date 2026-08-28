using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Factory
{
    public class Fabrica
    {
        public IPizza CrearPizza(string tipo)
        {
            IPizza? pizza = null;
            if (tipo.Equals("Mozzarella"))
            {
                pizza = new Mozzarella();
            }
            else if (tipo.Equals("Fugazzeta"))
            {
                pizza = new Fugazzeta();
            }
            else if (tipo.Equals("Hawaiana"))
            {
                pizza = new Hawaiana();
            }
            else if (tipo.Equals("Jamon"))
            {
                pizza = new Jamon();
            }
            return pizza!;
        }
    }
}
