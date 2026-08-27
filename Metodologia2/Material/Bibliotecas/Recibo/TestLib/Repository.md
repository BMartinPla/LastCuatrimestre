# El patrón Repository

El patrón Repository en C# es un patrón de diseño que aísla la lógica de acceso a datos de la lógica de negocio mediante la creación de una capa de abstracción sobre la base de datos.  
Esta configuración permite que los servicios de negocio o los controladores de API interactúen con los datos como si se tratara de una colección en memoria, sin importar si el almacenamiento subyacente se basa en SQL Server, NoSQL o puntos finales HTTP externos.

## Componentes clave
- **Entidad de dominio**: Clases C# simples que representan los objetos de negocio principales.
- **Interfaz de repositorio**: Contratos que definen métodos de base de datos (Get, Add, Delete) sin detalles de implementación.
- **Repositorio concreto**: La clase que implementa la interfaz que ejecuta comandos de base de datos reales a través de ORM como Entity Framework Core o Dapper.

## Ejemplo de código paso a paso: 
El siguiente código ilustra cómo crear una configuración limpia de repositorio genérico utilizando Entity Framework Core.

1. Definir las entidades
```
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
}
```

2. Creación de interfaces genéricas
```
public interface IGenericRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T?> GetByIdAsync(int id);
    Task AddAsync(T entity);
    void Update(T entity);
    void Delete(T entity);
    Task SaveChangesAsync();
}
```

3. Implementar el repositorio genérico concreto
```
using Microsoft.EntityFrameworkCore;

public class GenericRepository<T> : IGenericRepository<T> where T : class
{
    protected readonly DbContext _context;
    protected readonly DbSet<T> _dbSet;

    public GenericRepository(DbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();

    public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

    public async Task AddAsync(T entity) => await _dbSet.AddAsync(entity);

    public void Update(T entity) => _dbSet.Update(entity);

    public void Delete(T entity) => _dbSet.Remove(entity);

    public async Task SaveChangesAsync() => await _context.SaveChangesAsync();
}
```
4. Definición de interfaces específicas del repositorio (si es necesario).
```
public interface IProductRepository : IGenericRepository<Product>
{
    Task<IEnumerable<Product>> GetFeaturedProductsAsync();
}

public class ProductRepository : GenericRepository<Product>, IProductRepository
{
    public ProductRepository(DbContext context) : base(context) { }

    public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
    {
        return await _dbSet.Where(p => p.Price > 100).ToListAsync();
    }
}
```
5. Registrar en Inyección de Dependencias (Program.cs)
```
builder.Services.AddScoped<IProductRepository, ProductRepository>();
``` 
6. Inyéctelo y utilícelo en su controlador o servicio.
```
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repository;

    public ProductsController(IProductRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<IActionResult> Get() => Ok(await _repository.GetAllAsync());
}
``` 

## Beneficios y desventajas arquitectónicas
### Pros
- **Aislamiento de referencias (concerns)**: los cambios en la infraestructura de base de datos subyacente no afectarán las reglas de negocio.
- **Pruebas unitarias simplificadas**: las interfaces de base de datos se pueden simular fácilmente utilizando bibliotecas de prueba sin depender de conexiones de base de datos reales.
- **Reutilización de código**: elimina las consultas de base de datos duplicadas dispersas aleatoriamente entre controladores y servicios.
- **ContrasPosible duplicación de código**: DbContext y DbSet de EF Core ya implementan un patrón nativo de repositorio/unidad de trabajo de forma predeterminada.
- **Abstracciones con fugas**: la lógica de filtrado compleja a menudo expone expresiones IQueryable específicas de EF a capas que se supone que deben permanecer independientes de los datos.

Para obtener orientación sobre bases de datos estructuradas, revise la documentación de Microsoft sobre la implementación de los patrones [Repositorio y Unidad de Trabajo](https://learn.microsoft.com/en-us/aspnet/mvc/overview/older-versions/getting-started-with-ef-5-using-mvc-4/implementing-the-repository-and-unit-of-work-patterns-in-an-asp-net-mvc-application) o consulte las perspectivas arquitectónicas en el tutorial del patrón de diseño [Repositorio de C# Corner](https://learn.microsoft.com/en-us/aspnet/mvc/overview/older-versions/getting-started-with-ef-5-using-mvc-4/implementing-the-repository-and-unit-of-work-patterns-in-an-asp-net-mvc-application).

