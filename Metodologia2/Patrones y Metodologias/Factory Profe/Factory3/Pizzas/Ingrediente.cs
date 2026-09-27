namespace PizzaMaster.Pizzas
{
    public class Ingrediente
    {
        public string Nombre { get; set; }
        public float Precio { get; set; }
        public string? Descripcion { get; set; }

        public Ingrediente(string nombre, float precio)
        {
            Nombre = nombre;
            Precio = precio;
        }
        public Ingrediente(string nombre, float precio, string descripcion)
        {
            Nombre = nombre;
            Precio = precio;
            Descripcion = descripcion;
        }
        public override string ToString()
        {
            return $"{Nombre}: ${Precio}";
        }
    }
}