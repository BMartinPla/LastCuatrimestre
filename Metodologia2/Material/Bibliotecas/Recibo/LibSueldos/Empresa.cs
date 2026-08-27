using LibPersona;

namespace LibSueldos;

public class Empresa
{
    int _id { get; set; }
    string _razonsocial { get; set; }
    string _CUIT { get; set; }
    Domicilio _domicilio { get; set; }

    public Empresa (int id, string razonsocial, string CUIT, Domicilio domicilio)
    {
        _id = id;
        _razonsocial = razonsocial;
        _CUIT = CUIT;
        _domicilio = domicilio;
    }
    public override string ToString()
    {
        return $"Empresa: Id: {_id}, Razon Social: {_razonsocial}, CUIT: {_CUIT}, Domicilio: { _domicilio}";
    }

}