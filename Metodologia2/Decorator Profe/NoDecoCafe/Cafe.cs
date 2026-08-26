using System;
using System.Diagnostics;

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