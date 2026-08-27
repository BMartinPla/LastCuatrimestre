# Patron de Diseño Decorator.

**Decorator** es un patrón de diseño estructural que te permite añadir funcionalidades a
objetos colocando estos objetos dentro de objetos encapsuladores especiales que contienen
estas funcionalidades.

## Problema.

Una cafeteria vende cafes (basico...) y tiene varios tipos de cafe ademas de varios
toppings que se pueden agregar a pedido.

El primer approach es crear una clase base abstracta que contenga una descripcion, un
metodo que devuelva esta descripcion y un metodo que devuelva el costo.

Entonces creamos clases hijas para los distintos tops de cafe seteando la descripcion
y el costo. Cada tipo de cafe, es un cafe por supuesto, y tiene una descripcion y un
costo propios.

Despues esta el tema de los toppings o condimentos. Lo clasico seria leche, crema, chocolate,
vainilla, etc.
Y hay que contemplar el caso que alguien pida doble crema, por ejemplo.

Una solucion podria ser crear una clase para cada tipo de cafe y para la combinacion de
esa clase con todos los condimentos.
Cada clase computaria su costo.
Terrible decision. Serian muchas clases y nos limita poder agregar nuevas combinaciones de
cosas.
El sistema no podria extenderse sin modificarlo.

Nota: Casi toda la cuestion de los patrones de diseño gira alrededor de este ultimo concepto
y trata de solucionarlo.

El patron Decorator, para el caso de nuestra cafeteria, propone arrancar con un cafe base
e ir decorandolo agregandole condimentos.

Los pasos serian:

1. Tomamos un objeto DarkRoast
2. Lo decoramos con un objeto Mocha
3. A lo que sale, lo decoramos con un objeto Whip
4. Llamamos al metidi Cost() y confiamos en la delegacion del calculo final.

A recordar:

- El objeto DarkRoast hereda de Beverage y tiene un metodo cost() para computar cuanto cuesta.
  . El cliente pide agregar Mocha. Creamos entonces un objeto Mocha y con este envolvemos el
  objeto DarkRoast.
- El cliente quiere ademas Whip. Creamos un objeto Whip y repetimos el proceso.

La clave para entender el costo final esta en como se calcula el costo en cada
condimento y que cada objeto condimento tiene como parametro el Beverage base.
