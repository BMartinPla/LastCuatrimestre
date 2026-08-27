using LibPersona;

namespace LibSueldos;

public class Recibo
{
    Empleado _empleado;
    List<Haber> _haberes = new List<Haber>();
    List<Deduccion> _deducciones = new List<Deduccion>();
    DateOnly _periodo;
    BancoEmpleado _banco { get; set; }

    public Recibo(Empleado empleado,  List<Haber> haberes, 
            List<Deduccion> deducciones, DateOnly periodo,
            BancoEmpleado banco)
    {
        _empleado = empleado;
        _haberes = haberes;
        _deducciones = deducciones;
        _periodo = periodo;
        _banco = banco;
    }
}