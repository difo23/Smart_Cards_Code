/* ESCRIBE BLOQUES DE MIFARE ULTRALIGHT*/


card = new Card();
atr = card.reset(Card.RESET_COLD);



//Escribir en el bloque 0x0D LOS BYTES: DA CF DA CF
resp = card.plainApdu(new ByteString("FF D6 00 0D 04 DA DC DF DD", HEX));
print("Código SW: " + card.SW.toString(16));

card.close();