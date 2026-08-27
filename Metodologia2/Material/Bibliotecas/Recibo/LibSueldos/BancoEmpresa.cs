using LibPersona;

namespace LibSueldos;
public class BancoEmpresa
{
    int _id { get; set; }
    Empresa _empresa;
    Banco _banco;
    string _cbu { get; set; }
    double _cuenta { get; set; }
    string _alias { get; set; }

    public BancoEmpresa(int id, Empresa empresa, Banco banco, string cbu, double cuenta, string alias)
    {
        _id = id;
        _empresa = empresa;
        _banco = banco;
        _cbu = cbu;
        _cuenta = cuenta;
        _alias = alias;
    }
    public override string ToString()
    {
        return $"Banco Empresa: {_empresa}, {_banco}, CBU: {_cbu}, Cuenta: {_cuenta}, Alias: {_alias}";
    }
}