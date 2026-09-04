using System.Reflection.Metadata.Ecma335;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");



// 2 api

var jugador = new[]
{
    "Pepa", "Pepe", "Pepi", "Pepo", "Pepu", "Oscar", "Marcos", "Diego", "Carlos", "Jason", "Santiago", "Rodrigo", "Roque", "Ciro"
};

var equipos = new[]
{
    "River", "Boca", "Racing", "Independiente", "San Lorenzo"
};

var equiposExt = new[]
{
    "Manchester City", "Real Madrid", "Milan", "Liverpool", "Barcelona"
};

app.MapGet("/mercadodepases", () =>
{
    var contarClubes = Enumerable.Range(1, 5).Select(index =>
        new Clubes
        (
            jugador[Random.Shared.Next(jugador.Length)],
            equipos[Random.Shared.Next(equiposExt.Length)],
            equiposExt[Random.Shared.Next(equiposExt.Length)],
            Random.Shared.Next(1, 8),
            Random.Shared.Next(10, 70)
            
        ))
        .ToArray();
    return contarClubes;
});

app.Run();



// records

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

record Clubes(string? Jugador, string? Equipo, string? VendidoAl, int AñosDeContrato, double IngresosBrutosEnMUSD)
{
    public double IngresosNetosEnMUSD => Math.Round((IngresosBrutosEnMUSD / 100) * 79, 2);
}