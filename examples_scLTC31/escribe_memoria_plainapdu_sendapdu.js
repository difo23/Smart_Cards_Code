//PROGRAMA QUE MUESTRA COMO SE ESCRIBE EN MEMORIA
//EN UNA ZONA DE MEMORIA DE LA TARJETA SLE-5542
//A PARTIR DE LA POSICIÓN 0X ESCRIBE 0Y OCTETOS
//MUESTRA EN PANTALLA EL CONTENIDO
/* ESCRIBE EN MEMORIA
*  PRESENTA EL PIN PARA
*  PODER ESCRIBIR EN LA TARJETA 
*  EL PIN ES FFFFFF
*/

// Problemas al cambiar el pin no cambia la respuesta 9000?.

card = new Card();

//atr = card.reset(Card.RESET_COLD);
//print(atr);
//

//**SE FORMA LA APDU CONCATENADO PARA ENVIARLA
//PRIMERA PARTE DE LA APDU para poder leer el pin de la tarjeta
// el codigo 00 20 00 00 03 d0 d1 d2 donde d0 d1 d2 coincida con el pin 
// posees 3 intentos.
// sw1=63 sw2=cx, x es el numero de intentos que aun te quedan

clainsp1p2lg = new ByteString("0020000003", HEX);

//
//***LA SEGUNDA PARTE DE LA APDU ES EL PIN que por defecto es FF FF FF 
PIN = new ByteString("FFFFFF", HEX);

//SE CONCATENA LA PRIMERA PARTE CON EL PIN PARA FORMA LA APDU COMPLETA
apdu = clainsp1p2lg.concat(PIN);
print("Comando para acceso a escritura: "+apdu);
print();

//SE ENVIA A LA TARJETA
resp = card.plainApdu(apdu);
print("Repuesta de plainAPDU: "+resp);

//SI RESPONDE 9000 ES PIN ES VALIDO
//SI RESPONDE 63CX DONDE X ES EL NUMERO DE INTENTOS DISPONIBLES
//SI C0 --> TARJETA BLOQUEADA
//MODIFICAR EL PIN
//00 24 00 00 06 d0 d1 d2 d3 d4 d5
//Modifica el PIN, los datos d0, d1 y d2 corresponden al PIN antiguo, mientras que los datos d3, d4 y
//d5 corresponden al PIN nuevo.
//PARA QUE EL NUEVO PIN SEA EFECTIVO HAY QUE SACAR LA TARJETA DEL LECTOR Y VOLVER A
//METERLA;


print("Código SW: " + card.SW.toString(16));


//SE VAN A ESCRIBIR 16 OCTETOS A PARTIR DE LA POSICION 0X10
//SE ESCRIBEN CON sendApdu
//

DATA = new ByteString("DD DC DF 03 DD DC DF 02 DD DC DF 03 DD DC DF 04", HEX);
//atentos no hace falta el segundo parámetro (Lc)
//envia el dato y se almacena desde la posicion 10
resp = card.sendApdu(0x00, 0xD6, 0x00, 0x10, DATA);
//
print("Respuesta dato enviado: "+resp)
print("Código SW: " + card.SW.toString(16));
print();

resp = card.plainApdu(new ByteString("00 B0 00 10 10", HEX));
print(resp);
print("Código SW: " + card.SW.toString(16));
print();