using LibPersona;

namespace LibSueldos;

public class Banco
{
    int _id { get; set; }
    string _nombre { get; set; }
    string _sucursal { get; set; }
    Domicilio _domicilio { get; set; }
    public string _CUIT { get; set; } = "No informado";

    public Banco(int id, string nombre, string sucursal, Domicilio domicilio)
    {
        _id = id;
        _nombre = nombre;
        _sucursal = sucursal;
        _domicilio = domicilio;
    }
    public override string ToString()
    {
        return $"Banco: Id: {_id}, Nombre: {_nombre}, Sucursal: {_sucursal}, Domicilio: {_domicilio}, CUIT: {_CUIT}";
    }
}