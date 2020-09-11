/* Ing. Lizandro Ramirez Difo-
 * Aplicaciones Smartcard - 
 * Master en Software Sitemas Distribuidos y Empotrados
 * Universidad Politecnica de Madrid.
 */

/* Realizar un script que sea capaz de escribir el nombre y los dos apellidos en ASCII
 * del autor del script (dejando un espacio en blanco entre el nombre y el primer apellido 
 * y otro entre los dos apellidos) a partir de la posición 0x90 de la memoria de la tarjeta. 
 * Mostrar el mapa de memoria en el que se aprecie claramente lo que se ha escrito en la tarjeta.  
 * En el script se utilizará la instrucción sendApdu. 
 * Subir al servidor web el fichero del script que ejecuta lo pedido.*/

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

// Funcion para convertir un string en una cadena hex decimal para enviar a la tarjeta.
	function convertToHex(str) {
	    var hex = '';
	    for(var i=0;i<str.length;i++) {
	        hex += ''+str.charCodeAt(i).toString(16);
	    }
	    return hex;
	}
	
	/*function convertFromHex(hex) {
	    var hex = hex.toString();//force conversion
	    var str = '';
	    for (var i = 0; i < hex.length; i += 2)
	        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
	    return str;
	}*/
	
	hex_nombre=convertToHex("Lizandro Ramirez Difo");
	length_hex_nombre=hex_nombre.length/2-1;
	print("Nombre y apellidos: Lizandro Ramirez Difo ");
	
	print("Nombre del usuario a registrar: "+hex_nombre);
	print("Tamanio en del nombre: "+length_hex_nombre+" bytes");
	

//SE VAN A ESCRIBIR length_hex_nombre OCTETOS =hex_nombre desde la POSICION 0X90

	DATA = new ByteString(""+hex_nombre, HEX);
	print("Data lista para enviada: "+DATA);

//atentos no hace falta el segundo parámetro (Lc)
//envia el dato y se almacena desde la posicion 90

	resp = card.sendApdu(0x00, 0xD6, 0x00, 0x90, DATA);
	print("Código SW: " + card.SW.toString(16));
	print();

//Se muestra el mapa modificado desde la pusicion 90.
	resp = card.plainApdu(new ByteString("00 B0 00 90 "+length_hex_nombre, HEX));
	print(resp);
	print("Código SW: " + card.SW.toString(16));
	print();
	
//Mostrar todo el mapa de memoria:
	resp = card.plainApdu(new ByteString("00 B0 00 00 00", HEX));
	print(resp);
	print("Código SW: " + card.SW.toString(16));
	print();
