# ¡Katamotza! - Wireframe

## Pantalla inicial

![Pantalla Inicial](.\..\img\wireframe\Pantalla Inicial.png)

## Ayuda

![Pantalla de Ayuda](.\..\img\wireframe\Ayuda.png)

## Sala de Espera - Anfitrión

![Sala de espera anfitrión](.\..\img\wireframe\Sala de Espera.png)

## Sala de Espera - Participante

![Sala de Espera - Participante](.\..\img\wireframe\Sala de Espera Participante.png)

## Juego

![Juego](.\..\img\wireframe\Juego.png)

## Máquina de estados

![](..\img\automata\automata.svg)

## Algoritmos de las transiciones de la máquina de estados

#### Mostrar créditos

Ocurre cuando el usuario presiona el hipertexto "créditos" en el footer.

Mostrar un pop up con los créditos de los ítems obtenidos de fuentes externas.

```
Implementación mediante el uso de una librería externa para los pop ups, invocada con la palabra "Swal.fire" y enviando los parámetros correspondientes.
```

#### Abandonar

Ocurre cuando el usuario presiona el botón de abandonar en la sala de espera o en la pantalla de juego.

```
El usuario envía el mensaje leave que contiene su ID.

Pasar al estado [Eliminar jugador].

Presentar el mensaje de "Abandonando la partida".

El usuario recibe la respuesta del servidor leaveResponse

Redirigir a la pantalla de inicio.
```

#### Eliminar jugador

Ocurre cuando el servidor recibe el mensaje leave .

```
Eliminar al jugador de la lista que indica el estado de los jugadores 

Hacer un broadcast del mensaje leaveResponse a los demás jugadores con la información actualizada (sin dicho jugador).

```

Este procedimiento es el mismo si se está en la sala de espera ya que todos los clientes pueden ver los jugadores que se han unido a la partida.

#### Solicitar crear partida 

Ocurre cuando el anfitrión presiona el botón de crear partida.

```
El anfitrión envía el mensaje initial al servidor indicando el nombre del jugador y que será el anfitrión de la partida.

Pasar al estado [creando sesion]

Presentar el mensaje de "cargando"

En caso de recibir el ID de la sesión, redirigir al jugador a la pantalla de "sala de espera anfitrión".

En caso de de esperar un cierto tiempo predefinido (timeout) por la respuesta del servidor y no recibirla, redirigir al usuario a la pantalla principal.
```

#### Creando Sesión

Ocurre cuando se recibe un mensaje initial desde un usuario anfitrión.

```
El servidor devuelve el mensaje initialResponse con el ID de la sesión.
```

#### Unirse a partida

Ocurre cuando un usuario se encuentra en la pantalla de inicio y selecciona el botón de unirse a una partida.

```
Enviar un mensaje initial al servidor indicando el nombre del jugador y el ID de la sesión a la que se desea unir.

Pasar al estado [uniendo a sesión]

Presentar el mensaje de "uniendo"

En caso de recibir el mensaje initialResponse, redirigir al jugador a la pantalla de "sala de espera invitado".

En caso de de esperar un cierto tiempo predefinido (timeout) por la respuesta del servidor y no recibirla, redirigir al usuario a la pantalla principal y mostrar un mensaje de error.
```

#### Uniendo a sesión

Ocurre cuando se recibe un mensaje initial desde un usuario no anfitrión.

```
El servidor valida el ID y localiza la sesión.

En caso de que el ID sea correcto, enviar mensaje playerJoin en broadcast a todos los usuarios que se encuentran en la sesión.
```

#### Iniciar partida

Ocurre cuando el anfitrión selecciona iniciar la partida. 

```
En caso de ser el anfitrión, enviar el mensaje gameOptions con las opciones de configuración elegidas. 

Pasar al estado iniciando partida.

Para cualquier usuario (anfitrión o invitados):

Presentar el mensaje de "Iniciando partida".

En caso de recibir el mensaje gameStart, redirigir al jugador a la pantalla de "juego".

En caso de de esperar un cierto tiempo predefinido (timeout) por la respuesta del servidor y no recibirla, redirigir al usuario a la pantalla de "sala de espera".

En caso de recibir el mensaje game, cargar todas las opciones de configuración.

En caso de de esperar un cierto tiempo predefinido (timeout) por el mensaje game y no recibirla, redirigir al usuario a la pantalla de "sala de espera".
```

#### Iniciando Partida

Ocurre cuando se recibe el mensaje gameOptions.

```
El servidor almacena las opciones recibidas en el mensaje gameOptions.

Enviar el mensaje gameStart en broadcast para todos los clientes.

Enviar mensaje game con el tablero, la asignación de cartas y la información necesaria para crear el juego.
```

#### Mostrar ayuda

Ocurre cuando el usuario presiona el botón de Ayuda.

Mostrar un pop up con las reglas del juego.

```
Implementación mediante el uso de una librería externa para los pop ups, invocada con la palabra "Swal.fire" y enviando los parámetros correspondientes.
```

#### Click objeto incorrecto

El cliente valida si la carta seleccionada es correcta o incorrecta.

Se activa una animación y un sonido en la carta seleccionada.

#### Click objeto correcto

El cliente valida si la carta seleccionada es correcta o incorrecta.

Se activa una animación y un sonido en la carta seleccionada.

Se envía un mensaje al servidor para que valide si la carta seleccionada es correcta o incorrecta. Al ser correcta, el servidor hace un broadcast informando para que todos los clientes actualicen la información del panel de jugadores. La carta encontrada se volverá más transparente en la sección del jugador que la haya encontrado.

#### Stop

Al hacer click en el botón de Stop, se envía un mensaje al servidor para que revise si dicho jugador ha ganado, de haber ganado hace un broadcast comunicando el ganador y la finalización de la partida. Esto se muestra mediante un mensaje pop up.

Para el ganador se activa un pop up diferente que indica que ganó, a los demás jugadores se indica el nombre del jugador que ganó.

En caso de que el jugador haya hecho click en el botón de Stop y la comprobación de si ganó en el servidor es falso, entonces se le muestra un mensaje de error de tipo pop up al jugador correspondiente.

Se utiliza una librería externa para la implementación de los pop ups invocada con la palabra "Swal.fire" y enviando los parámetros correspondientes.

#### Ronda finalizada

Cuando se cambia de ronda, el servidor envía en forma de broadcast una nueva repartición de cartas y se generan nuevos objetos en el tablero.

Los clientes al recibirlo actualizan su pantalla con la nueva información.

#### Hay ganador

Cuando un jugador encuentra su última carta (y la regla de utilizar el botón de Stop esta desactivada), se envía un mensaje al servidor para que revise si dicho jugador ha ganado, de haber ganado hace un broadcast comunicando el ganador y la finalización de la partida. Esto se muestra mediante un mensaje pop up.

Para el ganador se activa un pop up diferente que indica que ganó, a los demás jugadores se indica el nombre del jugador que ganó.

En caso de que el jugador haya hecho click en el botón de Stop y la comprobación de si ganó en el servidor es falso, entonces se le muestra un mensaje de error de tipo pop up al jugador correspondiente.

Se utiliza una librería externa para la implementación de los pop ups invocada con la palabra "Swal.fire" y enviando los parámetros correspondientes.

#### Partida finalizada

Los jugadores son redirigidos a la pantalla de inicio.