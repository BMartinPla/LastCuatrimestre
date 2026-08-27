# Simulacro Parcial 1 - Gestión de Desarrollo de Software
**30 Preguntas (20 Multiple Choice + 5 V/F + 5 Desarrollo) | Tiempo sugerido: 90 min | Puntaje: 100 pts**

> **Instrucciones:** Responde sin mirar la guía. Luego corrige con solucionario (pág. final). Cada multiple choice vale 3 pts (60 pts), V/F con justificación 4 pts (20 pts), desarrollo 4 pts (20 pts). Aprobado: 60 pts.

---

## PARTE A: Multiple Choice - Elige UNA (3 pts c/u)

**1. Las 4P de Pressman son:**
A) Personas, Producto, Proceso, Proyecto
B) Plan, Programa, Producto, Personas
C) Personas, Presupuesto, Proceso, Prueba
D) Prototipo, Producto, Proceso, Proyecto

**2. ¿Cuál NO es factor de toxicidad de equipo según el material U1?**
A) Atmósfera de trabajo frenético
B) Alta frustración
C) Definición clara de roles
D) Exposición repetida al fracaso

**3. El software "no se desgasta pero sí se deteriora". Esto se evidencia en:**
A) Curva ideal plana
B) Curva real con picos por cambios y nivel base ascendente
C) Curva hardware
D) Curva sin mantenimiento

**4. Las 5 actividades estructurales del marco genérico son:**
A) Comunicación, Planeación, Modelado, Construcción, Despliegue
B) Análisis, Diseño, Código, Prueba, Mantenimiento
C) Req, Diseño, Codificación, Prueba, Implementación
D) Inicio, Planificación, Ejecución, Control, Cierre

**5. Actividad sombrilla/custodial que se aplica durante TODO el proceso:**
A) Codificación
B) Administración de riesgos
C) Despliegue
D) Modelado

**6. Modelo que sugiere enfoque sistemático secuencial, escasa participación cliente y es llamado "proceso madre":**
A) Incremental
B) Espiral
C) Cascada
D) Scrum

**7. Modelo secuencial por incrementos de funcionalidad SIN refinamiento, entregable al final de cada incremento:**
A) Cascada
B) Incremental
C) Espiral
D) Proceso Unificado

**8. Modelo que incorpora gestión explícita de riesgo, enfoque cíclico y uso de prototipos:**
A) Cascada
B) Incremental
C) Espiral
D) Kanban

**9. Proceso Unificado se caracteriza por:**
A) Dirigido por Casos de Uso y Centrado en Arquitectura, iteraciones 2-6 semanas, iterativo e incremental
B) Sprints 1-4 semanas y equipos autoorganizados
C) Solo lineal sin iteraciones
D) Rápido desarrollo sin arquitectura

**10. Valor del Manifiesto Ágil INCORRECTO:**
A) Individuos e interacciones sobre procesos y herramientas
B) Software funcionando sobre documentación extensiva
C) Negociación contractual sobre colaboración cliente
D) Responder al cambio sobre seguir un plan

**11. Enfoque donde requisitos se conocen totalmente al inicio y hay única entrega final (ej: construcción casa):**
A) Iterativo
B) Predictivo
C) Ágil
D) Incremental

**12. Proyecto vs Tarea Rutinaria: el proyecto se caracteriza por:**
A) Continua y repetitiva
B) Temporal con fin definido y resultado único
C) Proceso predecible y estable
D) Recursos consistentes

**13. Señal de que proyecto está en peligro NO incluye:**
A) Ámbito pobremente definido
B) Fechas límite realistas
C) Cambios gestionados pobremente
D) Usuarios resistentes

**14. Riesgo: categorías según Pressman son:**
A) Proyecto, Técnico, Empresarial
B) Conocido, Predecible, Impredecible
C) Alto, Medio, Bajo
D) Interno, Externo, Mixto

**15. En tabla de riesgos, impacto 1 significa:**
A) Despreciable
B) Marginal
C) Crítico
D) Catastrófico

**16. Rol que traduce necesidades empresariales en requisitos técnicos y actúa como puente negocio-técnico:**
A) Desarrollador
B) Evaluador QA
C) Analista Funcional
D) Scrum Master

**17. En metodologías ágiles, quien prioriza backlog y maximiza valor:**
A) Scrum Master
B) Product Owner
C) Equipo Ágil
D) Cliente

**18. Requisito "El sistema debe responder en <2 segundos con 100 usuarios" es:**
A) Funcional
B) No Funcional (rendimiento)
C) Suposición
D) Restricción

**19. Error común de requerimientos: "El sistema debe ser rápido" es:**
A) Suposición no validada
B) Ambigüedad / lenguaje vago
C) Cambio no documentado
D) Combinar requisitos

**20. Técnica de relevamiento que valida comprensión temprana con representación visual:**
A) Entrevista
B) Cuestionario
C) Prototipo
D) Análisis sistema actual

---

## PARTE B: Verdadero / Falso - Justifica (4 pts c/u)

**21. V/F: En modelo Cascada el cliente ve una versión ejecutable al final de cada incremento. Justifica.**

**22. V/F: La complejidad ciclomática V(G) = Nodos Predicados + 1 indica el número máximo de pruebas de caja negra necesarias. Justifica.**

**23. V/F: "Debe entregarse en 10 semanas y usar solo open source" son suposiciones. Justifica.**

**24. V/F: Suposición y restricción se gestionan igual: ambas requieren plan de contingencia porque pueden resultar falsas. Justifica.**

**25. V/F: En matriz Poder/Interés, un Director Académico (alto poder, alto interés) debe gestionarse de cerca con informes detallados. Justifica.**

---

## PARTE C: Desarrollo / Cálculo (4 pts c/u)

**26. Mantenimiento - Describe los 3 tipos de acciones de mantenimiento según Metodología SI y da un ejemplo concreto de cada una para un sistema de ventas.**

**27. Cálculo PERT y Costos:**
Un módulo "Reportes Avanzados" tiene O=6h, M=10h, P=26h. Será hecho por Semi Senior ($500/h). Además hay costo licencia $800.
a) Calcula VE con fórmula PERT mostrando pasos.
b) Calcula costo total módulo.
c) ¿Qué pasaría si se asigna a Junior $300/h? Analiza trade-off.

**28. Matriz Stakeholders:**
Para un sistema de Control de Acceso Escolar (mencionado en U1), identifica 4 stakeholders distintos, ubícalos en la matriz Poder/Interés y justifica estrategia comunicación para cada uno.

**29. Pruebas - Partición de Equivalencia:**
Condición: "La edad debe ser entre 18 y 65 años inclusive para registrarse."
a) Define clases equivalencia válidas e inválidas según reglas del material.
b) Diseña 3 casos prueba (1 válido, 2 inválidos) con valor y resultado esperado.

**30. Metodología SI - Ordena y explica:**
Ordena correctamente las 10 etapas de la Metodología de Sistemas de Información y explica con 2 líneas cada una: qué entrega produce y qué técnica/herramienta clave usa. Indica en qué etapa se genera la Propuesta de Proyecto.

---

## SOLUCIONARIO

### Parte A
1. A - Las 4P son personas, producto, proceso y proyecto (Pressman U1).
2. C - Definición clara de roles PREVIENE toxicidad; factor tóxico es definición POCO clara.
3. B - Curva real: picos por cambios y base ascendente = deterioro.
4. A - Marco genérico: Comunicación, Planeación, Modelado, Construcción, Despliegue + sombrilla.
5. B - Administración riesgos es sombrilla, transversal.
6. C - Cascada = proceso madre, secuencial, cliente solo inicio/fin.
7. B - Incremental = incrementos funcionales sin refinamiento.
8. C - Espiral = cíclico, prototipos, riesgo explícito.
9. A - PU = casos uso + arquitectura, 2-6 sem, iterativo-incremental OO con UML.
10. C - Incorrecto: es Colaboración cliente SOBRE negociación contractual (no al revés).
11. B - Predictivo = requisitos totales, planificación completa, única entrega.
12. B - Proyecto = temporal, único, incierto.
13. B - Fecha realista es BUENA señal; irreales es peligro.
14. A - Categorías: Proyecto/Técnico/Empresarial. Conocido/Predecible/Impredecible son TIPOS según conocimiento.
15. D - 1=Catastrófico, 2=Crítico, 3=Marginal, 4=Despreciable.
16. C - Analista Funcional = puente.
17. B - Product Owner maximiza valor y gestiona backlog.
18. B - No funcional de rendimiento.
19. B - Ambigüedad: "rápido" sin métrica.
20. C - Prototipo valida temprano.

### Parte B
**21. FALSO.** Cascada entrega ejecutable solo al FINAL del proceso. Quien entrega por incremento es Incremental (y Espiral/Ágil). Cascada tiene detección tardía y división trabajo sin paralelismo.
**22. FALSO.** V(G) indica nº pruebas de CAJA BLANCA (ruta básica) para cobertura enunciados, no caja negra. Caja negra no mira estructura interna sino interfaz/requisitos. Fórmula es correcta pero aplicación es blanca.
**23. FALSO.** Son RESTRICCIONES (limitaciones fijas, conocidas, no negociables, dan forma a plan). Suposiciones son inciertas, requieren validación/contingencia (ej: "cliente entregará datos a tiempo").
**24. FALSO.** Se gestionan distinto: suposiciones requieren validación y plan contingencia porque pueden resultar falsas; restricciones son fijas desde inicio, hay que acomodarse, no se validan, se adaptan.
**25. VERDADERO.** Alto poder + alto interés = Gestionar de cerca: compromiso total, comunicación regular detallada, consulta decisiones claves. Les preocupa fiabilidad, seguridad, cumplimiento política.

### Parte C

**26. Modelo de respuesta:**
- **Correctiva:** Corrige desvío no detectado en pruebas. Ej: bug que calcula mal IVA en factura.
- **Perfectiva:** Perfecciona/mejora, nuevo req u optimización rendimiento. Ej: agregar dashboard ventas o acelerar reporte que tarda 10s → 2s.
- **Adaptativa:** Adapta a cambio contexto/tecnología/política del usuario ya en rutina. Ej: migrar BD a nube o adaptar a nuevo SO o cambio ley facturación.

**27. Solución:**
a) VE = (O + 4M + P)/6 = (6 + 40 + 26)/6 = 72/6 = **12h**
b) Costo = (12 × $500) + $800 = $6000 + $800 = **$6.800**
c) Con Junior: (12×$300)+$800 = $4.400 → **Ahorro $2.400** pero trade-off: Junior (0-2 años, requiere supervisión) mayor riesgo calidad/retrabajo en reportes (tarea compleja), podría aumentar P y VE real; Senior sería más caro pero menor riesgo y mentoreo. Semi Senior es equilibrio para funciones estándar.

**28. Ejemplo esperado (puede variar pero debe ubicar bien):**
- **Directora Escuela (decisor):** Alto Poder/Alto Interés → Gestionar de cerca. Updates semanales, validar flujos, preocupa seguridad alumnos y cumplimiento normativa.
- **Preceptores (usuarios finales):** Bajo Poder/Alto Interés → Mantener informado, beta, feedback, preocupa usabilidad, 4 pulgadas, rapidez pase lista.
- **Soporte IT colegio:** Medio Poder/Medio Interés → Mantener satisfecho/informado, involucrar técnica integración, preocupa integración con sistema existente y documentación.
- **Proveedor hardware molinetes:** Bajo Poder/Bajo Interés → Monitorear, comunicación mínima ocasional, solo si integración.

**29. Partición edad 18-65:**
- **Clases:** Válida: 1 clase (18≤edad≤65). Inválidas: 2 clases (edad<18 y edad>65) → regla #1 rango.
- **Casos:**
  - CT1 Válido: edad=30 → acepta registro OK.
  - CT2 Inválido: edad=16 → rechaza "edad mínima 18".
  - CT3 Inválido: edad=70 → rechaza "edad máxima 65".
  - (Bordes recomendados: 18, 65, 17, 66 también válidos para prueba límite).

**30. Orden 10 etapas:**
1. **Reconocimiento** → Entrega: límites/objetivos preliminares + plan relevamiento. Técnica: entrevistas, actas/minutas.
2. **Relevamiento** → Modelo realidad actual (cursogramas, modelos procesos). Técnica: entrevista predominante, documentación.
3. **Diagnóstico** → Problema real + causas + alternativas. Base modelo relevamiento.
4. **Factibilidad** → Alternativa solución elegida (viabilidad Técnica/Operativa/Económica/Legal, principio equifinalidad). **Aquí se genera Propuesta Proyecto** como marco inicial.
5. **Diseño** → Modelo solución (conceptual→físico) datos/procesos.
6. **Desarrollo** → Código + adquisiciones HW/SW, capacitación.
7. **Pruebas** → Plan pruebas, correcciones (unidad/integración/sistema/aceptación, caja blanca/negra).
8. **Implementación** → Sistema instalado, paralelo temporal, capacitación, gestión resistencia.
9. **Mantenimiento** → Sostener validez (correctiva/perfectiva/adaptativa), gestión configuración.
10. **Sustitución** → Plan salida paulatina por etapas, reemplazo cuando mantener es más caro.

**Escala sugerida:**
- 90-100 Excelente | 70-89 Muy bien | 60-69 Aprobado | <60 Repasar guía y rehacer fallos.

