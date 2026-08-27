namespace LibPersona;

public class TipoDocumento
{
    int _id { get; set; }
    Pais _pais {get; set; }
    string _nombre { get; set; }

    public TipoDocumento(int id, Pais pais, string nombre)
    {
        _id = id;
        _pais = pais;
        _nombre = nombre;
    }
    public override string ToString()
    {
        return $"Tipo Documento: {{Id: {_id}, Nombre: {_nombre}, {_pais}}}";
    }

}
