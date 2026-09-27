# The Factory Pattern

La pregunta sobre **new.** 
Se supone que no debemos programar para una implementación, pero cada vez que usamos **new**, eso es exactamente lo que hacemos, ¿verdad?

Cuando veamos **new**, piensemos en **concreto**.

Sí, al usar el operador **new**, sin duda estaremos instanciando una clase concreta, así que definitivamente se trata de una implementación y no de una interfaz. 

Y la verdad es que basar el código refiriéndonos a una clase concreta puede hacerlo más frágil y menos flexible.

``` 
Duck duck = new MallardDuck();
```
Queremos usar tipos abstractos para mantener el código flexible
¡Pero tenemos que crear una instancia de una clase concreta!

Cuando tenemos un conjunto completo de clases concretas relacionadas, a menudo terminamos escribiendo código como este:
```
Duck duck;

if (picnic) {
    duck = new MallardDuck();
} else if (hunting) {
    duck = new DecoyDuck();
} else if (inBathTub) {
    duck = new RubberDuck();
}
```
Tenemos varias clases de patos diferentes, y no sabemos hasta el tiempo de ejecución cuál necesitamos instanciar.

Aquí se instancian varias clases concretas, y la decisión de cuál instanciar se toma en tiempo de ejecución según ciertas condiciones.  
Cuando vemos código como este, sabemos que al momento de realizar cambios o extensiones, tendremos que volver a abrirlo y examinar qué se debe agregar (o eliminar).  
A menudo, este tipo de código termina presente en varias partes de la aplicación, lo que dificulta el mantenimiento y las actualizaciones, además de aumentar la probabilidad de errores.

Pero en algún momento hay que crear un objeto, y C# solo nos da una forma de crearlo, ¿verdad? 
Entonces, ¿cuál es el problema?

#### ¿Qué tiene de malo el operador new?

Técnicamente, no hay nada malo con el operador **new**.  
Después de todo, es una parte fundamental de la mayoría de los lenguajes modernos orientados a objetos.  
El verdadero problema es nuestro viejo amigo, el CAMBIO, y cómo este impacta nuestro uso de **new**.  

Al programar con una interfaz, sabemoss que podemos aislarnos de muchos de los cambios que podrían ocurrir en un sistema en el futuro. 

**¿Por qué?**  
Si el código está escrito con una interfaz, **funcionará con cualquier clase nueva que implemente esa
interfaz mediante polimorfismo**.  
Sin embargo, cuando tenemos código que utiliza muchas clases concretas, estamos buscando problemas, ya que ese código podría tener que modificarse a medida que se añaden nuevas clases concretas.  
En otras palabras, el código no estará **cerrado para su modificación**.  

Para extender el código con nuevos tipos concretos, tendremos que volver a abrirlo.  
¿Qué se puede hacer entonces? En momentos como estos, se puede recurrir a los principios de diseño orientado a objetos para buscar pistas.   
Recordemos que el primer principio (usado en el patrón **strategy**)se ocupa del cambio y sirve de guía para identificar los aspectos que varían y distinguirlos de lo que permanece igual.

