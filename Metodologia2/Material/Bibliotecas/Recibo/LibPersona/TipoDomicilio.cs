namespace LibPersona;

public class TipoDomicilio
{
    int _id { get; set; }
    string _nombre { get; set; }

    public TipoDomicilio(int id, string nombre)
    {
        _id = id;
        _nombre = nombre;
    }
    public override string ToString()
    {
        return $"Tipo Domicilio: {{Id: {_id}, Nombre: {_nombre}}}";
    }

}
