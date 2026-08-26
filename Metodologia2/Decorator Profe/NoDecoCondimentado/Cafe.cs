using System;
using System.Diagnostics;

namespace NoDecoCafe
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
            string separador = "# ------------------------------------------------";
            return $"{separador}\nCafeteria ***{Cafeteria}***," + 
                "Lo mejor de lo mejor!\n\tCafé";
        }
    }
    
}