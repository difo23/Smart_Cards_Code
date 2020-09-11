//sistema de tickes de autobuses
//tarjeta mifare 4k


card = new Card();
atr = card.reset(Card.RESET_COLD);

valor_max= 10000// 100 euros 10000 centabos
tarifa= 85// 0.85 euros
cod_emisor="EM0102"
date_emisor="15022015;010023"
cod_trans="MT0101"
cod_pago="TC0101"
cod_parada="ST0101"
date_inparada="15022015;010023"

//readbloque(4)
//readsector(1)
//set_value(4, 89, "-")
//readbloque(4)
//readsector(1)
valor_carga_init=89;
//emisor(valor_carga_init, cod_emisor, date_emisor)
comprobador()

function readserial()
{
resp = card.plainApdu(new ByteString("FF CA 00 00 04", HEX));
print("SERIAL NUMBER: " + resp);
//print(card.SW.toString(16));
//print();
}

function set_value(bloque, value, operador)
{
	//Los valores negativos se almacenan en complemento a2.
	//Por razones de integridad y seguridad un value se
	//almacena tres veces: dos veces sin invertir y una vez
	//invertido.
	// bytes 0 1 2 3= value, bytes 4 5 6 7= value invert, 8 9 10 11=value, bytes 12=addr, bytes 13=addr_invert, bytes=14, bytes_invert=15
	valor_anterior = new ByteString(readbloque(4), HEX)
	valor_anterior= valor_anterior.bytes(0,4)
	//value=ByteString.valueOf(value, 4)
	
	if(operador=="+")
	{
	value=valor_anterior.add(value)
	}
	if(operador=="-")
	{
	//print(valor_anterior.toString(HEX))
	//print(value.toString(HEX))
	//print(valor_anterior.toString(HEX)-value.toString(HEX))
	value=valor_anterior-value
	}
	value=ByteString.valueOf(value, 4)
	//value = value.toString(16)
	print("Valor:" +value+" fin")
	
	bloque=ByteString.valueOf(bloque, 1)
	//print(bloque)
	bloque_invert= bloque.not()
	v = new ByteString("2710", HEX)
	v2 = new ByteString("10", HEX)
	//print(bloque_invert)

	if((value <= v) ){//&& (value >= v2) ){
	print("entraaa")
	value = new ByteString(value, HEX);
	//print(value);
	//value = parseInt(value.toString())
	//value=ByteString.valueOf(value, 4)
	//print(value);
	//01100100
	//10011011
	//x = new ByteString("123", HEX);
	value_invert = value.not();
	value_invert= new ByteString(value_invert, HEX);
	//value_invert = value_invert.toString()
	//value_invert=ByteString.valueOf(value_invert , 4)
	//print(value_invert)
	//value_invert =  value_invert.not()
	//value_invert.toString(HEX)
	//print(value_invert)
	value=""+value.toString(16)+value_invert.toString(16)+value.toString(16)+bloque+bloque_invert+bloque+bloque_invert
	print(value)
	//print(bloque)
	//print(value.length/2-1)
	writebloque("00", bloque, value)
	//readsector(1)
	
	}
	

}

function clave_lect(pos, clave)
{
	
	//Carga la clave en el lector. ff ff ff ff ff ff en la posicion 0.
	resp = card.plainApdu(new ByteString("FF 82 20 "+pos+" 06 "+clave, HEX));
	print(card.SW.toString(16));
	//
}

function start_app()
{}

function writebloque(pos, bloque, datos)
{
	clave_lect("00", "ff ff ff ff ff ff")
	readserial()
	//print();

	//SE AUTENTICA CON EL BLOQUE 4 del SECTOR 1
	//
	resp = card.plainApdu(new ByteString("FF 86 00 00 05 01 00 "+bloque+" 60 00", HEX));
	//print("Código SW: " + card.SW.toString(16));

	//ESCRITURA DEL BLOQUE 4
	//resp = card.plainApdu(new ByteString("FF D6 00 04 10 DD 04 DC 04 DF 04 DD 04 DC 04 DF 04 DC 04 DF 04", HEX));
	//
	//print("Código SW: " + card.SW.toString(16));

	//SE AUTENTICA CON EL BLOQUE 8 DEL SECTOR 2
	//
	//resp = card.plainApdu(new ByteString("FF 86 00 00 05 01 00 08 60 00", HEX));
	//print("Código SW: " + card.SW.toString(16));

	//ESCRITURA DEL BLOQUE 8 COMPLETO
	//resp = card.plainApdu(new ByteString("FF D6 00 08 10 DD 08 DC 08 DF 08 DD 08 DC 08 DF 08 DC 08 DF 08", HEX));
	ln=datos.length
	ln=ByteString.valueOf(ln, 1)
    datos=new ByteString(datos,HEX)
	datos=datos.pad(Crypto.ISO9797_METHOD_2, true)
	ln=datos.length
	ln=ByteString.valueOf(ln, 1)

	pdu="FF D6 "+pos+" "+bloque+" "+ln+" "+datos
	print("pdu "+pdu)
	//pdu=new ByteString(pdu,HEX)
	//pdu=pdu.pad(Crypto.ISO9797_METHOD_2, true)
	resp = card.plainApdu(new ByteString(pdu, HEX));
	print("Código SW: " + card.SW.toString(16));
}

function readsector(vau)
{

    a = new ByteString("FF860000050100", HEX);
	f = new ByteString("6000", HEX);
	m = ByteString.valueOf(vau*4);
	KEYapdu = a.concat(m.concat(f))
	//SE REALIZA LA AUTENTICACIÓN CON UN SECTOR
	resp = card.plainApdu(KEYapdu);
	print("SECTOR " + ByteString.valueOf(vau, 1)+ ":");
	for (var i = 0; i < 4; i++) {
					resp = card.sendApdu(0xFF, 0xB0, 0x00, (i+(vau*4)), 0x10);
					print("BLOQUE " + ByteString.valueOf((i+(vau*4)), 1) + ": "+  resp + "   " + resp.toString(ASCII));
					}
}

function readbloque(bloque)
{

    a = new ByteString("FF860000050100", HEX);
	f = new ByteString("6000", HEX);
	m = ByteString.valueOf(bloque);
	KEYapdu = a.concat(m.concat(f))
	//SE REALIZA LA AUTENTICACIÓN CON UN SECTOR
	resp = card.plainApdu(KEYapdu);
	//print("SECTOR " + ByteString.valueOf(vau, 1)+ ":");
	//for (var i = 0; i < 4; i++) {
	//print((bloque+(sector*4)))
					resp = card.sendApdu(0xFF, 0xB0, 0x00, bloque, 0x10);
					//print(resp + "   " + resp.toString(ASCII));
		//			}
	return resp.toString(16)

}



function emisor(v_carga, cod_em, date_em)
{

//valor_max= 10000// 100 euros 10000 centabos
//tarifa= 85// 0.85 euros
valor_car_int=v_carga//new ByteString(v_carga, ASCII);
cod_em=new ByteString(cod_em, ASCII);
date_em=new ByteString(date_em, ASCII);
//cod_trans="MT0101"
cod_pago=new ByteString("TC01010101",ASCII);

var crypto = new Crypto();
simulamensaje = crypto.generateRandom(8);
cod_tarjeta="CT"+simulamensaje;
cod_tarjeta=new ByteString(cod_tarjeta, ASCII);

writebloque("00", "08", cod_tarjeta)
writebloque("00", "09", cod_em)
writebloque("00", "0A", date_em)
writebloque("00", "0C", cod_pago)
set_value(4, valor_car_int , "")
//readsector(2)
//readsector(3)

//writebloque("00", "13", date_em)

//cod_parada="ST0101"
//date_inparada="15/02/2015;01:00:23"

}

function recargador()
{}

function comprobador()
{

r=new ByteString(readbloque(8),ASCII)
print(r)

}

function viaje()
{}


card.close();