using LibPersona;

namespace LibSueldos;
public class BancoEmpleado
{
    int _id { get; set; }
    Empleado _empleado;
    Banco _banco;
    string _cbu { get; set; }
    double _cuenta { get; set; }
    string _alias { get; set; }

    public BancoEmpleado(int id, Empleado empleado, Banco banco, string cbu, double cuenta, string alias)
    {
        _id = id;
        _empleado = empleado;
        _banco = banco;
        _cbu = cbu;
        _cuenta = cuenta;
        _alias = alias;
    }
    public override string ToString()
    {
        return $"Banco Empleado: {_empleado}, {_banco}, CBU: {_cbu}, Cuenta: {_cuenta}, Alias: {_alias}";
    }
}