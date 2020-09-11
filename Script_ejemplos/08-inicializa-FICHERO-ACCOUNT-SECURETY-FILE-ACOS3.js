/* SE INICIALIZA EL FICHERO ACCOUNT SECURETY FILE
* OCHO RECORDS CON 4 CLAVES 3DES PARA LA ACCOUNT
*/



card = new Card();
//atr = card.reset(Card.RESET_COLD);
//print(atr);
print("");
print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
resp = card.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
print("Código SW: " + card.SW.toString(16));
print("");

//print("SE SELECCIONA EL FICHERO ACCOUNT SECURETY FILE FF06");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 FF 06", HEX));

print("          SECURETY FILE FF03");
// EL RECORD 0 ES LA RIGHT HALF OF KD CLAVE DEBITO: DA DA DA DA DA DA DA DA
resp = card.plainApdu(new ByteString("80 D2 00 00 08 DA DA DA DA DA DA DA DA", HEX));
print("Código SW: " + card.SW.toString(16));
//
// EL RECORD 01 ES LA RIGHT HALF OF KCR CLAVE CREDITO: DB DB DB DB DB DB DB DB
resp = card.plainApdu(new ByteString("80 D2 01 00 08 DB DB DB DB DB DB DB DB", HEX));
print("Código SW: " + card.SW.toString(16));
//
// EL RECORD 02 ES LA RIGHT HALF OF KCF CERTIFY KEY: DC DC DC DC DC DC DC DC
resp = card.plainApdu(new ByteString("80 D2 02 00 08 DC DC DC DC DC DC DC DC", HEX));
print("Código SW: " + card.SW.toString(16));
//
// EL RECORD 03 LA RIGHT HALF OF KRD REVOKE DEBIT KEY: DD DD DD DD DD DD DD DD
resp = card.plainApdu(new ByteString("80 D2 03 00 08 DD DD DD DD DD DD DD DD", HEX));
print("Código SW: " + card.SW.toString(16));
//
// EL RECORD 04 ES LA LEFT HALF OF KD CLAVE DEBITO: DA DA DA DA DA DA DA DA
resp = card.plainApdu(new ByteString("80 D2 04 00 08 DA DA DA DA DA DA DA DA", HEX));
print("Código SW: " + card.SW.toString(16));
//
// EL RECORD 05 ES LA LEFT HALF OF KCR CLAVE CREDITO: DB DB DB DB DB DB DB DB
resp = card.plainApdu(new ByteString("80 D2 05 00 08 DB DB DB DB DB DB DB DB", HEX));
print("Código SW: " + card.SW.toString(16));
//
// EL RECORD 06 ES LA LEFT HALF OF KCF CERTIFY KEY: DC DC DC DC DC DC DC DC
resp = card.plainApdu(new ByteString("80 D2 06 00 08 DC DC DC DC DC DC DC DC", HEX));
print("Código SW: " + card.SW.toString(16));
//
// EL RECORD 07 LA LEFT HALF OF KRD REVOKE DEBIT KEY: DD DD DD DD DD DD DD DD
resp = card.plainApdu(new ByteString("80 D2 07 00 08 DD DD DD DD DD DD DD DD", HEX));
print("Código SW: " + card.SW.toString(16));
//


card.close();
