
/* Ing. Lizandro Ramirez Difo-
 * Aplicaciones Smartcard - 
 * Master en Software Sitemas Distribuidos y Empotrados
 * Universidad Politecnica de Madrid.
 */

/***Escritura y lectura de un byte de la memoria de la SLE-5542***/

/* Realizar un script que sea capaz de escribir el valor 0xCF en el byte de la posición 0x90 
 * de la memoria de la tarjeta.
 * Mostrar el mapa de memoria en el que se aprecie claramente que se ha escrito en el citado byte. 
 * En el script se utilizará la intrucción plainApdu.
 * Escribir el mismo script anterior pero con la instrucción sendApdu.
 * Subir al servidor web el fichero del script que ejecuta lo pedido.
*/

// Problemas al cambiar el pin no cambia la respuesta 9000?.

	card = new Card();
	print();
	clainsp1p2lg = new ByteString("0020000003FFFFFF", HEX);
	apdu = clainsp1p2lg;
	print("Comando para acceso a escritura: "+apdu);
	print();

//SE ENVIA A LA TARJETA
	resp = card.plainApdu(apdu);

//SI RESPONDE 9000 ES PIN ES VALIDO
//SI RESPONDE 63CX DONDE X ES EL NUMERO DE INTENTOS DISPONIBLES
//SI C0 --> TARJETA BLOQUEADA

	print("Código SW: " + card.SW.toString(16));


//SE VAN A ESCRIBIR 1 OCTETOS =0xCF en la POSICION 0X90

	DATA = new ByteString("CF", HEX);
	print("Data lista para enviada: "+DATA);

//atentos no hace falta el segundo parámetro (Lc)
//envia el dato y se almacena desde la posicion 90

	resp = card.sendApdu(0x00, 0xD6, 0x00, 0x90, DATA);
	print("Código SW: " + card.SW.toString(16));
	print();

//Se muestra el mapa modificado desde la pusicion 90 un solo Byte.
	resp = card.plainApdu(new ByteString("00 B0 00 90 01", HEX));
	print(resp);
	print("Código SW: " + card.SW.toString(16));
	print();
	
//Mostrar todo el mapa de memoria:
	resp = card.plainApdu(new ByteString("00 B0 00 00 00", HEX));
	print(resp);
	print("Código SW: " + card.SW.toString(16));
	print();
