namespace LibPersona;

public class Localidad
{
    int _id { get; set; }
    Provincia _provincia { get; set; }
    string _nombre { get; set; }

    public Localidad(int id, Provincia provincia, string nombre)
    {
        _id = id;
        _provincia = provincia;
        _nombre = nombre;
    }
    public override string ToString()
    {
        return $"Localidad: {{Id: {_id}, Nombre: {_nombre}, {_provincia}}}";
    }

}
