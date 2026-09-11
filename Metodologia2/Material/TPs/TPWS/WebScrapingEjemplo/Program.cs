using System;
using System.Net.Http;
using System.Threading.Tasks;
using HtmlAgilityPack; // Libreria no default, necesario instalar.

class Program
{
    static async Task Main(string[] args)
    {
        string url = "https://quotes.toscrape.com"; // Sitio de prueba diseñado para scraping

        using HttpClient client = new HttpClient();
        
        // Request
        string html = await client.GetStringAsync(url);

        // Se carga el HTML en un documento parseable
        HtmlDocument doc = new HtmlDocument();
        doc.LoadHtml(html);

        // Seleccionamos los nodos que nos interesan (usando XPath)
        var quoteNodes = doc.DocumentNode.SelectNodes("//div[@class='quote']");

        if (quoteNodes == null)
        {
            Console.WriteLine("No se encontraron citas.");
            return;
        }

        // Extraemos y mostramos los datos
        foreach (var quote in quoteNodes)
        {
            string text = quote.SelectSingleNode(".//span[@class='text']")?.InnerText;
            string author = quote.SelectSingleNode(".//small[@class='author']")?.InnerText;

            Console.WriteLine($"Frase: {text}");
            Console.WriteLine($"Autor: {author}");
            Console.WriteLine(new string('-', 40));
        }
    }
}