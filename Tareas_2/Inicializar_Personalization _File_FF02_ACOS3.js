/*BAJO NINGÚN CONCEPTO ESCRIBIR EN EL MANUFACTURER FILE (FF01), NO SE NECESITA
Leer con detenimiento el documento PARA-LA-ASIGNATURA-APLICACIONES-SMART-CARDS-definicion-sistema-
ficheros-ACOS3.pdf En este documento se explica que significan estos tres bytes. El último 08 es 
el número de ficheros que vamos a crear.

Se va a inicializar el primer record del fichero de personalización (FF02) para que 
se creen 8 ficheros de usuario.Al mismo tiempo se van a especificar opciones de funcionamiento
de la tarjeta como:
-Se puede cambiar el PIN, con la intrucción correspondiente
-Se va cifrar con 3DES
-Se crea y se utilizará la cuenta (ACCOUNT)

Para inicializar el primer record de FF02 basta con escribir 3 bytes (07 14 08) en el primer record, 
el cuarto byte no se escribe pues se puede bloquear la tarjeta.En el segundo record de este fichero 
no se escribe pues no hace falta.

Para que la tarjeta tengua en cuenta las modificaciones hay que resetearla (sacarla del lector y
volverla a meter).
Estudiar con detenimiento el script de clase 03-inicializa-FICHERO-PERSONALIZACION-ACOS3.js
Subir al servidor web el fichero que realiza la inicialización de FF02.*/

/* SE INICIALIZA EL FICHERO DE PERSONALIZACI�N (SIN ACTIVAR EL BIT DE
* PERSONALIZACI�N. PARA QUE CREE OCHO FICHEROS DE USUARIO  */

card = new Card();
//atr = card.reset(Card.RESET_COLD);
//print(atr);
print("");
print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
resp = card.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
print("C�digo SW: " + card.SW.toString(16));
print("");

//print("SE SELECCIONA EL FICHERO PERSONALIZATION FILE FF02");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 FF 02", HEX));
print("          PERSONALIZATION FILE FF02");
// SE ESCRIBE EL RECORD 0 CON EL VALOR 07 14 08 (EL CUARTO BYTE NO SE ESCRIBE, BIT PERSO NO)
// 07 = 00000111 -> VER DOCUMENTO DEFINICI�N SISTEMA DE FICHEROS
// 14 = 00010100 -> VER DOCUMENTO DEFINICI�N SISTEMA DE FICHEROS
// 08 = 00001000 -> SE CREARAN OCHO FICHEROS EN LA CARD
resp = card.plainApdu(new ByteString("80 D2 00 00 03 27 14 08", HEX));
//
print("Codigo SW: " + card.SW.toString(16));
card.close();
//HAY QUE RESETEAR LA TARJETA.