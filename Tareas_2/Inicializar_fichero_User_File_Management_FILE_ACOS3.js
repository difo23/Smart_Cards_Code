/*Se trata de inicializar el fichero User File Management FILE (FF04) 
donde se ponen los tipos de ficheros y sus caracteristicas de acceso. 
Este fichero ha de tener 8 records pues en el 
Personalización File dijimos que ibamos a crear ocho ficheros.
Leer con detenimiento el documento de definición del sistema de ficheros, 
donde se indican los tipos de ficheros a crear y las características de control de acceso a estos ficheros.

Estudiar con detenimiento el script de clase 05-inicializa-FICHERO-USER-FILE-MANAGEMENT-FILE-FREE-ACCESS-ACOS3.js
Este script se muestra con carácter informativo. Está incompleto pero es función del alumno completarlo para que 
configure completamente los 8 records (uno para cada fichero de usuario que se van a crear).

Subir al servidor web el script de inicializacion del sistema de ficheros de usuario.*/

/* SE INICIALIZA EL FICHERO USER FILE MANAGEMENT FILE
* SE CREAN 8 FICHEROS DE USUARIO DIRECCIONES 
* EC00 EC01 EC02 EC03 EC04 EC05 EC06 EC07
* TODOS LOS FICHEROS CON FREE ACCESS Y SIN FLAGS DE CONTROL DE ACCESO.   */

card = new Card();
//atr = card.reset(Card.RESET_COLD);
//print(atr);
print("");
print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
resp = card.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
print("C�digo SW: " + card.SW.toString(16));
print("");

//print("SE SELECCIONA EL FICHERO USER MANAGEMENT FILE FF04");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 FF 04", HEX));

print("          USER MANAGEMENT FILE FF04");
//80 D2 01 00 07
//cla=80, ins=D2, p1= 01 numero de registro logico a leer, p2= 00 offset 
//desplazamiento desde ese registro para iniciar la escritura, p3=07 numero de bytes de datos.

// SE ESCRIBE EL RECORD 0 PARA EL PRIMER FICHERO BINARIO DE USUARIO CON EL VALOR 01 00 00 00 EC 00 80
resp = card.plainApdu(new ByteString("80 D2 00 00 07 01 00 00 00 EC 00 80", HEX));
//01 00 00 00 EC 01 80
print("Codigo SW:   01 00 00 00 EC 00 80 record 00 " + card.SW.toString(16));

// SE ESCRIBE EL RECORD 1 CON EL VALOR 01 00 00 00 EC 01 80
resp = card.plainApdu(new ByteString("80 D2 01 00 07 01 00 04 04 EC 01 80", HEX));
//01 00 04 04 EC 02 80
print("Codigo SW:   01 00 04 04 EC 01 80 record 01 " + card.SW.toString(16));

// SE ESCRIBE EL RECORD 2 CON EL VALOR 02 00 00 00 EC 02 80
resp = card.plainApdu(new ByteString("80 D2 02 00 07 02 00 40 40 EC 02 80", HEX));
//02 00 40 40 EC 03 E0
print("Codigo SW:   02 00 40 40 EC 02 E0 record 02 " + card.SW.toString(16));

// SE ESCRIBE EL RECORD 3 CON EL VALOR 
resp = card.plainApdu(new ByteString("80 D2 03 00 07 04 00 2A 2A EC 03 80", HEX));
print("Codigo SW:   04 00 2A 2A EC 03 80 record 03 " + card.SW.toString(16));
//04 00 2A 2A EC 04 80 (BINARIO)
//RELLENAR POR EL ALUMNO

// SE ESCRIBE EL RECORD 4 CON EL VALOR 
resp = card.plainApdu(new ByteString("80 D2 04 00 07 08 10 00 00 EC 04 00", HEX));
print("Codigo SW:   08 10 00 00 EC 04 00 record 04 " + card.SW.toString(16));
//08 10 00 00 EC 05 00 
//RELLENAR POR EL ALUMNO

// SE ESCRIBE EL RECORD 5 CON EL VALOR 
//10 10 40 40 EC 06 60
resp = card.plainApdu(new ByteString("80 D2 05 00 07 10 10 40 40 EC 05 00", HEX));
print("Codigo SW:   10 10 40 40 EC 05 60 record 05 " + card.SW.toString(16));
//RELLENAR POR EL ALUMNO

// SE ESCRIBE EL RECORD 6 CON EL VALOR 
//10 FF 10 10 EC 07 00
resp = card.plainApdu(new ByteString("80 D2 06 00 07 10 FF 10 10 EC 06 00", HEX));
print("Codigo SW:   10 FF 10 10 EC 06 00 record 06 " + card.SW.toString(16));
//RELLENAR POR EL ALUMNO

// SE ESCRIBE EL RECORD 7 CON EL VALOR
//20 FF 40 40 EC 08 60
resp = card.plainApdu(new ByteString("80 D2 07 00 07 20 FF 40 40 EC 08 00", HEX));
print("Codigo SW:   20 FF 40 40 EC 08 60 record 07 " + card.SW.toString(16));
//RELLENAR POR EL ALUMNO

card.close();