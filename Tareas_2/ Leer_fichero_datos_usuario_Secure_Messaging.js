/*
Se trata realizar una operación de débito de la Account de la ACOS3.

Vamos a realizar un gasto de la cuenta monetaria de la ACOS3. La instrucción es DEBIT. 
Tiene su correspondiente APDU. Hay que efectuarlo usando la instruccion de debit; no escribiendo 
directamente en los records del fichero Account File, pues se trata de simular el gasto que se efectuaría por un usuario con el método de gasto habitual: por medio de un terminal o de una máquina expendedora...etc.

Es conveniente ejecutar primero el script de clase: 09-pide-INQUIRE-ACCOUNT-ACOS3.js; para ver 
si la tarjeta tiene saldo. De todas formas, si no tiene saldo, la cuenta indicará un error que
 hay que intepretar segun las tablas del manual.


En el script que realice el DEBIT incluir delante el script INQUIRE ACCOUNT y extraer de 
su respuesta el parámetro ATREF u otros si hiciera falta. No se admite ir a leer directamente 
al fichero de la cuenta (FF=05H), pues en un uso normal de la tarjeta eso no se permitiría.

Recordar que a la hora de enviar el ATREF (Contador de transacciones) hay que incrementarlo en 
una unidad respecto al que nos indique con el INQUIRE ACCOUNT, pues la larjeta lo espera incrementado en una unidad. Si no se hace así no validará el DEBIT.

*/
card = new Card();
var crypto = new Crypto();
//atr = card.reset(Card.RESET_COLD);
//print(atr);
//Claves de tarjeta y terminal

KCL = "DDDCDFDDDCDFDDDC";
KCR ="DDDCDFDDDCDFDDDC";
KTL = "0001020304050607";
KTR = "0001020304050607";

/*print("");
print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
resp = card.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
print("Codigo SW: " + card.SW.toString(16));
print("");*/
print("Buscando los Keys de session  ");
print("Start session  ")
rdnc=rdnc_original= card.plainApdu(new ByteString("80 84 00 00 08", HEX));
print("RDNC tarjeta: "+rdnc);
print("Codigo SW: " + card.SW.toString(16));
print("");

print("Generando RDNT terminal: ");
//random = Math.floor(Math.random()*11111110111111111111).toString(16);
random= crypto.generateRandom(8);
rdnt=new ByteString(random, HEX)
print("RDNT terminal: "+rdnt);
print("");
//rdnc=new ByteString("A9552047F0AA5587", HEX);
//rdnt= new ByteString("F95405970F1B0B85", HEX);
//Encruoti rdnc con 3DES
keyt=KTL+KTR;
rdnc_crip=cripdes3(rdnc,keyt); 
print("key terminal: "+keyt);
print("RDNc Encriptado 3des: "+rdnc_crip);
print("");

print("Autenticate ")
data_autenticate=rdnc_crip.concat(rdnt);
rd= card.plainApdu(new ByteString("80 82 00 00 10 "+data_autenticate, HEX));
resp_get = card.plainApdu(new ByteString("80 C0 00 00 08", HEX));
print("Autenticata data: "+data_autenticate);
print("Codigo SW: " + card.SW.toString(16));
print("");
print("Get Response ")
resp_get = card.plainApdu(new ByteString("80 C0 00 00 08", HEX));
print("Get tarjeta: "+resp_get);
print("Codigo SW: " + card.SW.toString(16));
print("");
print("");


print("Calcular KSL data: ");
keyc=KCL+KCR;
Ksl=cripdes3(cripdes3(rdnc,keyc),keyt);
//ks2=cripdes3(cripdes3(rdnc,keyc)^rdnt,keyt);
print("key card: "+keyc);
print("Ksl: "+Ksl);

print("");

print("Calcular KSR data: ");
//como las dos mitades son iguales keyt es igual reverse keyt
//keyt=
//r=cripdes3(rdnt,keyc)
//Ksr=cripdes3(r,keyt);
Ksr=cripdes3(rdnt,keyt);
print("key Terminal: "+keyt);
print("Ksr: "+Ksr);

print("");
print("Calcular KS: ");
Ks=Ksl.toString(16)+""+Ksr.toString(16);
print("Ks: "+Ks);

RNDT=descripdes3(resp_get,Ks);
print("RNDT cifrada response confirm: "+resp_get);
print("RNDT original confirm: "+rdnt);
print("RNDT des response confirm: "+RNDT);
if(rdnt.toString(ASCII)==RNDT.toString(ASCII))
{
	print(" Successfull Auth ")
}
print("");


//print("SE SELECCIONA EL FICHERO DE USUARIO EC00");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 00", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC00");
resp = card.plainApdu(new ByteString("80 B0 00 00 00", HEX));
print(resp);
//porque el ins es B0 lectura binaria y no B2 para record como indica el manual es un error?

//start session


//print("SE SELECCIONA EL FICHERO DE USUARIO EC01");

//Instantiate crypto service
function cripdes3(claro, key) 
{
	var crypto = new Crypto();
	// Define 3 different single DES key values
	
	key = new ByteString(key, HEX);
	claro = new ByteString(claro, HEX);
	
	// Create one TRIPLE DES key.
	var des3key = new Key();
	des3key.setComponent(Key.DES, key);
	// Trible DES ECB encrypt
	cifrado = crypto.encrypt(des3key, Crypto.DES_ECB, claro);
	return cifrado;
	}

function descripdes3(cifrado, key) 
{
	var crypto = new Crypto();
	// Define 3 different single DES key values
	
	key = new ByteString(key, HEX);
	cifrado = new ByteString(cifrado, HEX);

	// Create one TRIPLE DES key.
	var des3key = new Key();
	des3key.setComponent(Key.DES, key);
	// Triple DES ECB decrypt
	descifrado = crypto.decrypt(des3key, Crypto.DES_ECB, cifrado);
	  return descifrado;
	}


print("PRESENTACION del ac2 para iniciar: ac2= AC 22 AC 22 AC 22 AC 22");
ac2= "AC22AC22AC22AC22";
ac2_cifrado=cripdes3(ac2,Ks);
resp = card.plainApdu(new ByteString("80 20 02 00 08 "+ac2_cifrado, HEX));
print("Codigo SW: " + card.SW.toString(16));
print("");

resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 01", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC01");
resp = card.plainApdu(new ByteString("80 B0 00 00 00", HEX));
//resp = card.plainApdu(new ByteString("80 B2 00 00 00", HEX));
print(resp);


//fucion crea mac
function macdes3(claro, keys, rndc, seq_add) 
{
	var crypto = new Crypto();
	// Define 3 different single DES key values
	keys = new ByteString(keys, HEX);
	claro = new ByteString(claro, HEX);
	tlv_rellenada=claro.pad(Crypto.ISO9797_METHOD_2, true);
	rndc = new ByteString(rndc, HEX);
	var cal = new ByteString("00 00 00 00 00 00 FF FF", HEX);
	vi = rndc.and(cal);
	seq=vi.add(seq_add);
	//print("vi dentro de encrip "+vi)
    //print("seq dentro de encrip "+seq)
    //print("tlv_rellenada "+tlv_rellenada)
	//Create one TRIPLE DES key.
	var des3key = new Key();
	des3key.setComponent(Key.DES, keys);
	// Trible DES ECB encrypt
	cifrado = crypto.encrypt(des3key, Crypto.DES_CBC, tlv_rellenada,seq);
	//print("mac dentro de encrip "+cifrado)
	mac8 = cifrado.right(8);
	//print("mac8 dentro de encrip "+mac8)
	mac4=mac8.left(4);
	//print("mac4 dentro de encrip "+mac4)
	return [cifrado, mac4];
	
}
function des3(claro, keys, rndc, seq_add) 
{
	var crypto = new Crypto();
	// Define 3 different single DES key values
	keys = new ByteString(keys, HEX);
	claro = new ByteString(claro, HEX);
	tlv_rellenada=claro.pad(Crypto.ISO9797_METHOD_2, true);
	//rndc = new ByteString(rndc, HEX);
	var cal = new ByteString("00 00 00 00 00 00 FF FF", HEX);
	vi = rndc.and(cal);
	seq=vi.add(seq_add);
	//print("vi dentro de encrip "+vi)
    //print("seq dentro de encrip "+seq)
    //print("tlv_rellenada "+tlv_rellenada)
	//Create one TRIPLE DES key.
	var des3key = new Key();
	des3key.setComponent(Key.DES, keys);
	// Trible DES ECB encrypt
	cifrado = crypto.decrypt(des3key, Crypto.DES_CBC, tlv_rellenada,seq);
	//print("mac dentro de encrip "+cifrado)
	//mac8 = cifrado.right(8);
	//print("mac8 dentro de encrip "+mac8)
	//mac4=mac8.left(4);
	//print("mac4 dentro de encrip "+mac4)
	return cifrado;
	
}

//securMessag Lectura
nb=128;
n=9;
p3=ByteString.valueOf(n, 1)
p3_nb=ByteString.valueOf(nb, 1)
print("P3 original: "+p3);
print("p3_nb:  "+p3_nb);
var crypto = new Crypto();
simulamensaje = crypto.generateRandom(nb);
simulamensajepadding = simulamensaje.pad(Crypto.ISO9797_METHOD_2, true);
nbp = (simulamensaje.pad(Crypto.ISO9797_METHOD_2, true)).length;
//nbp_15=ByteString.valueOf(nbp+15, 1);
nbp_15=nbp+15
print("p3_nb+pad+15:  "+nbp_15);

tlv=new ByteString("89 04 8C B0 00 60 97 01 "+p3_nb, HEX);
print("tlv: "+"89 04 8C B0 00 60 97 01 "+p3_nb);
//tlv=new ByteString("89 04 8C B0 00 00 97 01 "+nbp_15, HEX);
//print("tlv: "+"89 04 8C B0 00 00 97 01 "+nbp_15);
//tlv=new ByteString("89 04 8C B0 00 00 97 01 "+p3, HEX);
//print("tlv: "+"89 04 8C B0 00 00 97 01 "+p3);
seq_add=1;
print("ks "+Ks+" rdnc "+rdnc)
met=macdes3(tlv, Ks, rdnc,seq_add);
dataencript=met[0];
mac=met[1];

print("mac y mensaje encript "+mac+" mensaje "+dataencript)
print("");

/*Elijamos el fichero de usuario de nombre EC03, que es un fichero binario, en el que tenemos escrito un string de la actividad anterior.

Leer a partir de la posición 60H 128 octeros del fichero EC03.

Mostrar por pantalla el resultado de la lectura descifrado.*/

print()
print("PRESENTACION el ac1 para iniciar: ac1=  AC 11 AC 11 AC 11 AC 11");
ac1= "AC 11 AC 11 AC 11 AC 11";
//pin_cifrado=cripdes3(pin,Ks);
resp = card.plainApdu(new ByteString("80 20 01 00 08 "+ac1, HEX));
print("Codigo SW: " + card.SW.toString(16));
print("");


print("SE SELECCIONA EL FICHERO DE USUARIO EC03");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 03", HEX));
print("Codigo SW: " + card.SW.toString(16));
print("");

binario="8C B0 00 60 09 97 01 "+p3_nb+" 8E 04 "+mac;//binario
//record ="8C B2 00 00 09 97 01 "+p3+" 8E 04 "+mac;//Records
getrespon="80 C0 00 00 "+nbp_15;
print("getrespon: "+getrespon);

//print("SE SELECCIONA EL FICHERO DE USUARIO EC03");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 03", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC03");
//print(resp);
//resp_2=card.sendApdu(0x80,0xC0,0x00,0x00,nbp+15);

resp = card.plainApdu(new ByteString(binario, HEX))
print("Codigo SW: antes get response " + card.SW.toString(16));
//resp_2 = card.plainApdu(new ByteString(getrespon, HEX));
resp_2=card.sendApdu(0x80,0xC0,0x00,0x00,nbp_15);
print("Respuesta tarjeta: "+resp_2);
print("Codigo SW: despues de get response" + card.SW.toString(16));
print("Get response: "+getrespon);
//resp_2=card.plainApdu(new ByteString("80 C0 00 00 22", HEX))
resp_string=resp_2.toString(HEX);
resp_string_encript_padding=resp_string.substr( 0, 270);
resp_string_encript=resp_string.substr( 6, 256);
//resp_string_mac=resp_string.substr( 50, 8);
print("tlv2 "+resp_string_encript_padding)
print("data encrip "+resp_string_encript)
//tlv_1="89048CB00000871107";
tlv_1=new ByteString("89048CB00060",HEX);
tlv_2=new ByteString(resp_string_encript_padding, HEX);
//tlv_3="99029000"
//tlv_rellenada=claro.pad(Crypto.ISO9797_METHOD_2, true);
tlv_resp=tlv_1.concat(tlv_2);
print("Valor de TLV resp para calculo mac: "+tlv_resp);
print("Ks: "+Ks);
print("rdnc: "+rdnc);
seq_add=1;
//print("function macdes3(claro, keys, rndc, seq_add)")
met_resp=des3(resp_string_encript, Ks, rdnc_original,seq_add);
dataencript_resp=met_resp;
//mac_resp=met_resp[1];
//resp_4=resp_2.subString(0,4);
//print("Respuesta tarjeta: "+resp_string);
print("Respuesta tarjeta en texto claro: "+dataencript_resp.toString(ASCII));
//print("Respuesta mac tarjeta: "+resp_string_mac);
//print("Respuesta mac terminal: "+mac_resp);


//Fin de lectura security message

//print("Codigo SW: " + card.SW.toString(16));
//print("Envios con la mac record " +record);
//resp = card.plainApdu(new ByteString(record, HEX));//Records
//print(resp);

//RELLENAR POR EL ALUMNO

card.close();