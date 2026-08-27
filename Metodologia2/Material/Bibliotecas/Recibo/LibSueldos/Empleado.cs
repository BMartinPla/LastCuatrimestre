using System;
using LibPersona;

namespace LibSueldos;

public class Empleado
{
    public Empresa _empresa { get; set; }
    public int _legajo { get; set; }
    public Persona _persona { get; set; }
    public DateOnly _fingreso { get; set; }
    public string _CUIL { get; set; } = "No Informado";
    public Empleado() {}
    public Empleado(Empresa empresa, int legajo, Persona persona, DateOnly fingreso, string CUIL)
    {
        _empresa = empresa;
        _legajo = legajo;
        _persona = persona;
        _fingreso = fingreso;
        _CUIL = CUIL;
    }
    public override string ToString()
    {
        return $"Empleado: {_empresa}, {_persona}, Legajo: {_legajo}, F.Ingreso; {_fingreso}, CUIL: {_CUIL}";
    }
}