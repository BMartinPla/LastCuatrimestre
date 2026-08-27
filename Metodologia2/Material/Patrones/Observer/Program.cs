namespace Observer;

class Program
{
    static void Main(string[] args)
    {
        NewsAgency agency = new NewsAgency();
        agency.Attach(new NewsPaper());
        agency.Attach(new NewsPaper());
        agency.Attach(new NewsPaper());
        agency.Attach(new NewsPaper());
        NewsPaper rebeldon = new NewsPaper();
        agency.Attach(rebeldon);

        while (true)
        {
            Console.WriteLine("Ingrese Salir para terminar");
            Console.Write("Ingrese la noticia y pulse enter: ");
            String noticia = Console.ReadLine() ?? "No news...";
            if (noticia.ToUpper().Equals("SALIR"))
                break;
            else if (string.IsNullOrEmpty(noticia))
                agency.ReleaseNews("No news...");
            else
                agency.ReleaseNews($"{noticia}");
        }

        agency.Detach(rebeldon);
    }
}
