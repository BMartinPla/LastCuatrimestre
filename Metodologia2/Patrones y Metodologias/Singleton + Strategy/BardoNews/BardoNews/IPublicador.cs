using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BardoNews
{
    public interface IPublicador
    {
        public void RegistrarSuscriptor(ISuscriptor suscriptor);
        public void RemoverSuscriptor(ISuscriptor suscriptor);
        public void NotificarSuscriptores(Noticia noticia);
    }
}