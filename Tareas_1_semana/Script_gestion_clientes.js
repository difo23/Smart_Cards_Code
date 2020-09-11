/* Ing. Lizandro Ramirez Difo-
 * Aplicaciones Smartcard - 
 * Master en Software Sitemas Distribuidos y Empotrados
 * Universidad Politecnica de Madrid.
 */

/*SCRIPT DE GESTION DE CLIENTES:
 *  
 *  Se escribirán los siguentes campos en la tarjeta a partir de la posición 0x80:
 *  
 *   -4 bytes en ASCII donde se codificará el número de habitación asignado al cliente. 
 *   	Ejemplo habitación: 5432: 0x35, 0x34, 0x33, 0x32 
 *   -8 bytes en ASCII que codifican la fecha de salida del hotel del cliente. 
 *   	Ejemplo: dia/mes/año. 25/06/2015: 0x32,0x35,0x30,0x36,0x32,0x30,0x31,0x35
 *   -8 bytes que ASCII codifican la fecha de entrada del cliente. 
 *   	Ejemplo igual que el anterior.
 *   -60 bytes que codifican en ASCII; por ese orden: nombre, apellido1, apellido2. 
 *   	Entre nombre y apellido1 hay un espacio y lo mismo entre apellido1 y apellido2.
 *    	Ejemplo: Alumno Aplicado Tarjetas: 0x41,0x6C 0x75, 0x6D,0x6E,0x6F,0x20, 0x41, 
 *    	0x70, 0x6C, 0x69, 0x63, 0x61, 0x64, 0x6F,0x20, 0x54,0x61,0x72, 0x6A,0x65,0x74,
 *    	0x61,0x73
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

//SE VAN A ESCRIBIR length_hex_nombre OCTETOS =hex_nombre desde la POSICION 0X80

	DATA = new ByteString(""+hex_habitacion+""+hex_fecha_salida+""+hex_fecha_entrada+""+hex_nombre, HEX);
	print("Data lista para enviada: "+DATA);

//atentos no hace falta el segundo parámetro (Lc)
//envia el dato y se almacena desde la posicion 80

	resp = card.sendApdu(0x00, 0xD6, 0x00, 0x80, DATA);
	print("Código SW: " + card.SW.toString(16));
	print();


//Mostrar todo el mapa de memoria:
	resp = card.plainApdu(new ByteString("00 B0 00 00 00", HEX));
	print(resp);
	print("Código SW: " + card.SW.toString(16));
	print();