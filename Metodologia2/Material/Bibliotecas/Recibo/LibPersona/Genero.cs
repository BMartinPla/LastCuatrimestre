namespace LibPersona;

public class Genero
{
    int _id { get; set; }
    string _nombre { get; set; }

    public Genero(int id, string nombre)
    {
        _id = id;
        _nombre = nombre;
    }

    public override string ToString()
    {
        return $"Genero: {{Id: {_id}, Nombre: {_nombre}}}";
    }

}
