/**
 * Calculate CRC-16 checksum
 */
// Calcula el crc16 según lo requiere la tarjeta MIFARE Desfire EV1 
//                                      16   12   5
// this is the CCITT CRC 16 polynomial X  + X  + X  + 1.
// This works out to be 0x1021, but the way the algorithm works
// lets us use 0x8408 (the reverse of the bit pattern).  The high
// bit is always assumed to be set, thus we only use 16 bits to
// represent the 17 bit value.
// Polynom = 0x8404 el reverse de 0x1021
// Valor inicial =0x6363
// 
// El crc16 de 000102030405060708090a0b0c0d0e0f es 77F5
// El crc16 de 11111111222222223333333344444444 es 1CBC
// El crc16 de 00112233445566778899AABBCCDDEEFF es CC69
// El crc16 de 00000000000000000000000000000000 es 3749
// 
// Funcion calculacrc16 recibe como parámetro un ByteString que es el 
// mensaje cuyo valor CRC16 queremos calcular
// Devuelve el valor del CRC en forma de ByteString.
//
// Ejemplos de mensajes para pruebas:
//var mensaje = new ByteString("11111111222222223333333344444444", HEX);
//var mensaje = new ByteString("00112233445566778899aabbccddeeff", HEX);
//var mensaje = new ByteString("00000000000000000000000000000000", HEX);	
//var mensaje = new ByteString("000102030405060708090a0b0c0d0e0f", HEX);
//var mensaje = new ByteString("00112233445566778899", HEX); 
//	
function calculacrc16(mensaje) {
	var l = mensaje.length;
	var polynom = 0x8408;		
	var crccalcular = 0x6363; //valor inicial
	var uno = 0x0001;
	for (var i = 0; i < l; i++) {
		crccalcular ^= mensaje.byteAt(i);
		for (var b = 0; b < 8; b++) {
			if ((crccalcular & uno)==0x0001) {
			crccalcular = (crccalcular>>1)^polynom;
			 }
			else crccalcular>>=1;
			}
	}
// crcfinal es el crccalcular pasado a ByteString.
// como sale invertido en los bytes, se le dá la vuelta:
// el más signifivativo al menos y viceversa. 
// La función devuelve crc16: ByteString con el CRC16	
//	
	crcfinal = ByteString.valueOf(crccalcular);
	crc16 = (crcfinal.right(1)).concat(crcfinal.left(1));
	return crc16;
}





