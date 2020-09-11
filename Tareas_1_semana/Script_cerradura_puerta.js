/* Ing. Lizandro Ramirez Difo-
 * Aplicaciones Smartcard - 
 * Master en Software Sitemas Distribuidos y Empotrados
 * Universidad Politecnica de Madrid.
 */


/*  SCRIPT DE CERRADURA DE PUERTA:
 *    
 *    Se leen los 4 bytes del número de habitación y se comparan con el real de la 
 *    habitación. Si coinciden se leen los 8 bytes de la fecha de salida y se comparan 
 *    con la fecha actual. Se admite definir una variable en el script con la fecha actual 
 *    (para no tener que leerla del sistema). Si la fecha de salida leída de la tarjeta es 
 *    mayor o igual que la fecha actual despues de haber coincidido el número de habitación
 *    se abrirá la cerradura, lo que se indicará con un mensaje en la pantalla diciendo: 
 *    PUERTA ABIERTA. En caso contrario termina el script.
*/

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

function convertFromHex(hex) {
		var hex = hex.toString();//force conversion
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
		    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
}


//Se muestra el mapa para la posicion del codiogo de la habitacion.
resp_hab = card.plainApdu(new ByteString("00 B0 00 "+posicion_habitacion+" "+length_hex_habitacion, HEX));
print("Codigo de la habitacion tarjeta cliente: ");
print(resp_hab)


//Se muestra el mapa modificado para fecha de salida.
resp_fs = card.plainApdu(new ByteString("00 B0 00 "+posicion_FS+" "+length_hex_FS, HEX));
print("Fecha de salida del cliente: ");
print(resp_fs);
print("Código SW: " + card.SW.toString(16));
print();

fs_str=convertFromHex(resp_fs.toString(16));
ch_str=convertFromHex(resp_hab.toString(16));

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
