using System; 
using LibPersona;

namespace LibSueldos;

public class Categoria
{
    public int _id { get; set; }
    public string _nombre { get; set; }
    public Categoria(int id, string nombre)
    {
        _id = id;
        _nombre = nombre;
    }
}