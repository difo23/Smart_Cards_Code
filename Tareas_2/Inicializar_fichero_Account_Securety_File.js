/*
Se trata de inicializar el fichero Account File (FF06) donde se ponen 
las claves para las operaciones con la cuenta.

Inicializaremos el fichero donde residen las claves para poder
operar con la cuenta monetaria de la tarjeta.
Para ello estudiar con detenimiento el script de clase 08-inicializa-FICHERO-
ACCOUNT-SECURETY-FILE-ACOS3.js
Este script muestra como se inicializan las claves para operar con la cuenta.

Las claves están establecidas así:

FICHERO ACCOUNT SECURETY FILE FF06 8 RECORDS DE OCHO BYTES

ACCOUNT FILE Record Nº 00: DA DA DA DA DA DA DA DA
ACCOUNT FILE Record Nº 01: DB DB DB DB DB DB DB DB
ACCOUNT FILE Record Nº 02: DC DC DC DC DC DC DC DC
ACCOUNT FILE Record Nº 03: DD DD DD DD DD DD DD DD
ACCOUNT FILE Record Nº 04: DA DA DA DA DA DA DA DA
ACCOUNT FILE Record Nº 05: DB DB DB DB DB DB DB DB
ACCOUNT FILE Record Nº 06: DC DC DC DC DC DC DC DC
ACCOUNT FILE Record Nº 07: DD DD DD DD DD DD DD DD

Ejecutar el script para que escriba las claves en el fichero de la tarjeta

Llegado este punto ya tenemos la tarjeta completamente configurada.
Si ejecutamos el script 01-lee-ficheros-memoria-interna-ACOS3.js veremos en la consola el contenido de todos los ficheros de la memoria interna de la tarjeta. Hacerlo.

Con el ratón copiar y pegar la salida de la consola y copiarlo a un fichero de texto de nombre memoria-interna-1-ACOS3
Subir al servidor web el fichero memoria-interna-1-ACOS3.
*/

/* SE INICIALIZA EL FICHERO ACCOUNT SECURETY FILE
* OCHO RECORDS CON 4 CLAVES 3DES PARA LA ACCOUNT
*/



card = new Card();
//atr = card.reset(Card.RESET_COLD);
//print(atr);
print("");
print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
resp = card.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
print("C�digo SW: " + card.SW.toString(16));
print("");

//print("SE SELECCIONA EL FICHERO ACCOUNT SECURETY FILE FF06");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 FF 06", HEX));

print("          SECURETY FILE FF03");
// EL RECORD 0 ES LA RIGHT HALF OF KD CLAVE DEBITO: DA DA DA DA DA DA DA DA
resp = card.plainApdu(new ByteString("80 D2 00 00 08 DA DA DA DA DA DA DA DA", HEX));
print("C�digo SW: " + card.SW.toString(16));
//
// EL RECORD 01 ES LA RIGHT HALF OF KCR CLAVE CREDITO: DB DB DB DB DB DB DB DB
resp = card.plainApdu(new ByteString("80 D2 01 00 08 DB DB DB DB DB DB DB DB", HEX));
print("C�digo SW: " + card.SW.toString(16));
//
// EL RECORD 02 ES LA RIGHT HALF OF KCF CERTIFY KEY: DC DC DC DC DC DC DC DC
resp = card.plainApdu(new ByteString("80 D2 02 00 08 DC DC DC DC DC DC DC DC", HEX));
print("C�digo SW: " + card.SW.toString(16));
//
// EL RECORD 03 LA RIGHT HALF OF KRD REVOKE DEBIT KEY: DD DD DD DD DD DD DD DD
resp = card.plainApdu(new ByteString("80 D2 03 00 08 DD DD DD DD DD DD DD DD", HEX));
print("C�digo SW: " + card.SW.toString(16));
//
// EL RECORD 04 ES LA LEFT HALF OF KD CLAVE DEBITO: DA DA DA DA DA DA DA DA
resp = card.plainApdu(new ByteString("80 D2 04 00 08 DA DA DA DA DA DA DA DA", HEX));
print("C�digo SW: " + card.SW.toString(16));
//
// EL RECORD 05 ES LA LEFT HALF OF KCR CLAVE CREDITO: DB DB DB DB DB DB DB DB
resp = card.plainApdu(new ByteString("80 D2 05 00 08 DB DB DB DB DB DB DB DB", HEX));
print("C�digo SW: " + card.SW.toString(16));
//
// EL RECORD 06 ES LA LEFT HALF OF KCF CERTIFY KEY: DC DC DC DC DC DC DC DC
resp = card.plainApdu(new ByteString("80 D2 06 00 08 DC DC DC DC DC DC DC DC", HEX));
print("C�digo SW: " + card.SW.toString(16));
//
// EL RECORD 07 LA LEFT HALF OF KRD REVOKE DEBIT KEY: DD DD DD DD DD DD DD DD
resp = card.plainApdu(new ByteString("80 D2 07 00 08 DD DD DD DD DD DD DD DD", HEX));
print("C�digo SW: " + card.SW.toString(16));
//


card.close();
