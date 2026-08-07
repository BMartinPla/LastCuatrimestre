using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BardoNews
{
    internal class Noticia
    {

        DateTime Fecha {  get; set; }

        String Autor {  get; set; }

        String Texto { get; set; }

        public Noticia()
        {
            Fecha = DateTime.Now;
            Autor = "Unknown";
            Texto = "Lorem";
        }

        public Noticia(DateTime fecha, string autor, string texto)
        {
            Fecha = fecha;
            Autor = autor;
            Texto = texto;
        }

        public Noticia(string autor, string texto)
        {
            Fecha = DateTime.Now;
            Autor = autor;
            Texto = texto;
        }

        public Noticia(string texto)
        {
            Fecha = DateTime.Now;
            Autor = "Anonimo";
            Texto = texto;
        }

        public override string ToString()
        {
            return $"\tFecha: {Fecha.ToString("dd/MM/yyyy HH:mm:ss")}\n" + 
                $"\tAutor: {Autor}\n\tTexto: {Texto}";
        }

    }
}
