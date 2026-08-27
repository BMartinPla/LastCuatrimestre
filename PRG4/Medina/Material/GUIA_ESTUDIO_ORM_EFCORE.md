# Guía de Estudio — ORM y Entity Framework Core

> **Resumen** de `ORM.pptx` + `EF_Core.pptx` + proyecto `IntroEF_CF`. Lectura ~20 min. Para repasar antes del parcial.

---

## 1. ¿Qué es un ORM?

**Object-Relational Mapping**: técnica/librería que convierte automáticamente entre el mundo **orientado a objetos** y el **relacional**, evitando escribir SQL a mano.

| Mundo Objetos | Mundo Relacional |
|---|---|
| `class Pelicula` | `TABLE Peliculas` |
| propiedad `Titulo` | columna `Titulo` |
| `new Pelicula { Id=2 }` | fila con `Id=2` |
| referencia `pelicula.Generos` | FK + tabla intermedia + `JOIN` |

> Definición y tabla de mapeo: `ORM.pptx:slide3` + `EF_Core.pptx:slide2`

```
class Usuario { id, nombre, email }  ── ORM mapea ──►  TABLE usuarios (id | nombre | email | creado_en)
u = Usuario(nombre="Ana")           ── INSERT ──►    1 | Ana | ana@mail.com | 2026-08-01
```

---

## 2. El problema de fondo: *Impedance Mismatch*

Dos modelos incompatibles (`ORM.pptx:slide2`):

*   **Objetos**: herencia, referencias/punteros, colecciones anidadas (`List<Libro>`), identidad por instancia, comportamiento encapsulado.
*   **Relacional**: tablas planas, PK/FK, `JOIN`, sin herencia nativa, datos separados del comportamiento.

El ORM es el **traductor** entre ambos mundos. Es una *abstracción con fugas*: tarde o temprano tenés que entender el SQL que genera.

---

## 3. Patrones de diseño

| Patrón | Idea | Cómo se ve | Ejemplos |
|---|---|---|---|
| **Active Record** | El objeto sabe persistirse | `usuario.save()` / `Usuario.find(id)` | Rails ActiveRecord, Django ORM, Eloquent |
| **Data Mapper** | Persistencia separada del dominio | `session.add(usuario)` / `context.Usuarios.Where(...)` | **EF Core**, Hibernate/JPA, SQLAlchemy, Doctrine |

**EF Core es Data Mapper**: el `DbContext` es la sesión; las entidades POCO no saben nada de BD (`EF_Core.pptx:slide2`, `ORM.pptx:slide7`).

---

## 4. Arquitectura de EF Core

```
Tu App (POCOs) → DbContext → Change Tracker → Provider → Base de Datos
   C# normal    agrupador    detecta cambios   traduce LINQ   SQL Server / PostgreSQL / SQLite...
                DbSet<T>     desde el load     al dialecto
                SaveChanges()
```

*   `DbContext`: sesión activa contra la BD, agrupa los `DbSet<T>` y confirma con `SaveChanges()` (`EF_Core.pptx:slide3`).
*   `DbSet<T>`: cada tabla expuesta como colección consultable con LINQ.
*   `Change Tracker`: sabe qué objetos cambiaron desde que se cargaron.
*   `Provider`: paquete NuGet por motor (`IntroEF.csproj:11` — `Microsoft.EntityFrameworkCore.SqlServer`).

**Registro en DI** (`Program.cs:16`):
```csharp
builder.Services.AddDbContext<ApplicationDbContext>(op =>
    op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddAutoMapper(typeof(Program));
```

---

## 5. El `DbContext` del proyecto

`ApplicationDbContext.cs:8` es el centro de todo:

```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<Genero> Generos => Set<Genero>();           // tabla Generos
    public DbSet<Actor> Actores => Set<Actor>();
    public DbSet<Pelicula> Peliculas => Set<Pelicula>();
    public DbSet<Comentario> Comentarios => Set<Comentario>();
    public DbSet<PeliculaActor> PeliculasActores => Set<PeliculaActor>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        mb.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly()); // carga todas las Config
        SeedingInicial.Seed(mb);                                            // datos iniciales
    }
    protected override void ConfigureConventions(ModelConfigurationBuilder c)
    {
        c.Properties<string>().HaveMaxLength(150); // convención global
    }
}
```

Claves: `ApplyConfigurationsFromAssembly` evita registrar cada `IEntityTypeConfiguration` a mano; `ConfigureConventions` pone `varchar(150)` por defecto a todos los `string`.

---

## 6. Modelado: entidades y relaciones

POCOs simples — EF infiere el resto (`EF_Core.pptx:slide5`, `Entidades/*.cs`):

```csharp
// Entidades/Pelicula.cs:3 — 1:N con Comentario, M:N con Genero, M:N con payload con Actor
public class Pelicula {
    public int Id { get; set; }
    public string Titulo { get; set; } = null!;
    public bool EnCines { get; set; }
    public DateTime FechaEstreno { get; set; }
    public HashSet<Comentario> Comentarios { get; set; } = new();
    public HashSet<Genero> Generos { get; set; } = new();          // M:N sin entidad intermedia (skip)
    public List<PeliculaActor> PeliculasActores { get; set; } = new(); // M:N con payload
}
// Entidades/Comentario.cs:3 — 1:N (FK explícita)
public class Comentario {
    public int Id { get; set; }
    public string? Contenido { get; set; }
    public int PeliculaId { get; set; }   // FK por convención <Navegación>Id
    public Pelicula Pelicula { get; set; } = null!; // navegación
}
// Entidades/PeliculaActor.cs:3 — M:N con datos extra (Personaje, Orden)
public class PeliculaActor {
    public int PeliculaId { get; set; }   // PK compuesta (ActorId, PeliculaId)
    public int ActorId { get; set; }
    public string Personaje { get; set; } = null!;
    public int Orden { get; set; }
}
```

Tipos de relación:

*   **1:N** — `Pelicula 1—N Comentario` (FK `PeliculaId` en `Comentario`).
*   **M:N sin payload** — `Pelicula M—N Genero` (EF crea tabla oculta `GeneroPelicula` — ver `SeedingInicial.cs:73`).
*   **M:N con payload** — `Pelicula M—N Actor` vía `PeliculaActor` con `Personaje`/`Orden` y PK compuesta (`PeliculaActorConfig.cs:10`).

**Propiedades de navegación** permiten `pelicula.Generos` o `actor.PeliculasActores` en C# puro.

---

## 7. Convenciones de EF Core

Si no configurás nada, EF infiere (`EF_Core.pptx:slide7`):

| Regla | Convención |
|---|---|
| PK | prop `Id` o `<Clase>Id` (ej. `PeliculaId`) |
| Tabla | nombre del `DbSet<T>` (`Peliculas`) |
| Columna | tipo C# → tipo SQL (`string` → `nvarchar(max)` / `nvarchar(150)` por `ConfigureConventions`) |
| FK | `<Navegación>Id` → `AutorId` para `Autor` |
| Required | tipos no-nullable (`string` con `= null!`) → `NOT NULL`; `string?` → `NULL` |
| Relaciones | detectadas por navegaciones `List<>`/`HashSet<>` |

Cuando la convención no alcanza → **Data Annotations** o **Fluent API**.

---

## 8. Data Annotations vs Fluent API

`EF_Core.pptx:slide8`

| | Data Annotations | Fluent API |
|---|---|---|
| Dónde | Atributos sobre la clase | `OnModelCreating` / `IEntityTypeConfiguration<T>` |
| Ejemplo | `[Required, MaxLength(200)] public string Titulo {get;set;}` | `builder.Property(p=>p.Titulo).IsRequired().HasMaxLength(200)` |
| Pros | Rápido, legible | Poder total, entidades limpias |
| Contras | Mezcla persistencia con dominio, no cubre todo | Más verboso |

**En el proyecto se usa Fluent API separada** (`ApplyConfigurationsFromAssembly`):

```csharp
// Entidades/Configuraciones/PeliculaConfig.cs:8
builder.Property(a => a.FechaEstreno).HasColumnType("date");
// ActorConfig.cs:11 — precisión decimal + tipo fecha
builder.Property(a => a.Fortuna).HasPrecision(18, 2);
builder.Property(a => a.FechaNacimiento).HasColumnType("date");
// GeneroConfig.cs:14 — índice único
builder.HasIndex(p => p.Nombre).IsUnique();
// PeliculaActorConfig.cs:10 — PK compuesta
builder.HasKey(pa => new { pa.ActorId, pa.PeliculaId });
// ComentarioConfig.cs:11
builder.Property(a => a.Contenido).HasMaxLength(500);
```

Fluent API completa (`EF_Core.pptx:slide9`): `ToTable()`, `HasKey()`, `HasOne().WithMany().HasForeignKey()`, `HasIndex().IsUnique()`.

---

## 9. Code First vs Database First

`ORM.pptx:slide9` + `EF_Core.pptx:slide10,11,12`

| | **Code First** (el código manda) | **Database First** (la BD manda) |
|---|---|---|
| Flujo | 1. Clases POCO → 2. `dotnet ef migrations add Init` → 3. Revisar `Up()/Down()` → 4. `dotnet ef database update` | 1. BD existente → 2. Instalar Tools + proveedor → 3. `dotnet ef dbcontext scaffold "conn" SqlServer -o Models` → 4. Ajustar |
| Ideal | Proyecto nuevo (greenfield), el equipo controla el esquema | Legacy, BD compartida, DBA administra |
| Versionado | Sí, migraciones junto al código | No (el esquema ya existe) |
| Proyecto | **IntroEF usa Code First** | — |

**Tabla de decisión** (`EF_Core.pptx:slide12`): si controlás el esquema → Code First; si la BD ya existe → Database First.

---

## 10. CRUD esencial

`EF_Core.pptx:slide6` + controladores del proyecto:

```csharp
// CREATE — GenerosController.cs:41 + ActoresController.cs:80
var genero = mapper.Map<Genero>(dto);
context.Add(genero);                    // o AddRange para varios (GenerosController.cs:51)
await context.SaveChangesAsync();

// READ — ActoresController.cs:26 + PeliculasController.cs:25
var todos = await context.Actores.OrderByDescending(a=>a.FechaNacimiento).ToListAsync();
var uno = await context.Actores.FirstOrDefaultAsync(a=>a.Id==id);
var filtrados = await context.Actores.Where(a=>a.Nombre.Contains(nombre)).ToListAsync(); // ActoresController.cs:44
var rango = await context.Actores.Where(a=>a.FechaNacimiento>=ini && a.FechaNacimiento<=fin).ToListAsync();

// UPDATE — dos variantes en GenerosController.cs:59 y :74
var g = await context.Generos.FirstOrDefaultAsync(x=>x.Id==id); g.Nombre+="2"; await context.SaveChangesAsync(); // tracked
// o detached:
var genero2 = mapper.Map<Genero>(dto); genero2.Id=id; context.Update(genero2); await context.SaveChangesAsync();

// DELETE — moderna (sin cargar) vs clásica (cargando) — GenerosController.cs:86 vs :99
var filas = await context.Generos.Where(g=>g.Id==id).ExecuteDeleteAsync(); // 1 query, EF 7+
var ent = await context.Generos.FirstOrDefaultAsync(g=>g.Id==id); context.Remove(ent); await context.SaveChangesAsync();
```

> `ExecuteDeleteAsync` es la forma moderna sin `SELECT` previo; `Remove+SaveChanges` es la clásica.

---

## 11. LINQ, N+1 y Eager Loading

**El mismo pedido en SQL vs LINQ** (`ORM.pptx:slide11`):
```sql
SELECT u.nombre, u.email FROM usuarios u JOIN pedidos p ON p.usuario_id=u.id WHERE p.total>100 ORDER BY u.nombre;
```
```csharp
context.Usuarios.Where(u=>u.Pedidos.Any(p=>p.Total>100)).OrderBy(u=>u.Nombre).ToList();
```
El ORM traduce LINQ → SQL por debajo.

**Trampa N+1** (`ORM.pptx:slide12`): 1 query para traer `Autores` + N queries al acceder `a.Libros` en un `foreach` = 51 queries para 50 autores.

```csharp
// ✗ N+1 — 51 queries
var autores = context.Autores.ToList();
foreach(var a in autores) Console.WriteLine(a.Libros.Count);

// ✓ 1 query con JOIN — PeliculasController.cs:25
var pelicula = await context.Peliculas
    .Include(p=>p.Comentarios)
    .Include(p=>p.Generos)
    .Include(p=>p.PeliculasActores.OrderBy(pa=>pa.Orden)).ThenInclude(pa=>pa.Actor)
    .FirstOrDefaultAsync(p=>p.Id==id);

// ✓ Proyección eficiente (solo columnas necesarias) — PeliculasController.cs:43
var dto = await context.Peliculas.Select(p=> new {
    p.Id, p.Titulo,
    Generos = p.Generos.Select(g=>g.Nombre),
    Actores = p.PeliculasActores.Select(pa=> new { pa.Actor.Nombre, pa.Personaje }),
    CantidadComentarios = p.Comentarios.Count()
}).FirstOrDefaultAsync(p=>p.Id==id);
```

Regla: si vas a iterar relaciones, usá `Include`/`ThenInclude` o `Select`/`ProjectTo`.

---

## 12. Migraciones: versionar el esquema

`ORM.pptx:slide13` + `EF_Core.pptx:slide10`

1. Cambiás el modelo (ej. agregar `telefono` a `Actor`).
2. `dotnet ef migrations add AgregarTelefono` — genera archivo con `Up()` (aplicar) y `Down()` (revertir).
3. `dotnet ef database update` — aplica pendientes en cada entorno (dev/staging/prod).

> Revisar siempre el código generado de la migración. `EnsureCreated()` solo para pruebas rápidas; en prod usar `Migrate()`.

---

## 13. DTOs y AutoMapper

**DTO** = objeto simple sin lógica, con la forma exacta que la API expone (`EF_Core.pptx:slide13`). Evita exponer entidades.

```csharp
// Entidad (interna) — tiene CostoInterno, navegación circular
public class Libro { public int Id; public string Titulo; public decimal CostoInterno; public Autor Autor; }
// DTO (público) — solo lo necesario
public class LibroDto { public int Id; public string Titulo; public string NombreAutor; }
```

**Por qué DTOs:** oculta datos sensibles, evita ciclos JSON (`Libro→Autor→Libros→...`), desacopla contrato de esquema interno, permite un DTO por caso de uso (crear sin `Id`, listar resumido, detalle completo).

**DTOs del proyecto** (`DTOs/*.cs`):

*   `GeneroCreacionDTO` — `[StringLength(150)] Nombre`
*   `ActorCreacionDTO` — `Nombre`, `Fortuna`, `FechaNacimiento` | `ActorDTO` — `Id`, `Nombre`
*   `PeliculaCreacionDTO` — `Titulo`, `EnCines`, `FechaEstreno`, `List<int> Generos` (ids), `List<PeliculaActorCreacionDTO>`
*   `ComentarioCreacionDTO` — `Contenido?`, `Recomendar`

**AutoMapper** (`Utilidades/AutoMapperProfiles.cs:7`):

```csharp
public class AutoMapperProfiles : Profile {
    public AutoMapperProfiles() {
        CreateMap<GeneroCreacionDTO, Genero>();
        CreateMap<ActorCreacionDTO, Actor>();
        CreateMap<Actor, ActorDTO>();
        CreateMap<PeliculaCreacionDTO, Pelicula>()
            .ForMember(ent=>ent.Generos, dto=>dto.MapFrom(c=>c.Generos.Select(id=> new Genero{Id=id})));
        CreateMap<PeliculaActorCreacionDTO, PeliculaActor>();
    }
}
```

**Uso eficiente con EF** — `ActoresController.cs:72`:
```csharp
return await context.Actores.ProjectTo<ActorDTO>(mapper.ConfigurationProvider).ToListAsync();
// ProjectTo traduce el mapeo a SQL: SELECT solo Id, Nombre (no trae Fortuna ni FechaNacimiento)
```
`ProjectTo` ≠ `Map`: `ProjectTo` arma el `SELECT` en BD; `Map` trae todo y mapea en memoria.

**Caso `Pelicula`** (`PeliculasController.cs:70`): al crear, los `Generos` vienen como ids → se marcan `EntityState.Unchanged` para no insertar géneros nuevos, solo vincular:
```csharp
foreach(var genero in pelicula.Generos) context.Entry(genero).State = EntityState.Unchanged;
for(int i=0;i<pelicula.PeliculasActores.Count;i++) pelicula.PeliculasActores[i].Orden = i+1;
```

---

## 14. Seeding — datos iniciales

`Entidades/Seeding/SeedingInicial.cs:7` siembra vía `HasData` (queda en migraciones):

*   Actores: Samuel L. Jackson, Robert Downey Jr.
*   Películas: Avengers Endgame, Spider-Man NWH, Across the Spider-Verse
*   Comentarios vinculados por `PeliculaId`
*   M:N `Genero↔Pelicula` vía `Dictionary<string,object>` sobre tabla oculta `GeneroPelicula` (`SeedingInicial.cs:73`)
*   M:N `PeliculaActor` con `Personaje` y `Orden`

`GeneroConfig.cs:10` también hace `HasData` para "Ciencia Ficción" y "Animación".

---

## 15. Buenas prácticas EF Core

`EF_Core.pptx:slide16` + patrones del proyecto:

*   **No expongas entidades en la API** → usá DTOs.
*   **`AsNoTracking()` en solo lectura** — evita overhead del Change Tracker si no vas a modificar.
*   **`Include`/`ThenInclude` o `Select`/`ProjectTo`** — nunca accedas a navegaciones en bucle sin eager loading.
*   **Migraciones chicas y revisadas** — una por cambio lógico; leer `Up()/Down()`.
*   **No `EnsureCreated()` en prod** — usar `Migrate()`.
*   **Transacciones explícitas** cuando varias operaciones deben ser atómicas.
*   **Índices/unicidad en Fluent API** (`GeneroConfig.cs:14` — `HasIndex(p=>p.Nombre).IsUnique()`).

---

## 16. Cuándo usar / cuándo no usar ORM

`ORM.pptx:slide14`

| ✅ Buen encaje | ⚠️ Usar con cautela |
|---|---|
| CRUD estándar | Reportes analíticos / agregaciones masivas |
| Prototipado rápido | Queries de altísimo rendimiento crítico |
| Equipos con distinto nivel de SQL | Migraciones de datos muy específicas |
| Portabilidad entre motores (cambiar Provider) | BD legacy con esquema complejo |
| Lógica de dominio rica | Operaciones batch sobre millones de filas |

---

## 17. Proyecto `IntroEF_CF` — mapa rápido

| Qué querés ver | Archivo |
|---|---|
| DbContext + convención global | `ApplicationDbContext.cs:14` |
| Entidades + relaciones | `Entidades/Pelicula.cs:3`, `Genero.cs:5`, `Actor.cs:3`, `Comentario.cs:3`, `PeliculaActor.cs:3` |
| Fluent API por entidad | `Entidades/Configuraciones/*Config.cs` |
| DTOs | `DTOs/*DTO.cs` |
| Mapeo DTO↔Entidad | `Utilidades/AutoMapperProfiles.cs:7` |
| Seeding | `Entidades/Seeding/SeedingInicial.cs:7` |
| Registro DI + SQL Server | `Program.cs:16` |
| CRUD + Include/ThenInclude + Select + ExecuteDelete | `Controllers/PeliculasController.cs:11`, `GenerosController.cs:8`, `ActoresController.cs:8` |

---

## 18. Chuleta de comandos

```bash
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet tool install --global dotnet-ef

dotnet ef migrations add NombreDescriptivo   # genera Up()/Down()
dotnet ef database update                    # aplica pendientes
dotnet ef migrations remove                  # borra última si no se aplicó
dotnet ef dbcontext scaffold "Server=...;Database=Librearia;Trusted_Connection=True;TrustServerCertificate=True;" Microsoft.EntityFrameworkCore.SqlServer -o Models  # Database First
```

---

## 19. En resumen (5 bullets)

1. ORM traduce **clases↔tablas, instancias↔filas, referencias↔FK/JOIN**; resuelve el *impedance mismatch*.
2. Ahorra tiempo y evita SQL repetitivo/inyección, pero es **abstracción con fugas** — hay que entender el SQL generado.
3. **Data Mapper** (EF Core) separa dominio de persistencia; **Active Record** mezcla ambos — elegir por simplicidad vs pureza del dominio.
4. **Vigilá N+1**: usá `Include`/`ThenInclude` o `Select`/`ProjectTo`; nunca latures navegaciones sin eager loading.
5. **Migraciones versionan el esquema junto al código**; Code First si controlás el esquema, Database First si partís de BD existente.

---

## 20. Preguntas tipo examen

1. **¿Qué es el *impedance mismatch* y cómo lo resuelve un ORM?** R: desajuste entre modelo de objetos (herencia, grafos, identidad) y relacional (tablas planas, FK, JOIN); el ORM mapea automáticamente clases↔tablas y traduce LINQ a SQL.
2. **Diferencia Active Record vs Data Mapper. ¿Cuál usa EF Core?** R: AR: `obj.save()` (Rails/Django/Eloquent). DM: `context.Add(obj)` (EF/Hibernate/SQLAlchemy). EF Core es DM.
3. **¿Qué hace `DbContext` y `DbSet<T>`?** R: `DbContext` es la sesión/UoW; `DbSet<T>` expone cada tabla como colección LINQ; `SaveChanges()` confirma cambios trackeados.
4. **Code First vs Database First: ¿cuándo cada uno?** R: CF para greenfield con control del esquema + migraciones; DF para legacy/BD existente con `scaffold`.
5. **Explicá N+1 con ejemplo y solución.** R: `ToList()` + `foreach(a.Libros)` dispara 1+N queries; solución: `.Include(a=>a.Libros)` o `.Select()` → 1 query con `JOIN`.
6. **¿Por qué usar DTOs y qué diferencia `Map` vs `ProjectTo`?** R: DTOs ocultan datos, evitan ciclos y desacoplan contrato; `Map` trae todo y mapea en memoria, `ProjectTo` proyecta en SQL (solo columnas del DTO).
7. **¿Data Annotations vs Fluent API?** R: Annotations rápido pero acopla; Fluent API verboso, potente, mantiene entidades limpias — en IntroEF se usa Fluent API vía `IEntityTypeConfiguration`.

---

*Fuentes: `ORM.pptx` (15 slides), `EF_Core.pptx` (17 slides), `IntroEF_CF/IntroEF/*.cs` — Programación IV, UTN.*
