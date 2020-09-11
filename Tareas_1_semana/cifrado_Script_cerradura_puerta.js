/* Ing. Lizandro Ramirez Difo-
 * Aplicaciones Smartcard - 
 * Master en Software Sitemas Distribuidos y Empotrados
 * Universidad Politecnica de Madrid.
 */


/*  SCRIPT DE CERRADURA DE PUERTA:
En el script de cerradura se deberá descifrar el string completo antes de hacer las 
comparaciones y permitir la apertura de la puerta.
La clave de la cerradura (está definida en el script de cerrradura) será igual que la
usada en el script de gestión y por supuesto el modo de cifrado tambien.
*/

/*En el script de gestión:
Se lee el número de serie de la tarjeta (se completa a 8 bytes si no ocupa ocho bytes,
rellenando a ceros por la derecha).
Se cifra con simple DES y con una clave C1C2C3C4C5C6C7C8. Se escribe en la tarjeta desde
la posición 0x40 y siguientes.
*/

	var crypto = new Crypto();
	var key = new ByteString("C1C2C3C4C5C6C7C8", HEX);
	var deskey_serial = new Key();
	deskey_serial.setComponent(Key.DES, key);
	var key1 = new ByteString("D1D2D3D4D5D6D7D8", HEX);
	var key2 = new ByteString("C1C2C3C4C5C6C7C8", HEX);
	var key3 = new ByteString("F1F2F3F4F5F6F7F8", HEX);
	var deskey1 = new Key();
	deskey1.setComponent(Key.DES, key1);
	var deskey2 = new Key();
	deskey2.setComponent(Key.DES, key2);
	var deskey3 = new Key();
	deskey3.setComponent(Key.DES, key3);
	var des2key = new Key();
	des2key.setComponent(Key.DES, key1.concat(key2));
	var des3key = new Key();
	des3key.setComponent(Key.DES, key1.concat(key2).concat(key3));
numero_habitacion="4455";
fecha_actual="09-11-2011";


fecha_a = new Date( fecha_actual.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3") );

print("Fecha actual: "+fecha_a);
print("Codigo de esta habitacion: "+numero_habitacion);
print();
	
	
length_hex_habitacion="04";
length_hex_FS="08";

posicion_habitacion="80"
posicion_FS="84";


//Se muestra el mapa para la posicion del codiogo de la habitacion.
resp = card.plainApdu(new ByteString("00 B0 00 80 50", HEX));
print("Código SW: " + card.SW.toString(16));
print();

fs_str=new ByteString(resp.toString(16), HEX);

//
// DESCIFRADO CON TRIPLE DES ECB
result = crypto.decrypt(des3key, Crypto.DES_ECB,fs_str);
//


function convertFromHex(hex) {
		var hex = hex.toString();//force conversion
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
		    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
}


result=convertFromHex(result.toString(HEX));
ch_str=result.substring(0, 4);
fs_str=result.substring(4, 12);


fecha_b = new Date( fs_str.replace( /(\d{2})(\d{2})(\d{4})/, "$2/$1/$3") );

if(numero_habitacion==ch_str)
	{
		if((Date.parse(fecha_b)) >= (Date.parse(fecha_a)))
			{
			h1=(Date.parse(fecha_b))-(Date.parse("01/01/1970"));
			h2=(Date.parse(fecha_a))-(Date.parse("01/01/1970"));
			h3=(h1-h2)/1000;
			h4=h3/3600;
			
			 print("Tiempo disponible "+h4+" horas")
			 print("Abrir la puerta");
			}
		else
			{
			 print("Fecha actual "+fecha_a+" es mayor que la fecha de salida "+fecha_b)
			 print("Tiempo de estadia terminado puerta cerrada");
			}
	}
else
	{
	print("Esta no es su habitacion")
	
	}
