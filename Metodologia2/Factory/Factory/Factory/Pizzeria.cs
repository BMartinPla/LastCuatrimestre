using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Factory
{
    public class Pizzeria
    {
        Fabrica _fabrica;

        public Pizzeria(Fabrica fabrica)
        {
            _fabrica = fabrica;
        }
        public IPizza OrdenarPizza(String tipo)
        {
            IPizza pizza = _fabrica.CrearPizza(tipo);
            return pizza;
        }
    }
}
