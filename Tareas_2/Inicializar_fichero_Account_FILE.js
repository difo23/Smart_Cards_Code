/*Se trata de inicializar el fichero Account File (FF05) donde se ponen los valores de la cuenta.

Inicializaremos el fichero donde reside la cuenta monetaria de la tarjeta.
Para ello estudiar con detenimiento el script de clase 07-inicializa-FICHERO-ACCOUNT-FILE-ACOS3.js
Este script muestra como se inicializa la cuenta en diversos campos que hay que inicializar en ella.

Inicializarla con: 20000 céntimos de euro como el Máximo Balance.
El indicador de cuenta será: EC 00 00 01
El indicador de la Referencia del Terminal que dá el crédito será: EC DC 00 01
El indicador de la Referencia del Terminal que genera el débito será: EC CD 00 01

Modificar el script con los valores que se indican ejecutarlo para que los lleve a la tarjeta.

Subir al servidor web el script de inicializacion del fichero Account File.
*/

/* SE INICIALIZA EL FICHERO ACCOUNT FILE FF05
* 
*/

card = new Card();
//atr = card.reset(Card.RESET_COLD);
//print(atr);
print("");
print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
resp = card.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
print("C�digo SW: " + card.SW.toString(16));
print("");

//print("SE SELECCIONA EL FICHERO ACCOUNT FILE FF05");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 FF 05", HEX));
print("          PERSONALIZATION FILE FF05");

// SE ESCRIBE EL RECORD 0 CON EL VALOR 03 (ULTIMA OPERACION CREDITO) 00 10 10 (EL SALDO ES 4142 CENTIMOS DE EURO)
resp = card.plainApdu(new ByteString("80 D2 00 00 04 00 00 00 00", HEX));
print("C�digo SW: " + card.SW.toString(16));

//checksum 0 y 1
resp = card.plainApdu(new ByteString("80 D2 01 00 04 00 00 01 00", HEX));
print("C�digo SW: " + card.SW.toString(16));
resp = card.plainApdu(new ByteString("80 D2 03 00 04 00 00 01 00", HEX));
print("C�digo SW: " + card.SW.toString(16));
//
//---------------------------------------------------------------------
// LOS RECORDS  1 2 Y 3 NO SE ESCRIBEN

// SE ESCRIBE EL RECORD 04 CON EL VALOR MAXIMO DE BALANCE (SE ESTABLECE EN 20000 4E20 CENTIMOS DE EURO)
resp = card.plainApdu(new ByteString("80 D2 04 00 03 00 4E 20", HEX));
print("C�digo SW: " + card.SW.toString(16));

// SE ESCRIBE EL RECORD 05 CON EL IDENTIFICADOR DE LA CUENTA (SE ESTABLECE EN  EC 00 00 01)
resp = card.plainApdu(new ByteString("80 D2 05 00 04 EC 00 00 01", HEX));
print("C�digo SW: " + card.SW.toString(16));

// SE ESCRIBE EL RECORD 06 CON EL IDENTIFICADOR DE LA REFERENCIA DEL TERMINAL QUE DA EL CR�DITO EC DC 00 01)
resp = card.plainApdu(new ByteString("80 D2 06 00 04 EC DC 00 01", HEX));
print("C�digo SW: " + card.SW.toString(16));

// SE ESCRIBE EL RECORD 07 CON EL IDENTIFICADOR DE LA REFERENCIA DEL TERMINAL QUE GENERA EL DEBITO EC CD 00 01)
resp = card.plainApdu(new ByteString("80 D2 07 00 04 EC CD 00 01", HEX));
print("C�digo SW: " + card.SW.toString(16));

card.close()