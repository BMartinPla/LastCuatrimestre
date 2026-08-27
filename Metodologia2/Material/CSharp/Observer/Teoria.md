# El patrón Observer

No querrás perderte nada interesante, ¿verdad? 
Tenemos un patrón que mantiene a tus objetos informados cuando sucede algo que les importa. 
Se trata del **Patrón Observador**. 

Es uno de los patrones de diseño más utilizados y resulta increíblemente útil. 
Vamos a analizar diversos aspectos interesantes del Patrón Observador, como sus relaciones de uno a muchos y su acoplamiento flexible. 

El ejemplo se trata de una estación de Monitoreo meteorológico.
Captura 3 datos:
- Humedad
- Temperatura
- Presión atmosférica

Con estos 3 datos, definimos una clase y creamos objetos.

El proyecto trata de facilitar a usuarios (o servicios) registrados
visibilizar los datos capturados con diferentes formatos.

## Definición

El patrón Observador define una dependencia de uno a muchos entre objetos, 
de modo que cuando un objeto cambia de estado, todos sus dependientes 
son notificados y actualizados automáticamente.

El patrón Observador define una relación de uno a muchos entre un conjunto de objetos.
Cuando cambia el estado de un objeto, todos sus objetos dependientes reciben una notificación.

El **sujeto** y los **observadores** definen la relación de uno a muchos. 
Tenemos un sujeto que notifica a varios observadores cuando algo en él cambia.  
Los observadores dependen del sujeto: **cuando el estado del sujeto cambia, los observadores reciben una notificación**. 

Existen varias maneras de implementar el patrón Observador, pero la mayoría se basan en un diseño de clases que incluye **interfaces** de **sujeto** y **observador**.

## Primer Diagrama de Clases
<p align="center"> <img src="/home/juan/desa/cs/Observer/Observer01.png"></p>

## Principios de diseño
- Buscar diseños con bajo acoplamiento entre objetos que interactúan.
- Los diseños con bajo acoplamiento permiten construir sistemas orientados a objetos flexibles
que pueden gestionar el cambio porque minimizan la interdependencia entre objetos.



