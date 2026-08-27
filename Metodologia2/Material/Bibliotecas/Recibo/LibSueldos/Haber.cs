using System.Data.Common;

namespace LibSueldos;

public class Haber
{
    int _codigo { get; set; }
    string _detalle { get; set; }
    int _dias_aplicados { get; set; }
    float _monto { get; set; }
    public Haber(int codigo, string detalle, int dias, float monto) 
    {
        _codigo = codigo;
        _detalle = detalle;
        _dias_aplicados = dias;
        _monto = monto;    
    }
    public override string ToString()
    {
        return $"Haber: Codigo: {_codigo}, Detalle: {_detalle}, Dias Aplicados: {_dias_aplicados}, Monto: {_monto:F2}";
    }
}