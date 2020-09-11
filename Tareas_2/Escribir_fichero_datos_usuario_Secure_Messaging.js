/*Se trata de escribir un string en un fichero de datos de usuario.

Elijamos el fichero de usuario de nombre EC03, que es un fichero binario.

Escribir un script que escriba, en modo seguro, con secure messaging,
 a partir de la posición 60H el siguiente string literal:

"Prueba de escritura en el fichero EC03. Aplicaciones para Smartcards. Curso 2015. Alumno Aplicado Tarjetas"

Alumno Aplicado Tarjetas se substituye por el nombre y apellidos del alumno que realiza el ejercicio.


Subir al servidor web el script que escribe con Secure Messaging en el fichero EC03 de datos de usuario.
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
	cifrado = crypto.encrypt(des3key, Crypto.DES_CBC, tlv_rellenada,seq);
	//print("mac dentro de encrip "+cifrado)
	//mac8 = cifrado.right(8);
	//print("mac8 dentro de encrip "+mac8)
	//mac4=mac8.left(4);
	//print("mac4 dentro de encrip "+mac4)
	return cifrado;
	
}
//securMessag Lectura

//print("p3_nb+pad+15:  "+nbp_15);

function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}

message="Un barco";
print("Mensaje a escribir: "+convertToHex(message));
//des3(convertToHex(message), keys, rndc, seq_add) 
seq_add=1;
print("ks "+Ks+" rdnc "+rdnc)

data_encri=des3(convertToHex(message), Ks, rdnc, seq_add) 
len_de=data_encri.length

print(" mensaje encryp "+data_encri+" len "+len_de)
nb=len_de;

//print("P3 original: "+p3);

var crypto = new Crypto();
simulamensaje = crypto.generateRandom(len_de);
simulamensajepadding = simulamensaje.pad(Crypto.ISO9797_METHOD_2, true);
nbp = (simulamensaje.pad(Crypto.ISO9797_METHOD_2, true)).length;
pi=ByteString.valueOf(nbp-len_de, 1);
N=ByteString.valueOf(nbp, 1);
l_87=ByteString.valueOf(nbp+1, 1);
p3_nb=ByteString.valueOf((nbp+3+2+4), 1)
//nbp_15=ByteString.valueOf(nbp+15, 1);
//nbp_15=nbp+15
print("p3_nb:  "+p3_nb);
print("");
seq_add=1;
tlv=new ByteString("89 04 8C B0 00 60 87 "+l_87+pi+data_encri, HEX);
print("tlv: "+"89 04 8C B0 00 60 87 "+l_87+pi+data_encri);
met=macdes3(tlv, Ks, rdnc,seq_add);
dataencript=met[0];
mac=met[1];
print("mac y mensaje encript "+mac)

//tlv=new ByteString("89 04 8C B0 00 00 97 01 "+nbp_15, HEX);
//print("tlv: "+"89 04 8C B0 00 00 97 01 "+nbp_15);
//tlv=new ByteString("89 04 8C B0 00 00 97 01 "+p3, HEX);
//print("tlv: "+"89 04 8C B0 00 00 97 01 "+p3);


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

binario="8C B0 00 60 "+p3_nb+" 87 "+l_87+" "+pi+" "+data_encri+" 8E 04 "+mac;//binario
//record ="8C B2 00 00 09 97 01 "+p3+" 8E 04 "+mac;//Records
//getrespon="80 C0 00 00 "+nbp_15;

//print("SE SELECCIONA EL FICHERO DE USUARIO EC03");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 03", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC03");
//print(resp);
//resp_2=card.sendApdu(0x80,0xC0,0x00,0x00,nbp+15);
print("apdu : "+binario)
resp_2 = card.plainApdu(new ByteString(binario, HEX));
//print("Respuesta tarjeta: "+resp_2);
print("Codigo SW: " + card.SW.toString(16));





//Fin de escritura security message

//print("Codigo SW: " + card.SW.toString(16));
//print("Envios con la mac record " +record);
//resp = card.plainApdu(new ByteString(record, HEX));//Records
//print(resp)


//RELLENAR POR EL ALUMNO

card.close();