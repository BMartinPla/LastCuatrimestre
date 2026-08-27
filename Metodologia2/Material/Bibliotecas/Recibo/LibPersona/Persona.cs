using System.Collections.Generic;

namespace LibPersona;

public class Persona
{
    public int _id { get; set; }
    public string _apellido { get; set; }
    public string _nombre { get; set; }
    public TipoDocumento _tipodocumento { get; set; }
    public string _documento { get; set; }
    public Genero _genero { get; set; }
    public EstadoCivil _estadocivil { get; set; }
    public DateOnly _fnacto { get; set; }
    public List<Contacto> _contactos { get; set; }
    public List<Domicilio> _domicilios { get; set; }

    public Persona() { }
    public Persona (int id, string apellido, string nombre,
                    TipoDocumento tipodocumento,
                    string documento, Genero genero,
                    EstadoCivil estadocivil, DateOnly fnacto,
                    List<Contacto> contactos,
                    List<Domicilio> domicilios)
    {
        _id = id;
        _apellido = apellido;
        _nombre = nombre;
        _tipodocumento = tipodocumento;
        _documento = documento;
        _genero = genero;
        _estadocivil = estadocivil;
        _fnacto = fnacto;
        _contactos = contactos;
        _domicilios = domicilios;
    }

    public override string ToString()
    {
        int cnt = 0;
        string coma = ", ";
        string nada = "";

        string persona = $"Persona: {{Nombre: {_nombre}, Apellido: {_apellido}, {_tipodocumento}, ";
        persona += $"Nro Documento:{_documento}, {_genero}, {_estadocivil}, F.Nacto: {_fnacto.ToString()}, ";
        persona += "Contactos: [";
        foreach (var c in _contactos)
        {
            persona += $"{(cnt==0?nada:coma)}{c}";
            cnt++;
        }
        persona += "], ";
        cnt = 0;
        persona += "Domicilios: [";
        foreach (var d in _domicilios)
        {
            persona += $"{(cnt==0?nada:coma)}{d}";
            cnt++;
        }
        persona += "]}}";
        return persona;
    }
}