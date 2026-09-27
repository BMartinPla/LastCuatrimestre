using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NoDecoCondimentado
{
    internal class Cafe
    {
        private string Cafeteria = "Soul Caffe";
        protected string Descripcion { get; set; }
        protected Boolean Leche { get; set; } = false;
        protected Boolean LecheSoja { get; set; } = false;
        protected Boolean ChocolateRallado { get; set; } = false;

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
            string separador = "#-----------------------------";
            return $"{separador}Cafeteria ***{Cafeteria}***," + "Lo mejor de lo mejor!\n\tCafé";
        }

    }
}
