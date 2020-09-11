//
//PROGRAMA QUE MUESTRA COMO SE DEFINE EL OBJETO CARD
//COMO SE RESETEA LA CARD POR SOFTWARE.
//LEE UNA ZONA DE MEMORIA DE LA TARJETA SLE-5542
//A PARTIR DE LA POSICIÓN 08 LEE 7 OCTETOS
//MUESTRA EN PANTALLA EL CONTENIDO
//
//LEE EL MAPA DE MEMORIA COMPLETO DE LA CARD
//
card = new Card();
atr = card.reset(Card.RESET_COLD);
print(atr);
print();
//
//
//***Lee 7 octetos a partir de la posición 08

resp = card.plainApdu(new ByteString("00 B0 00 02 07", HEX));
print(resp);
print("Código SW: " + card.SW.toString(16));
print();

// nota: 00 B0 00 08 07 comando que indica la lectura de la memoria prinipal
// 00 BO 00 P2 P3 donde p2=08 indica la posicion de donde se van a devolver
// p3=07 octetos.
//"Devuelve P3 octetos del contenido de la memoria principal desde la posición P2."



//***Lee mapa memoria completo poniendo 00 en el parámetro P3

resp = card.plainApdu(new ByteString("00 B0 00 00 00", HEX));
print(resp);
print("Código SW: " + card.SW.toString(16));
print();

// nota: este comando 00 B0 00 00 00 lee la memoria desde la posicion 0 hasta el final
// de toda la memoria p3=00 y p2=00.