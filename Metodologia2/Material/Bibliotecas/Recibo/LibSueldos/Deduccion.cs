using System.Data.Common;

namespace LibSueldos;

public class Deduccion
{
    int _codigo { get; set; }
    string _detalle { get; set; }
    int _dias_aplicados { get; set; }
    float _monto { get; set; }
    float _porcentaje { get; set; }

    public Deduccion(int codigo, string detalle, int dias, float monto, float porcentaje) 
    {
        _codigo = codigo;
        _detalle = detalle;
        _dias_aplicados = dias;
        _monto = monto;    
        _porcentaje = porcentaje;
    }

    public override string ToString()
    {
        return $"Deduccion: Codigo: {_codigo}, Detalle: {_detalle}, Dias Aplicados: {_dias_aplicados}, Monto: {_monto:F2}";
    }
}