/* LEE LOS SECTORES DE MIFARE */


card = new Card();
atr = card.reset(Card.RESET_COLD);
//print(atr);
//Carga la clave A en el lector. ff ff ff ff ff ff en la posicion 0.
resp = card.plainApdu(new ByteString("FF 82 20 00 06 FF FF FF FF FF FF", HEX));
print(card.SW.toString(16));
//Lee el serial number de la tarjeta
//MIFARE 1k solo tiene 4 bytes de serial
resp = card.plainApdu(new ByteString("FF CA 00 00 04", HEX));
print("SERIAL NUMBER:");
print(resp);
print(card.SW.toString(16));
print();


//SE AUTENTICA CON EL BLOQUE 4 del SECTOR 1
//
resp = card.plainApdu(new ByteString("FF 86 00 00 05 01 00 04 60 00", HEX));
//print("Código SW: " + card.SW.toString(16));

//ESCRITURA DEL BLOQUE 4
resp = card.plainApdu(new ByteString("FF D6 00 04 10 DD 04 DC 04 DF 04 DD 04 DC 04 DF 04 DC 04 DF 04", HEX));
//
print("Código SW: " + card.SW.toString(16));

//SE AUTENTICA CON EL BLOQUE 8 DEL SECTOR 2
//
resp = card.plainApdu(new ByteString("FF 86 00 00 05 01 00 08 60 00", HEX));
//print("Código SW: " + card.SW.toString(16));

//ESCRITURA DEL BLOQUE 8 COMPLETO
resp = card.plainApdu(new ByteString("FF D6 00 08 10 DD 08 DC 08 DF 08 DD 08 DC 08 DF 08 DC 08 DF 08", HEX));
print("Código SW: " + card.SW.toString(16));

card.close();