using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Reflex
{
    public class Util
    {
        public static List<Propiedad> Propiedades(object O)
        {
            List<Propiedad> propiedades = new List<Propiedad>();
            Type tipoObjeto = O.GetType();
            PropertyInfo[] props = tipoObjeto.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            foreach (PropertyInfo p in props)
            {
                string clave = p.Name.ToLower();
                string tipo = p.PropertyType.Name.ToLower();
                object valor = p.GetValue(O, null)!;
                propiedades.Add(new Propiedad(clave, tipo, valor));
            }
            return propiedades;
        }

        public static string Xml(String nombre, Object o)
        {
            StringBuilder s = new StringBuilder();
            s.Append($"<{nombre}>");
            foreach(Propiedad p in Util.Propiedades(o))
            {
                s.Append($"\t{p}");
            }
            s.Append($"</{nombre}>");
            return s.ToString();
        }

        public static string Json(String nombre, Object o)
        {
            int cnt = 0;
            StringBuilder s = new StringBuilder();
            s.Append("{\n");
            s.Append($"\t\"Objeto\": \"{nombre}\",\n");
            List<Propiedad> props = Util.Propiedades(o);
            foreach(Propiedad p in props)
            {
                cnt += 1;
                s.Append($"\t\"{p.Clave}\": {{\n");
                s.Append($"\t\t\"Tipo\": \"{p.Tipo}\",\n");
                s.Append($"\t\t\"Valor\": \"{p.Valor}\"\n");
                if (cnt < props.Count)
                {
                    s.Append("\t},\n");
                }
                else
                {
                    s.Append("\t}\n");
                }
            
            }
            s.Append("}");
            return s.ToString();
        }

    }
}
