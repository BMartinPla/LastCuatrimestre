# Lista de tareas — diseño

## Objetivo

Implementar el ejercicio 3 de `PRG4/Duin/3- Tareas/prg4_eje3.pdf` como una app independiente React + JSX + Vite directamente en `PRG4/Duin/3- Tareas`.

## Alcance funcional

- Permitir ingresar una descripción de 3 a 60 caracteres.
- Mantener deshabilitado el botón de alta hasta alcanzar 3 caracteres; enviar también con Enter.
- Crear cada tarea con identificador único y `hecho: false`.
- Representar cada tarea como `{ id, descripcion, hecho }`.
- Mostrar tareas pendientes y realizadas en dos tablas separadas.
- Cambiar el estado `hecho` usando un checkbox en cualquiera de las tablas.
- Incluir en el grupo de realizadas un botón para borrarlas todas.

## Enfoque

- Mantener los datos en estado React en memoria; no se agrega backend ni persistencia al recargar.
- Usar un formulario controlado nativo y `useState`; no se agregan bibliotecas de formularios.
- Mantener la implementación pequeña: `App.jsx` concentra estado y acciones; CSS se ocupa del diseño adaptable y de los estados vacíos.
- La app no necesita rutas: una pantalla muestra el formulario y ambos grupos.

## Flujo de datos e interacciones

El formulario recorta espacios al inicio y al final al enviar. Si la descripción resultante tiene menos de 3 caracteres o más de 60, no crea una tarea. Al crearla, se agrega al estado como pendiente y se limpia el campo. El checkbox actualiza únicamente la tarea correspondiente; las listas pendientes y realizadas se derivan del estado actual. El botón de limpieza elimina todas las tareas realizadas y puede ocultarse o deshabilitarse cuando no haya ninguna.

## Verificación

- Verificar manualmente alta con click y Enter, el límite mínimo/máximo, el cambio entre grupos y la eliminación masiva.
- Ejecutar `npm run build` desde la carpeta de la app y corregir cualquier error de compilación.

## Fuera de alcance

Autenticación, fechas, edición de descripciones, almacenamiento local, backend, filtros y dependencias adicionales no están en el PDF y no se implementarán.
