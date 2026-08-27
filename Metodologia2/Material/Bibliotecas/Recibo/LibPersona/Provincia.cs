namespace LibPersona;

public class Provincia
{
    int _id { get; set; }
    Pais _pais { get; set; }
    string _nombre { get; set; }

    public Provincia(int id, Pais pais, string nombre)
    {
        _id = id;
        _pais = pais;
        _nombre = nombre;
    }
    public override string ToString()
    {
        return $"Provincia: {{Id: {_id}, Nombre: {_nombre}, {_pais}}}";
    }

}
