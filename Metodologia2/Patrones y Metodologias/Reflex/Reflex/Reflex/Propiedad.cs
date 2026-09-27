using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Reflex
{
    public class Propiedad
    {
        public string Clave { get; set; }
        public string Tipo { get; set; }
        public object Valor { get; set; }

        public Propiedad(string clave, string tipo, object valor)
        {
            Clave = clave;
            Tipo = tipo;
            Valor = valor;
        }

        public override string ToString()
        {
            return $"<{Clave} tipo=\"{Tipo}\">{Valor}</{Clave}>";
        }

    }
}
