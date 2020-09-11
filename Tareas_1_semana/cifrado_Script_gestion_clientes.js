/* Ing. Lizandro Ramirez Difo-
 * Aplicaciones Smartcard - 
 * Master en Software Sitemas Distribuidos y Empotrados
 * Universidad Politecnica de Madrid.
 */
/*CIFRANDO DATOS EN LA TARJETA
Simulación de tarjeta llave y cerradura de puerta de habitación de hotel con la SLE-5542,
pero cifrando lo que se escribe en la tarjeta.
Se trata de que si alguien encuentra una tarjeta del hotel no pueda usarla sabiendo de que
habitación es, al leer la tarjeta. Para ello se van a cifrar los datos en la tarjeta.

Se partirá de los anteriores script simulación de tarjeta llave y cerradura de puerta.

SCRIPT DE GESTIÓN DE CLIENTES
Antes de escribir los 80 bytes que codifican habitación,fecha salida, fecha,entrada, 
nombre y apellidos se van a cifrar con simple DES. La clave de cifrado será 
D1D2D3D4D5D6D7D8.
Se admite el modo ECB pero se valorará el uso del modo CBC.
Se valorará el uso de cifrado doble DES. Segunda parte de la clave: C1C2C3C4C5C6C7C8.
Se valorará el uso con cifrado triple DES. Tercera parte de la clave: F1F2F3F4F5F6F7F8.
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

// Funcion para convertir un string en una cadena hex decimal para enviar a la tarjeta.
	function convertToHex(str) {
	    var hex = '';
	    for(var i=0;i<str.length;i++) {
	        hex += ''+str.charCodeAt(i).toString(16);
	    }
	    return hex;
	}
	
	
	hex_habitacion=convertToHex("4455");
	length_hex_habitacion=hex_habitacion.length/2;
	print("Numero de habitacion: 4455");
	print("Codigo habitacion en hex: "+hex_habitacion);
	print("Tamanio codigo de habitacion hex: "+length_hex_habitacion+" bytes\n");
	
	//fecha en formato Ejemplo: dia/mes/año. 25/06/2015:
	hex_fecha_salida=convertToHex("11112011");
	length_fecha_salida=hex_fecha_salida.length/2;
	print("Fecha de salida habitacion 4455: 11/11/2011");
	print("Codigo FS en hex: "+hex_fecha_salida);
	print("Tamanio codigo de FS hex: "+length_fecha_salida+" bytes\n");
	
	hex_fecha_entrada=convertToHex("10112011");
	length_fecha_entrada=hex_fecha_entrada.length/2;
	print("Fecha de entrada habitacion 4455: 10/11/2011");
	print("Codigo FE en hex: "+hex_fecha_entrada);
	print("Tamanio codigo de FE hex: "+length_fecha_entrada+" bytes\n");
	
	str_nombre="Lizandro Ramirez Difo"
	hex_nombre=convertToHex(str_nombre);
	length_hex_nombre=hex_nombre.length/2;
	print("Nombre y apellidos cliente: "+str_nombre);
	print("Nombre del usuario a registrar en hex: "+hex_nombre);
	print("Tamanio en del nombre hex: "+length_hex_nombre+" bytes\n");
	if(length_hex_nombre<=60)
	{
		str_60=str_nombre;
		for(i=length_hex_nombre;i<60;++i)
			{
				str_60=str_60+"*";
			}
		hex_nombre=convertToHex(str_60);
		length_hex_nombre=hex_nombre.length/2;
		print("Nombre adaptado  del usuario a registrar: "+str_60);
		print("Tamanio en del nombre adaptado hex: "+length_hex_nombre+" bytes\n");
	}
	else
	{
		print("Error el nombre sobrepasa");
	}
	length_hex_nombre=hex_nombre.length;
	
	DATA = new ByteString(""+hex_habitacion+""+hex_fecha_salida+""+hex_fecha_entrada+""+hex_nombre, HEX);
	print("Data lista para enviada: "+DATA);

//SE VAN A ESCRIBIR length_hex_nombre OCTETOS =hex_nombre desde la POSICION 0X80
	
	
	var crypto = new Crypto();
	//
	// Define 3 different single DES key values
	var key1 = new ByteString("D1D2D3D4D5D6D7D8", HEX);
	var key2 = new ByteString("C1C2C3C4C5C6C7C8", HEX);
	var key3 = new ByteString("F1F2F3F4F5F6F7F8", HEX);
	//
	var plain = new ByteString(""+hex_habitacion+""+hex_fecha_salida+""+hex_fecha_entrada+""+hex_nombre, HEX);
	
	//print("Texto en claro:" + "  " + plain);
	// Create three single DES keys, a double DES key and a triple DES key
	var deskey1 = new Key();
	deskey1.setComponent(Key.DES, key1);
	print("Primera clave:" + "  " + deskey1.getComponent(Key.DES).toString(HEX));
	var deskey2 = new Key();
	deskey2.setComponent(Key.DES, key2);
	print("Segunda clave:                " + "  " + deskey2.getComponent(Key.DES).toString(HEX));
	var deskey3 = new Key();
	deskey3.setComponent(Key.DES, key3);
	print("Tercera clave:                                " + "  " + deskey3.getComponent(Key.DES).toString(HEX));
	var des2key = new Key();
	des2key.setComponent(Key.DES, key1.concat(key2));
	print("Clave doble:  " + "  " + des2key.getComponent(Key.DES).toString(HEX));
	var des3key = new Key();
	des3key.setComponent(Key.DES, key1.concat(key2).concat(key3));
	print("Clave triple: " + "  " + des3key.getComponent(Key.DES).toString(HEX));
	print();
	// EN EL CIFRADO CON TRIPLE DES:
	// SE CIFRA CON LA PRIMERA CLAVE. SE DESCIFRA CON LA SEGUNDA Y
	// SE CIFRA CON OTRA TERCERA DE NUEVO
	// SE PODRIA IMPLEMENTAR EN TRES ETAPAS ASI:
	// Triple DES ECB encrypt
	//cipher = plain;
	//cipher = crypto.encrypt(deskey1, Crypto.DES_ECB, cipher);
	//cipher = crypto.decrypt(deskey2, Crypto.DES_ECB, cipher);
	//cipher = crypto.encrypt(deskey3, Crypto.DES_ECB, cipher);
	//
	print("Texto en claro:           " + "  " + plain);
	result = crypto.encrypt(des3key, Crypto.DES_ECB, plain);
	//
	print("Cifrado con TRIPLE DES:   " + "  " + result);
	//
	// DESCIFRADO CON TRIPLE DES ECB
	//result = crypto.decrypt(des3key, Crypto.DES_ECB, result);
	//
	//print("Descifrado con TRIPLE DES:" + "  " + result);
	//print("Descifrado con TRIPLE DES:" + "  " + result.toString(HEX));

//atentos no hace falta el segundo parámetro (Lc)
//envia el dato y se almacena desde la posicion 80

	resp = card.sendApdu(0x00, 0xD6, 0x00, 0x80,result);
	print("Código SW: " + card.SW.toString(16));
	print();


//Mostrar todo el mapa de memoria:
	resp = card.plainApdu(new ByteString("00 B0 00 00 00", HEX));
	print(resp);
	print("Código SW: " + card.SW.toString(16));
	print();