namespace LibPersona;

public class Contacto
{
    int _id { get; set; } 
    TipoContacto _tipocontacto { get; set; }
    string _contacto { get; set; }

    public Contacto(int id, TipoContacto tipocontacto, string contacto)
    {
        _id = id;
        _tipocontacto = tipocontacto;
        _contacto = contacto;
    }
    public override string ToString()
    {
        return $"Contacto: {{Id: {_id}, {_tipocontacto}, Contacto: {_contacto}}} ";
    }

}