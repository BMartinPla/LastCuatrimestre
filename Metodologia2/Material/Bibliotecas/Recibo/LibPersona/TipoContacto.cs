namespace LibPersona;

public class TipoContacto
{
    int _id { get; set; }
    string _nombre { get; set; }

    public TipoContacto(int id, string nombre)
    {
        _id = id;
        _nombre = nombre;
    }
    public override string ToString()
    {
        return $"Tipo Contacto: {{Id: {_id}, Nombre: {_nombre}}}";
    }

}
