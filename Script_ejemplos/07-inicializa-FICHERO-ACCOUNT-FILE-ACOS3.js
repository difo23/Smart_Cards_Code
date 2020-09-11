/* SE INICIALIZA EL FICHERO ACCOUNT FILE FF05
* 
*/

card = new Card();
//atr = card.reset(Card.RESET_COLD);
//print(atr);
print("");
print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
resp = card.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
print("Código SW: " + card.SW.toString(16));
print("");

//print("SE SELECCIONA EL FICHERO ACCOUNT FILE FF05");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 FF 05", HEX));
print("          PERSONALIZATION FILE FF02");

// SE ESCRIBE EL RECORD 0 CON EL VALOR 03 (ULTIMA OPERACION CREDITO) 00 10 10 (EL SALDO ES 4142 CENTIMOS DE EURO)
resp = card.plainApdu(new ByteString("80 D2 00 00 04 00 00 00 00", HEX));
print("Código SW: " + card.SW.toString(16));
//
//---------------------------------------------------------------------
// LOS RECORDS  1 2 Y 3 NO SE ESCRIBEN

// SE ESCRIBE EL RECORD 04 CON EL VALOR MAXIMO DE BALANCE (SE ESTABLECE EN 10000 CENTIMOS DE EURO)
resp = card.plainApdu(new ByteString("80 D2 04 00 03 00 27 10", HEX));
print("Código SW: " + card.SW.toString(16));

// SE ESCRIBE EL RECORD 05 CON EL IDENTIFICADOR DE LA CUENTA (SE ESTABLECE EN DC 00 00 01)
resp = card.plainApdu(new ByteString("80 D2 05 00 04 DC 00 00 01", HEX));
print("Código SW: " + card.SW.toString(16));

// SE ESCRIBE EL RECORD 06 CON EL IDENTIFICADOR DE LA REFERENCIA DEL TERMINAL QUE DA EL CRÉDITO DC FC 00 01)
resp = card.plainApdu(new ByteString("80 D2 06 00 04 DC FC 00 01", HEX));
print("Código SW: " + card.SW.toString(16));

// SE ESCRIBE EL RECORD 07 CON EL IDENTIFICADOR DE LA REFERENCIA DEL TERMINAL QUE GENERA EL DEBITO DC FD 00 01)
resp = card.plainApdu(new ByteString("80 D2 07 00 04 DC FD 00 01", HEX));
print("Código SW: " + card.SW.toString(16));

card.close()
