using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Factory
{
    public interface IPizza
    {
        public void Preparar();
        public void Hornear();
        public void Cortar();
        public void PonerEnCaja();
    }
}
