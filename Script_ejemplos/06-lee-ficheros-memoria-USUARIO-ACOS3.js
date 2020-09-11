/* LEE LOS FICHEROS DE LA MEMORIA DE USUARIO
* TIENE 8 FICHEROS EC00 EC01 EC02 EC03 EC04 EC05 EC06 EC07
* 
* EC00 TRANSPARENTE 256 BYTES
* EC01 TRANSPARENTE 256 BYTES
* EC02 TRANSPARENTE DE 512 BYTES
* EC03 TRANSPARENTE DE 1024 BYTES
*
* EC04 16 RECORDS DE 8 BYTES
* EC05 16 RECORDS DE 16 BYTES
* EC06 255 RECORDS DE 16 BYTES
* EC07 255 RECORDS DE 32 BYTES
*
*/


card = new Card();
//atr = card.reset(Card.RESET_COLD);
//print(atr);
print("");


//print("SE SELECCIONA EL FICHERO DE USUARIO EC00");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 00", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC00");
resp = card.plainApdu(new ByteString("80 B0 00 00 00", HEX));
print(resp);

//print("SE SELECCIONA EL FICHERO DE USUARIO EC01");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 01", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC01");
resp = card.plainApdu(new ByteString("80 B0 00 00 00", HEX));
print(resp);

//print("SE SELECCIONA EL FICHERO DE USUARIO EC02");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 02", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC02");
resp = card.plainApdu(new ByteString("80 B0 00 00 00", HEX));
print(resp);
resp = card.plainApdu(new ByteString("80 B0 01 00 00", HEX));
print(resp);

//print("SE SELECCIONA EL FICHERO DE USUARIO EC03");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 03", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC03");
resp = card.plainApdu(new ByteString("80 B0 00 00 00", HEX));
print(resp);
resp = card.plainApdu(new ByteString("80 B0 01 00 00", HEX));
print(resp);
resp = card.plainApdu(new ByteString("80 B0 02 00 00", HEX));
print(resp);
resp = card.plainApdu(new ByteString("80 B0 03 00 00", HEX));
print(resp);

//print("SE SELECCIONA EL FICHERO DE USUARIO EC04");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 04", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC04");
for (var i = 0; i < 16; i++) {
			resp = card.sendApdu(0x80, 0xB2, i, 0x00, 0X08);
			print("RECORD " + i.toString(HEX) +":" + "  " + resp + "  " + resp.toString(ASCII));
	}
	
//print("SE SELECCIONA EL FICHERO DE USUARIO EC05");
//RELLENAR POR EL ALUMNO

//print("SE SELECCIONA EL FICHERO DE USUARIO EC06");
//RELLENAR POR EL ALUMNO

//print("SE SELECCIONA EL FICHERO DE USUARIO EC07");
//RELLENAR POR EL ALUMNO

card.close();