/* DADO UN NUMERO DE BYTES nb CALCULA SU MÚLTIPLO
*  DE OCHO INMEDIATAMENTE SUPERIOR
*/
print();
print("DADO UN NUMERO nb CALCULA SU MÚLTIPLO DE");
print("DE OCHO INMEDIATAMENTE SUPERIOR");
print();
// Instantiate crypto service
var crypto = new Crypto();
//
// DATOS A LEER DEL FICHERO XX octetos menos de 240 octetos
//-----------------------------------------------------------
//  NUMERO DE OCTETOS A LEER DEL FICHERO: nb
//nb =numero de octetos a leer de la tarjeta
var nb = 130;
print();
print("Número de bytes sin relleno:" + "  " + "nb = " + nb);
//----------------------------------------------------------
// para calcular cuantos octetos hay que pedirle a la
// tarjeta en el GET RESPONSE
// CREAMOS UN MENSAJE SIMULADO (aleatorio) DE nb OCTETOS PARA RELLENARLO
// CON PADDING Y LUEGO CONTARLE LOS BYTES
// este valor se usará despues para solicitarle la lectura 
var simulamensaje = crypto.generateRandom(nb);
//
//se hace padding
simulamensajepadding = simulamensaje.pad(Crypto.ISO9797_METHOD_2, true)
//
nbp = (simulamensaje.pad(Crypto.ISO9797_METHOD_2, true)).length;
//nbp es el número de octetos del mensaje leido de la tarjeta, relleno a multiplo de ocho
print("Bytes con relleno:         " + "  " + "nbp = " + nbp);
print();