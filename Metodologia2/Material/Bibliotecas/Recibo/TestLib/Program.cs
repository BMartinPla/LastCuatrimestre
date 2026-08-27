using LibPersona;
using LibUtil;
using System;
using System.Reflection;
using System.Text.Json;

namespace TestLib;

public class Program {
    public static void Main(string[] args)
    {

        Pais pais = new Pais(1,"Argentina");
        Provincia provincia = new Provincia(1,pais, "Buenos Aires");
        Localidad localidad = new Localidad(1, provincia, "San Nicolas");
        Genero g = new Genero(1,"Masculino");
        EstadoCivil ec = new EstadoCivil(1,"Casado");
        TipoDocumento tdoc = new TipoDocumento(1, pais, "DNI");

        Console.WriteLine(g);
        Console.WriteLine(Utils.GenJson(g));
        Console.WriteLine(Utils.GenXml(g));
        Console.WriteLine(tdoc);
        Console.WriteLine(Utils.GenJson(tdoc));
        Console.WriteLine(Utils.GenXml(tdoc));
        

        string[] ctos = {"Celular","Whatsapp","Email", "SMS", "Instagram", "Facebook"};
        int cnt = 1;
        List<TipoContacto> tiposcontacto = new List<TipoContacto>();
        foreach(var tcon in ctos)
        {
            tiposcontacto.Add(new TipoContacto(cnt, tcon));
            cnt++;
        }

        string[] tipdom = { "Particular","Comercial", "De un familiar"};
        cnt = 1;
        List<TipoDomicilio> tiposdom = new List<TipoDomicilio>();
        foreach(var tdom in tipdom)
        {
            tiposdom.Add(new TipoDomicilio(cnt, tdom));
            cnt++;
        }

        Persona p = new Persona(
            1, "Arce","Juan", tdoc, "13798792", g, ec, new DateOnly(1959,10,17),
            new List<Contacto> {
                new Contacto(1,tiposcontacto[0],"3364400985"), 
                new Contacto(2,tiposcontacto[2],"jarce@frsn.utn.edu.ar")},
            new List<Domicilio>
            {
                new Domicilio(1,tiposdom[0],localidad,"Pellegrini 672", "2900"),
                new Domicilio(2,tiposdom[1],localidad,"Brown 123", "2900")
            }
        );
        //Console.WriteLine(p);
        Console.WriteLine("...............................................");
        Console.WriteLine(Utils.GenXml(p));
        Console.WriteLine("...............................................");
        //Console.WriteLine(Utils.GenXml(pais));
        //Console.WriteLine(Utils.GenXml(provincia));
        //Console.WriteLine(Utils.GenXml(tdoc));
        Console.WriteLine("...............................................");
        Console.WriteLine(Utils.GenJson(p));
    }
}
