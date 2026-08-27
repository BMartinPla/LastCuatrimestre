namespace LibPersona;

public class Pais
{
    int _id { get; set; }
    string _nombre { get; set; }

    public Pais(int id, string nombre)
    {
        _id = id;
        _nombre = nombre;
    }

    public override string ToString()
    {
        return $"Pais: {{Id: {_id}, Nombre: {_nombre}}}";
    }
}
