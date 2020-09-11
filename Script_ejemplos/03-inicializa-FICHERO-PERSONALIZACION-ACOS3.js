/* SE INICIALIZA EL FICHERO DE PERSONALIZACIÓN (SIN ACTIVAR EL BIT DE
* PERSONALIZACIÓN. PARA QUE CREE OCHO FICHEROS DE USUARIO  */

card = new Card();
//atr = card.reset(Card.RESET_COLD);
//print(atr);
print("");
print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
resp = card.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
print("Código SW: " + card.SW.toString(16));
print("");

//print("SE SELECCIONA EL FICHERO PERSONALIZATION FILE FF02");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 FF 02", HEX));
print("          PERSONALIZATION FILE FF02");
// SE ESCRIBE EL RECORD 0 CON EL VALOR 07 14 08 (EL CUARTO BYTE NO SE ESCRIBE, BIT PERSO NO)
// 07 = 00000111 -> VER DOCUMENTO DEFINICIÓN SISTEMA DE FICHEROS
// 14 = 00010100 -> VER DOCUMENTO DEFINICIÓN SISTEMA DE FICHEROS
// 08 = 00001000 -> SE CREARAN OCHO FICHEROS EN LA CARD
resp = card.plainApdu(new ByteString("80 D2 00 00 03 07 14 08", HEX));
//
print("Código SW: " + card.SW.toString(16));

card.close();

//HAY QUE RESETEAR LA TARJETA.
