using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoDecoCafe
{
    internal class Cafe
    {
        private string Cafeteria = "Soul Caffe";
        protected string Descripcion { get; set; }
        public virtual float Costo()
        {
            return 0F;
        }

        public Cafe(String descripcion)
        {
            Descripcion = descripcion;
        }

        public override string ToString()
        {
            return $"Cafeteria {Cafeteria}, lo mejor de lo mejor";
        }

    }
}
