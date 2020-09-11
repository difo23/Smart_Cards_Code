/*Hola a todos:

En la tarea "Llave de hotel cifrada" os vais a encontrar con una particularidad. Os envío una pequeña ayuda.

Se trata de concatenar las variables:
habitacion,fechaentrada,fechasalida,nombre,espacio,apellido1,espacio,apellido2

Dependiendo de las longitudes de las variables nombre y apellido1 y apellido2 lo que resulte de esa concatenación tendrá más o menos longitud, en todo caso será una casualidad que su longitud sea de ochenta octetos justos.

Pero en la tarjeta hay que grabar ochenta octetos justos, porque:
La cerradura tiene que leer ochenta octetos justos para descifrarlos y luego extraer de ellos valores para comparar.
Ademas el cifrador necesita un número múltiplo de ocho para cifrar.

La solución es rellenar con ceros a la derecha hasta completar la longitud total de 80 octetos. Despues cifrarlo y grabarlo en la tarjeta. La cerradura lee 80 octetos los descifra y luego los procesa.

Os envio un pequeño script que os resuelve el problema. Dada una variable de longitud n octetos, menor que 80 la convierte en una de 80 octetos rellenando con ceros a la derecha. Os lo envio también en un fichero adjunto.
Ejecutarlo y vereis como lo hace. Estudiarlo y vereis la agilidad del plugin de javascript para procesar cadenas de octetos.

En todo caso si teneis alguna duda no dudeis en consultarme.
Os recuerdo que os he puesto fecha límite de entrega de las tareas, el viernes que viene.
Nos vemos el jueves que viene por la tarde de 18 a 20 horas para resolver y aclarar dudas.

Saludos

_____________________________________
SCRIPT
_______________________________________
*/
//PROGRAMA PARA RELLENAR UNA VARIABLE CON CEROS A LA 
//DERECHA HASTA UN VALOR DETERMINADO
//
// 
Habitacion = new ByteString("5320", ASCII);
print(habitacion);
fechaentrada = new ByteString("25022015", ASCII);
print(fechaentrada);
fechasalida = new ByteString("28022015", ASCII);
print(fechasalida);
nombre = new ByteString("Alumno", ASCII);
apellido1 = new ByteString("Aplicado", ASCII);
apellido2 = new ByteString("Tarjetas", ASCII);
espacio = new ByteString("20", HEX);
print(nombre);
print(apellido1);
print(apellido2);
//
grabartarjeta = habitacion.concat(fechaentrada).concat(fechasalida).concat(nombre).concat(espacio).concat(apellido1).concat(espacio).concat(apellido2);
print(grabartarjeta);
print("Longitud del mensaje inicial a grabar en la tarjeta: " + + grabartarjeta.length + " octetos");
print();
//
//HAY QUE RELLENAR HASTA 80 QUE SON LOS QUE HAY QUE CIFRAR PARA GRABARLOS EN LA TARJETA
// VAMOS A RELENAR CON CEROS A LA DERECHA PARA OBTENER LOS 80.
//
ochenta = 80;
var resta = ochenta - grabartarjeta.length;
//resta son los octetos que faltan por rellenar
print("Faltan por rellenar a ceros: " + + resta);
print();
faltan = ByteString.valueOf(0, resta);
//valueOf genera un ByteString del primer parámetro y del número de octetos del segundo parámetro
//ver documentación.
print(faltan);
//
finalgrabartarjeta = grabartarjeta.concat(faltan);
print(finalgrabartarjeta);
print("Longitud total a grabar en la tarjeta: " + + finalgrabartarjeta.length);
