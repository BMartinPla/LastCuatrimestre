# Guía de Estudio — Parcial 1: Introducción al Análisis de Datos

> Basada en: Clase 1 (El mundo de los datos), Clase 2 (Herramientas de BI), Clase 3 (Estrategias de medición), Clase 4 (Data Manipulation), Clase 5 (Estadística con PBI) y Resumen de Estadística Descriptiva.

---

## 1. El mundo de los datos (Clase 1)

### Dato vs. Información
| Concepto | Definición |
|---|---|
| **Dato** | Representación simbólica de un hecho. **No tiene sentido semántico** ni transmite un mensaje por sí solo. |
| **Información** | Conjunto de **datos procesados y organizados** que transmiten un significado, reducen la incertidumbre e incrementan el conocimiento. |

- Cita clave: *"Los datos son el nuevo petróleo"* — Clive Humby.
- Ejemplo: los valores `20, 50, centímetros, -10` no significan nada aislados; procesados correctamente, informan una decisión.

### Tipos de análisis de datos (4 niveles)
| Nivel | Pregunta | Producto típico |
|---|---|---|
| **Descriptivo** | ¿Qué pasó? | Reportes |
| **Diagnóstico** | ¿Por qué pasó? | Dashboards interactivos |
| **Predictivo** | ¿Qué pasará? | Modelos (basados en datos históricos) |
| **Prescriptivo** | ¿Qué debería hacer? | Recomendaciones / automatización (simulaciones y optimizaciones) |

### Ciclo de vida de los datos
1. **Recolección**: identificar el origen y almacenar digitalmente.
2. **Mantenimiento**: revisar y procesar para garantizar calidad.
3. **Síntesis**: modelar según los indicadores requeridos.
4. **Uso**: explotación (reportes, informes, modelos).
5. **Publicación**: exponer el análisis para la toma de decisiones.
6. **Depuración**: detectar si la información requiere agregaciones, eliminaciones o cambios.

### Cultura Data Driven
- **Características**: decidir en base a información, generar conocimiento, alcance en toda la organización, democratización de los datos, gobierno de datos, medición de riesgo e intangibles.
- **Impedimentos**: errores al armar el equipo, falta de habilidades de análisis, sesgos, miedo al cambio, desconfianza en los datos, problemas de adopción de las herramientas.

### Historia
- **John Snow (Londres, 1854, barrio Soho)**: el "primer detective de datos" — mapeó casos de cólera para identificar la fuente (bomba de agua). Ejemplo clásico de análisis de datos aplicado.

---

## 2. Herramientas de BI (Clase 2)

### Roles del mundo de datos
| Rol | Función | Herramientas |
|---|---|---|
| **Data Engineer** | Diseña y construye la infraestructura de flujo de datos | Snowflake, BigQuery, Databricks, NoSQL, Apache Spark, Airflow, dbt, Kafka |
| **Data Scientist** | Crea modelos predictivos y experimenta | Python (Pandas, NumPy), Scikit-learn, TensorFlow, PyTorch, MLflow, R |
| **Data Analyst** | Examina datos históricos para decisiones operativas | Power BI, Tableau, Looker Studio, Excel, SQL (DBeaver, pgAdmin) |

### Tecnologías (clasificación por funcionalidad)
1. **Bases de datos**: datos relacionados y organizados para un propósito. Se consultan con **SQL** (Structured Query Language). Pueden almacenar datos **estructurados** o **no estructurados**.
2. **ETL**
3. **Visualización**
4. **Lenguajes de programación**: Python (estándar del mercado, versátil), R (análisis estadístico profundo), Julia (computación científica de alto rendimiento).

### ETL — Extract, Transform, Load
| Etapa | Qué hace | Ejemplos |
|---|---|---|
| **Extraer** | Tomar datos de distintas fuentes | Bases de datos, APIs/sistemas externos, archivos (Excel, CSV) |
| **Transformar** | Preparar los datos para que tengan sentido (**etapa más crítica**) | Limpieza, unificación, validaciones, cálculos, estandarización, consolidación, enriquecimiento |
| **Cargar** | Guardar los datos listos para análisis | Data Warehouse, modelos de datos, tablas finales |

- Sin ETL los datos **no son confiables ni útiles** para analizar.
- En la práctica se automatiza con jobs/cadenas periódicas (diario, semanal, mensual).

### Enfoques de arquitectura
| Modelo | Características |
|---|---|
| **Tradicional (IT centralizado)** | IT controla el acceso; procesos estructurados (ETL, DW); más control y calidad; menor velocidad; requiere roles técnicos. Típico: bancos, telecom, retail, energía (grandes volúmenes). |
| **Self-Service (negocio autónomo)** | Usuarios acceden directamente con herramientas de BI; más velocidad y flexibilidad; riesgo de inconsistencia sin gobernanza; usuarios "no técnicos". |

### Data Warehouse (DWH)
Características (Inmon):
1. **Orientado a la organización** (ventas, producción, clientes).
2. **Datos integrados**: reúne y normaliza datos de distintos sistemas (ERP, web, encuestas).
3. **Variables en el tiempo**: guarda "fotos" periódicas.
4. **No volátil**: los datos no se alteran, solo se incrementan (históricos de 2 a 10 años).

- **Factores de éxito**: integra múltiples fuentes, información relevante, datos consistentes, acceso directo, escalable.
- **Desafíos**: alto costo inicial y de mantenimiento, cambios constantes, control de calidad, complejidad de integración.

### Data Lake
- Depósito de datos en su **formato natural ("en bruto")**, tal como los generan las aplicaciones.
- Características: escalabilidad, gobierno del dato (catálogos y metadatos), orquestación, acceso ágil.
- **Data Swamp** = Data Lake sin gestión ni control (datos desordenados, baja calidad, pierde valor). *No alcanza con tener datos, hay que gestionarlos.*

### ETL vs ELT
| ETL (Data Warehouse) | ELT (Data Lake) |
|---|---|
| Datos estructurados | Datos en bruto |
| Transformación **previa** a la carga | Transformación **posterior** |
| Optimizado para análisis | Optimizado para analítica avanzada |

---

## 3. Estrategias de medición (Clase 3)

> *"Lo que no se mide, no se puede mejorar"* — William Thomson Kelvin.

### Data Analytics Journey (5 pasos)
1. Inmersión
2. **Estrategia de Medición** (KPIs, OKRs, dimensiones)
3. Implementación técnica
4. Análisis de información y obtención de resultados
5. Generación de conocimiento

Ciclo iterativo: **Medir → Analizar → Aprender → Mejorar**.

### KPI (Key Performance Indicator)
**4 pilares de un KPI efectivo:**
1. **Específico**: un aspecto concreto a la vez.
2. **Medible**: cantidades realistas y cuantificables.
3. **Temporal**: frecuencia definida (diario, mensual, etc.).
4. **Relevante**: información crítica para el negocio.

- Los KPIs deben **informar, controlar, evaluar y ayudar a tomar decisiones**.
- Cada empresa/industria tiene indicadores propios. Ejemplos: % asistencia (educación), cantidad de viajes (plataforma de viajes), % suscriptores (streaming).

### Dimensiones
Variables **cualitativas** que permiten agrupar, filtrar u ordenar métricas. Tres formas:
1. **Texto**: categorías, segmentos, sucursal (ej: chofer, región, categoría de producto).
2. **Booleanas**: Sí/No, Verdadero/Falso, 0/1 (ej: ¿viaje cancelado?).
3. **Tiempo**: fecha, año, trimestre (usadas con *time intelligence*).

En SQL: `SELECT COUNT(*) ... GROUP BY dimensión`.

### OKRs (Objectives and Key Results)
- Metodología popularizada por **John Doerr** (años 90, libro *"Measure What Matters"*); usadas por Google, Spotify, Netflix, Amazon, LinkedIn.
- **Objetivo (O)**: cualitativo, inspirador, desafiante, corto y memorable.
- **Key Results (KR)**: métricas cuantitativas de progreso; **2 a 5 por objetivo**; atados a una unidad de tiempo.
- **Regla de oro**: un KR mide **impacto/valor (outcomes)**, **no** tareas o pasos metodológicos (outputs).
  - ❌ "Extraer y limpiar datos", "Armar el dashboard" (son tareas).
  - ✅ "Reducir cancelaciones del 14% al 5%", "Lograr 90% de adopción del dashboard".

**Relación OKR–KPI**: los KRs se miden en base a KPIs específicos. *"Sin métricas claras (KPIs), no hay resultados clave (KRs) verificables."*

**Ventajas de los OKRs**: relación con la meta, priorización, colaboración, comunicación, temporalidad.

### Power BI (introducción)
**Origen**: límites de Excel → "Power Stack" (Power Pivot 2010, Power View 2011, Power Query 2013) → **Power BI Desktop 2015**.

**Ecosistema**:
| Componente | Función |
|---|---|
| **Desktop** | Motor gratuito: conectar, modelar, visualizar (desarrollo) |
| **Service** | SaaS para compartir reportes y seguridad (colaboración) |
| **Mobile/Web** | Consumo desde cualquier dispositivo |
| **Gateway** | Puente seguro para actualizar datos locales |

**Flujo de trabajo**: 1. Preparar (obtener/limpiar datos) → 2. Explorar → 3. Reportes → 4. Compartir.

**Vistas de Power BI Desktop**: Reporte, Datos, Relaciones. **Editor de consultas (Power Query)**: consultas, barra de transformaciones, pasos aplicados.

**Conexión de datos**: Excel (cada hoja puede ser una fuente), CSV/TXT (definir **delimitador** e **idioma** para ñ/acentos), configuración de orígenes de datos.

---

## 4. Data Manipulation (Clase 4)

> **"Garbage in, Garbage out"**: tus análisis serán tan buenos como tus datos.

### Pilares de la calidad de datos
- **Precisión**: datos certeros y confiables.
- **Integridad**: información completa y consistente.
- **Oportunidad**: disponibilidad a tiempo.
- **Claridad**: formato interpretable para el negocio.

### Procesos de procesamiento de datos
| Proceso | Descripción | Ejemplo |
|---|---|---|
| **Limpieza** | Eliminar ruido, corregir inconsistencias | Duplicados, formatos de fecha (DD/MM vs MM/DD) |
| **Transformación** | Modificar/agregar datos para mejores conclusiones | Convertir moneda, agrupar edades en rangos |
| **Integración** | Compilar datos de distintas bases en un dataset | Unir CRM con Google Analytics |

### Estructura del modelo de datos
- **Dimensiones (entidades)**: fechas, clientes, transportes, empleados, productos (atributos descriptivos: ID, nombre, unidad de medida).
- **Hechos (eventos)**: ventas (ID factura, fecha, ID producto, ID cliente, importe total).
- Preguntas clave al explorar: **tipos de datos y unidades de medida**, **contexto** (qué explica cada variable, outliers, faltantes), **relaciones** (cómo se relacionan las tablas, transformaciones necesarias).

### 5 malas prácticas comunes
1. **Espacios fantasma**: `["Norte", " Norte ", "Norte "]` duplican categorías → aplicar **Trim**.
2. **Hard-coding manual**: `if ID=15 then "VIP"` → usar **tabla de mapeo + Merge** en Power Query.
3. **Mezclar unidades**: sumar 100 USD + 100 ARS → normalizar moneda.
4. **Transformaciones manuales sobre el origen**: `"Ventas_Final_v2_CORREGIDO.xlsx"` → proceso ETL en Power Query.
5. **Sin documentación**: pasos genéricos (`Paso1, Personalizado1`) → **renombrar cada paso**.

### Power Query — herramientas más usadas
- **Tipo de datos**: convertir el tipo de dato.
- **Reemplazar valores**: automatizar reemplazos.
- **Quitar columnas** / **Duplicar columna**.
- **Dividir columna**: separar por delimitador.
- **Columna condicional**: lógica igual a / contiene / mayor que.

⚠️ Diferencia clave: **"Agregar columna" crea** información nueva; **"Transformar" modifica** la existente.

### Flujo de limpieza típico (caso transacciones bancarias)
1. Quitar fila de encabezados mal puesta y **promover la primera fila a encabezado**.
2. Eliminar filas/columnas vacías.
3. Corregir columnas de texto sucio (status, card_type, city):
   - Opción A: **columna condicional** (lógica de corrección).
   - Opción B: **reemplazar valores** en la misma columna.
   - Opción C (más sofisticada): **tabla intermedia (staging) + Merge/Join** para mapear valores → mejor para mantenimiento con cargas periódicas.
4. Fechas/horas inconsistentes: **dividir columna** (fecha y hora), asignar formato, reemplazar errores por **null** (no perder el registro).
5. Columna numérica (amount): corregir formato texto ("," vs "."), convertir a número, **filtrar outliers y valores sin sentido** (0, -1), editar el código M si faltan operadores.
6. **Renombrar cada paso aplicado** → Cerrar y aplicar.

---

## 5. Estadística Descriptiva (Clase 5 + Resumen)

### Caso motivador: el peligro de los promedios
Hotel: 9 huéspedes pagan $50 y 1 penthouse paga $1.000.
- **Media = $145** → distorsionada por el outlier → precio irreal, expulsa al 90% de clientes.
- **Mediana = $50** → refleja el cliente típico → base realista para precios.

### Clasificación de variables
| Tipo | Subtipo | Ejemplos | Columna típica (BD) | Análisis habitual |
|---|---|---|---|---|
| **Cualitativa** | Nominal (sin orden) | Sistema operativo, provincia, tipo de cliente | TEXT / VARCHAR | Frecuencias, %, moda |
| | Ordinal (con orden) | Prioridad baja/media/alta, satisfacción | TEXT / categorical ordinal | Frecuencias, %, moda, mediana |
| **Cuantitativa** | Discreta (conteo) | Commits, errores, usuarios conectados | INTEGER | Frecuencias, descriptivas |
| | Continua (medición) | Tiempo, memoria, monto, tarifa | FLOAT / DECIMAL | Descriptivas, percentiles, distribución |

⚠️ Una columna numérica puede ser **código de categoría** (1=Python, 2=Java): calcular su media **no tiene sentido**.

### Escalas de medición
| Escala | Característica | Ejemplo | Permite |
|---|---|---|---|
| **Nominal** | Clasifica sin ordenar | Lenguaje de programación | Contar, proporciones, moda |
| **Ordinal** | Clasifica y ordena | Nivel de satisfacción | Ordenar, contar, medidas de posición con cautela |
| **Intervalo** | Diferencias significativas, cero convencional | Temperatura °C | Diferencias y promedios |
| **Razón** | Cero absoluto | Tiempo, peso, monto | Diferencias y proporciones ("el doble") |

### Población, muestra y unidad de análisis
- **Población**: conjunto total de elementos a estudiar.
- **Muestra**: subconjunto (usar cuando estudiar todo es costoso/imposible); debe **representar** a la población o habrá sesgo.
- **Unidad de análisis**: cada elemento observado (generalmente cada **fila** del dataset).

### Frecuencias
- **Absoluta (fi)**: cuántas veces aparece un valor. Σfi = n.
- **Relativa (fr)**: fr = fi / n (×100 = porcentaje). Permite comparar grupos de distinto tamaño.
- **Acumulada**: cuántas observaciones son ≤ a un punto (solo con valores ordenados).
- **Datos agrupados**: para variables continuas o con muchos valores; intervalos [a, b) — incluye a, excluye b.
  - **Marca de clase** = (límite inferior + límite superior) / 2.
  - **Amplitud** = límite superior − límite inferior.
- Buenas prácticas: informar **porcentaje Y cantidad** (el % sin la base es engañoso).

### Medidas de tendencia central
| Medida | Fórmula/definición | Ventaja | Limitación |
|---|---|---|---|
| **Media (x̄)** | x̄ = Σxi / n | Usa todos los valores | **Sensible a outliers** |
| **Mediana** | Valor central de los datos ordenados (si n par: promedio de los 2 centrales) | **Resistente a extremos** | No usa la magnitud de todos los valores |
| **Moda** | Valor/categoría más frecuente | Válida para categóricas | Puede haber varias o ninguna |

### Media vs. Mediana según el sesgo (¡clave para el examen!)
| Situación | Forma | Qué usar |
|---|---|---|
| **Media > Mediana** | Asimetría **positiva** (cola a la derecha, outliers altos) | **Mediana** para el caso típico; **media** para impacto total/proyecciones |
| **Media ≈ Mediana** | Simétrica | Cualquiera, distribución equilibrada |
| **Media < Mediana** | Asimetría **negativa** (cola a la izquierda, valores bajos) | **Mediana** para ignorar anomalías bajas; **media** para medir pérdidas/impacto total |

### Medidas de posición
- **Cuartiles**: Q1 (25% debajo), **Q2 = mediana** (50%), Q3 (75% debajo).
- **Percentiles (Pk)**: el k% de las observaciones queda por debajo. En tecnología se usan **P90, P95, P99** (tiempos de respuesta) porque un promedio aceptable puede ocultar casos muy malos.
- **Deciles**: dividen en 10 partes.

### Medidas de dispersión
| Medida | Fórmula | Nota |
|---|---|---|
| **Rango** | R = xmax − xmin | Fácil, pero depende de solo 2 valores |
| **Varianza (s²)** | s² = Σ(xi − x̄)² / (n−1) | Unidades al cuadrado |
| **Desvío estándar (s)** | s = √s² | Misma unidad que la variable; pequeño = concentrados cerca de la media |
| **Coef. de variación** | CV = (s / x̄) × 100 | Comparar dispersión **relativa** entre conjuntos con medias/unidades distintas |
| **Rango intercuartílico (IQR)** | IQR = Q3 − Q1 | Dispersión del 50% central; **resistente a outliers** |

Ejemplo: dos sistemas con media de 2s; desvío 0,2s (A, estable) vs 1,5s (B, variable). Mismo promedio, realidades distintas → **la media sola no alcanza**.

**Parejas recomendadas**:
- Distribución simétrica sin extremos → **media + desvío estándar**.
- Distribución asimétrica o con outliers → **mediana + IQR**.
- Variable cualitativa → **moda/frecuencias + porcentajes**.

### Boxplot (diagrama de caja) — anatomía
- **Caja**: de Q1 a Q3 (contiene el 50% central; ancho = IQR).
- **Línea central**: mediana (Q2).
- **Bigotes**: variabilidad esperada fuera de la caja (mín/máx válidos).
- **Puntos aislados**: **outliers** (anomalías).
- **Media** (punto/cruz): si se desvía de la mediana → **asimetría**.

Ejemplo (tarifas ADR de hoteles): City Hotel mediana 99 USD, IQR 47 (más caro, menos disperso); Resort mediana 75, IQR 76 (más disperso). Tarifas de 0 USD = cortesías o **errores a auditar** 🚩.

### Valores atípicos (outliers)
- Pueden ser: error de carga, problema de medición, caso real excepcional o subgrupo distinto.
- **No eliminar automáticamente.** Preguntarse: ¿es posible en contexto? ¿es error? ¿caso excepcional? ¿subgrupo separado? ¿cambia la media/desvío? ¿su eliminación cambiaría la conclusión?

### Errores frecuentes (checklist)
1. Confundir **códigos con cantidades** (media de categorías codificadas).
2. Informar la **media sin mirar mediana y extremos**.
3. Interpretar el **desvío sin la escala** (usar CV si corresponde).
4. **Porcentajes sin informar la base** (n).
5. Confundir **descripción con explicación** (correlación ≠ causalidad).
6. **Ignorar faltantes, duplicados o inconsistencias** antes de interpretar.

### EDA — preguntas iniciales del análisis exploratorio
- ¿Cuántas observaciones y variables hay? ¿Qué representa cada fila?
- ¿Qué tipo de variable es cada columna? ¿Hay faltantes/duplicados?
- ¿Qué categorías son más frecuentes? ¿Cómo se distribuyen las numéricas?
- ¿Media ≈ mediana? ¿Hay outliers o subgrupos?
- ¿Qué medidas resumen mejor cada variable?

### Caso aplicado en Power BI (dataset de reservas hoteleras, 25k registros, 32 variables)
- **Variable categórica** (`is_canceled`) → análisis de **frecuencias + gráfico de barras**: 62,96% efectivas vs 37,04% canceladas (oportunidad de retención).
- **Variable cuantitativa** (`lead_time`) → media 102,6 / mediana 68,5 / moda 0 → **media > mediana = asimetría positiva** → la mediana es más representativa.
- **Conclusiones clave**: combinar medidas (media + mediana + desvío) y visualizaciones; el tipo de variable determina la herramienta; en distribuciones asimétricas usar la mediana.

---

## ✅ Repaso rápido (preguntas tipo)

1. ¿Diferencia entre dato e información? → El dato no tiene sentido semántico; la información son datos procesados y organizados que reducen incertidumbre.
2. ¿Los 4 tipos de análisis y su pregunta? → Descriptivo (¿qué pasó?), Diagnóstico (¿por qué?), Predictivo (¿qué pasará?), Prescriptivo (¿qué debería hacer?).
3. ¿Etapas del ETL y cuál es la más crítica? → Extraer, Transformar (la más crítica), Cargar.
4. ¿Diferencia Data Warehouse vs Data Lake? → DWH: datos estructurados, integrados, no volátiles, orientado al negocio. Lake: datos en bruto, cualquier formato; sin gobierno se vuelve Data Swamp.
5. ¿Los 4 pilares de un KPI? → Específico, Medible, Temporal, Relevante.
6. ¿Qué es un KR correcto? → Mide impacto (outcome), no tareas (output). Ej: "reducir cancelaciones del 14% al 5%".
7. ¿Diferencia entre "Agregar columna" y "Transformar" en Power Query? → Agregar **crea** una columna nueva; Transformar **modifica** la existente.
8. ¿Cómo corregir muchos valores mal escritos de forma mantenible? → Tabla de mapeo (staging) + Merge en Power Query.
9. ¿Cuándo usar mediana en vez de media? → Con asimetría o outliers (media > mediana = sesgo positivo).
10. ¿Fórmulas? → fr = fi/n; x̄ = Σxi/n; s² = Σ(xi−x̄)²/(n−1); CV = s/x̄ × 100; IQR = Q3 − Q1.
11. ¿Qué mide el IQR y con qué medida se empareja? → Dispersión del 50% central; se usa con la **mediana** en distribuciones asimétricas.
12. ¿Qué hacer ante un outlier? → No eliminarlo automáticamente; investigar si es error, caso excepcional o subgrupo.
