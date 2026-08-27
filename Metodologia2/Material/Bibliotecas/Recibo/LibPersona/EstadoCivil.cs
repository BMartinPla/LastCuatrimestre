namespace LibPersona;

public class EstadoCivil
{
    int _id { get; set; }
    string _nombre { get; set; }

    public EstadoCivil(int id, string nombre)
    {
        _id = id;
        _nombre = nombre;
    }
     public override string ToString()
    {
        return $"Estado Civil: {{Id: {_id}, Nombre: {_nombre}}}";
    }


}
