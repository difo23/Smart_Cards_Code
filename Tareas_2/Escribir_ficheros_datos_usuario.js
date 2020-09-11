/*
Se trata de escribir un string en cada fichero de datos de usuario.

Escribir un script que escriba en cada uno de los ocho ficheros de datos de usuario un string que será:

Para EC00: Nombre fichero nombre del alumno asignatura cuso academico
Ejemplo: EC00 Alumno Aplicado Tarjetas Aplicaciones para Smart Cards 2014 2015

Para EC01: Nombre fichero nombre del alumno asignatura cuso academico
Para EC02: Nombre fichero nombre del alumno asignatura cuso academico
Para EC03: Nombre fichero nombre del alumno asignatura cuso academico
Para EC04: Nombre fichero nombre del alumno asignatura cuso academico
Para EC05: Nombre fichero nombre del alumno asignatura cuso academico
Para EC06: Nombre fichero nombre del alumno asignatura cuso academico
Para EC07: Nombre fichero nombre del alumno asignatura cuso academico

Para ver si se ha escrito en los ficheros de datos de usuario, ejecutar el script
de clase que lee ficheros memoria usuario que se generó en la actividad:

Visualizar los ficheros de datos de usuario creados

Subir al servidor web el script que escribe en los ficheros de datos de usuario.
*/

card = new Card();
var crypto = new Crypto();
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
    print("tlv_rellenada "+tlv_rellenada)
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

//end start session

print("SE SELECCIONA EL FICHERO DE USUARIO EC00");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 00", HEX));
//Funcion para convertir un string en una cadena hex decimal para enviar a la tarjeta.
function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}
nombre_archivo="EC00"; 
nombre_est="Lizando";
nombre_materia="SmrtCard";
curso="2014-15";


hex_nombre_archivo=convertToHex(nombre_archivo); 
hex_nombre_est=convertToHex(nombre_est);
hex_nombre_materia=convertToHex(nombre_materia);
hex_curso=convertToHex(curso);

ln_arch= hex_nombre_archivo.length/2
ln_est=hex_nombre_est.length/2
ln_mat=hex_nombre_materia.length/2
ln_cur=hex_curso.length/2

print("Nombre del archivo:"+nombre_archivo+" Hex:"+hex_nombre_archivo+" ln: "+ln_arch);
print("Nombre del Estudiante: "+nombre_est+" Hex:"+hex_nombre_est+" ln:"+ln_est);
print("Nombre Materia: "+nombre_materia+" Hex:"+hex_nombre_materia+" ln:"+ln_mat);
print("Curso: "+curso+" Hex:"+hex_curso+" ln:"+ln_cur);



print("          CONTENIDO DEL FICHERO DE USUARIO EC00");
//print("80 D0 01 00 "+(ByteString.valueOf(ln_arch,1))+" "+hex_nombre_archivo);
card.plainApdu(new ByteString("80 D0 00 00 "+(ByteString.valueOf(ln_arch,1))+" "+hex_nombre_archivo, HEX));
card.plainApdu(new ByteString("80 D0 00 10 "+(ByteString.valueOf(ln_est,1))+" "+hex_nombre_est, HEX));
card.plainApdu(new ByteString("80 D0 00 20 "+(ByteString.valueOf(ln_mat,1))+" "+hex_nombre_materia, HEX));
card.plainApdu(new ByteString("80 D0 00 30 "+(ByteString.valueOf(ln_cur,1))+" "+hex_curso, HEX));
//porque el ins es B0 lectura binaria y no B2 para record como indica el manual es un error?
resp = card.plainApdu(new ByteString("80 B0 00 00 00", HEX));
print(resp)

print("SE SELECCIONA EL FICHERO DE USUARIO EC01");
print("PRESENTACION del ac2 para iniciar: ac2= AC 22 AC 22 AC 22 AC 22");
ac2= "AC22AC22AC22AC22";
ac2_cifrado=cripdes3(ac2,Ks);
resp = card.plainApdu(new ByteString("80 20 02 00 08 "+ac2_cifrado, HEX));
print("Codigo SW: " + card.SW.toString(16));
print("");

resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 01", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC01");
card.plainApdu(new ByteString("80 D0 00 00 "+(ByteString.valueOf(ln_arch,1))+" "+hex_nombre_archivo, HEX));
card.plainApdu(new ByteString("80 D0 00 10 "+(ByteString.valueOf(ln_est,1))+" "+hex_nombre_est, HEX));
card.plainApdu(new ByteString("80 D0 00 20 "+(ByteString.valueOf(ln_mat,1))+" "+hex_nombre_materia, HEX));
card.plainApdu(new ByteString("80 D0 00 30 "+(ByteString.valueOf(ln_cur,1))+" "+hex_curso, HEX));
resp = card.plainApdu(new ByteString("80 B0 00 00 00", HEX));
//resp = card.plainApdu(new ByteString("80 B2 00 00 00", HEX));
print(resp);

/*
//securMessag escritura
nb=255;
n=9;
p3=ByteString.valueOf(n, 1)
p3_nb=ByteString.valueOf(nb, 1)
print("P3 original: "+p3);
print("p3_nb:  "+p3_nb);
var crypto = new Crypto();
simulamensaje = crypto.generateRandom(nb);
simulamensajepadding = simulamensaje.pad(Crypto.ISO9797_METHOD_2, true);
nbp = (simulamensaje.pad(Crypto.ISO9797_METHOD_2, true)).length;
nbp_15=ByteString.valueOf(nbp+15, 1);
//nbp_15=nbp+15
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
*/

print("PRESENTACION el pin para iniciar: pin=  30 31 32 33 34 35 36 37");
pin= "30 31 32 33 34 35 36 37";
//pin_cifrado=cripdes3(pin,Ks);
resp = card.plainApdu(new ByteString("80 20 06 00 08 "+pin, HEX));
print("Codigo SW: " + card.SW.toString(16));
print("SE SELECCIONA EL FICHERO DE USUARIO EC02");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 02", HEX));
print("Codigo SW: " + card.SW.toString(16));

/*
print("");
binario="8C B0 00 00 09 97 01 "+p3_nb+" 8E 04 "+mac;//binario
//record ="8C B2 00 00 09 97 01 "+p3+" 8E 04 "+mac;//Records
getrespon="80 C0 00 00 "+nbp_15;
//end mess sec
print("          CONTENIDO DEL FICHERO DE USUARIO EC02");
//print("Envios con la mac bianrio " +binario);
resp = card.plainApdu(new ByteString(binario, HEX));//binario
//print(resp);
//resp_2=card.sendApdu(0x80,0xC0,0x00,0x00,nbp+15);
resp_2 = card.plainApdu(new ByteString(getrespon, HEX));
print("Respuesta tarjeta: "+resp_2);
print("Codigo SW: " + card.SW.toString(16));
print("Get response: "+getrespon);
//resp_2=card.plainApdu(new ByteString("80 C0 00 00 22", HEX))
resp_string=resp_2.toString(HEX);
resp_string_encript_padding=resp_string.substr( 0, 46);
resp_string_mac=resp_string.substr( 50, 8);

//tlv_1="89048CB00000871107";
tlv_1=new ByteString("89048CB00000",HEX);
tlv_2=new ByteString(resp_string_encript_padding, HEX);
//tlv_3="99029000"
//tlv_rellenada=claro.pad(Crypto.ISO9797_METHOD_2, true);
tlv_resp=tlv_1.concat(tlv_2);
print("Valor de TLV resp para calculo mac: "+tlv_resp);
print("Ks: "+Ks);
print("rdnc: "+rdnc);
seq_add=1;
//print("function macdes3(claro, keys, rndc, seq_add)")
met_resp=macdes3(tlv_resp, Ks, rdnc_original,seq_add);
dataencript_resp=met_resp[0];
mac_resp=met_resp[1];
//resp_4=resp_2.subString(0,4);
print("Respuesta tarjeta: "+resp_string);
print("Respuesta tarjeta dataencipted: "+resp_string_encript_padding);
print("Respuesta mac tarjeta: "+resp_string_mac);
print("Respuesta mac terminal: "+mac_resp);
if(resp_string_mac.toString(ASCII)==mac_resp.toString(ASCII))
{
	print(" Successfull MS ")
}
print("");
//print("Codigo SW: " + card.SW.toString(16));
//print("Envios con la mac record " +record);
//resp = card.plainApdu(new ByteString(record, HEX));//Records
//print(resp);
print("Codigo SW: " + card.SW.toString(16));
print();
//Fin de escritura security message
*/

print("EC002 sin necesidad de securMessag");
print("SE SELECCIONA EL FICHERO DE USUARIO EC02");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 02", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC02");
card.plainApdu(new ByteString("80 D0 00 00 "+(ByteString.valueOf(ln_arch,1))+" "+hex_nombre_archivo, HEX));
card.plainApdu(new ByteString("80 D0 00 10 "+(ByteString.valueOf(ln_est,1))+" "+hex_nombre_est, HEX));
card.plainApdu(new ByteString("80 D0 00 20 "+(ByteString.valueOf(ln_mat,1))+" "+hex_nombre_materia, HEX));
card.plainApdu(new ByteString("80 D0 00 30 "+(ByteString.valueOf(ln_cur,1))+" "+hex_curso, HEX));
resp = card.plainApdu(new ByteString("80 B0 00 00 00", HEX));
print(resp);
resp = card.plainApdu(new ByteString("80 B0 01 00 00", HEX));
print(resp);

print()
print("PRESENTACION el ac1 para iniciar: ac1=  AC 11 AC 11 AC 11 AC 11");
ac1= "AC 11 AC 11 AC 11 AC 11";
//pin_cifrado=cripdes3(pin,Ks);
resp = card.plainApdu(new ByteString("80 20 01 00 08 "+ac1, HEX));
print("Codigo SW: " + card.SW.toString(16));
print("");

//print("SE SELECCIONA EL FICHERO DE USUARIO EC03");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 03", HEX));
card.plainApdu(new ByteString("80 D0 00 00 "+(ByteString.valueOf(ln_arch,1))+" "+hex_nombre_archivo, HEX));
card.plainApdu(new ByteString("80 D0 00 10 "+(ByteString.valueOf(ln_est,1))+" "+hex_nombre_est, HEX));
card.plainApdu(new ByteString("80 D0 00 20 "+(ByteString.valueOf(ln_mat,1))+" "+hex_nombre_materia, HEX));
card.plainApdu(new ByteString("80 D0 00 30 "+(ByteString.valueOf(ln_cur,1))+" "+hex_curso, HEX));

print("          CONTENIDO DEL FICHERO DE USUARIO EC03");
resp = card.plainApdu(new ByteString("80 B0 00 00 00", HEX));
print(resp);
resp = card.plainApdu(new ByteString("80 B0 01 00 00", HEX));
print(resp);
resp = card.plainApdu(new ByteString("80 B0 02 00 00", HEX));
print(resp);
resp = card.plainApdu(new ByteString("80 B0 03 00 00", HEX));
print(resp);



print();
print("SE SELECCIONA EL FICHERO DE USUARIO EC04");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 04", HEX));
card.plainApdu(new ByteString("80 D2 00 00 "+(ByteString.valueOf(ln_arch,1))+" "+hex_nombre_archivo, HEX));
card.plainApdu(new ByteString("80 D2 01 00 "+(ByteString.valueOf(ln_est,1))+" "+hex_nombre_est, HEX));
card.plainApdu(new ByteString("80 D2 02 00 "+(ByteString.valueOf(ln_mat,1))+" "+hex_nombre_materia, HEX));
card.plainApdu(new ByteString("80 D2 03 00 "+(ByteString.valueOf(ln_cur,1))+" "+hex_curso, HEX));

print("          CONTENIDO DEL FICHERO DE USUARIO EC04");
for (var i = 0; i < 16; i++) {
			resp = card.sendApdu(0x80, 0xB2, i, 0x00, 0X08);
			print("RECORD " + i.toString(HEX) +":" + "  " + resp + "  " + resp.toString(ASCII));
	}


print("SE SELECCIONA EL FICHERO DE USUARIO EC05");
print();
print("PRESENTACION el pin para iniciar: pin=  30 31 32 33 34 35 36 37");
pin= "30 31 32 33 34 35 36 37";
//pin_cifrado=cripdes3(pin,Ks);
resp = card.plainApdu(new ByteString("80 20 06 00 08 "+pin, HEX));
print("Codigo SW: " + card.SW.toString(16));
print("");

resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 05", HEX));
card.plainApdu(new ByteString("80 D2 00 00 "+(ByteString.valueOf(ln_arch,1))+" "+hex_nombre_archivo, HEX));
card.plainApdu(new ByteString("80 D2 01 00 "+(ByteString.valueOf(ln_est,1))+" "+hex_nombre_est, HEX));
card.plainApdu(new ByteString("80 D2 02 00 "+(ByteString.valueOf(ln_mat,1))+" "+hex_nombre_materia, HEX));
card.plainApdu(new ByteString("80 D2 03 00 "+(ByteString.valueOf(ln_cur,1))+" "+hex_curso, HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC05");
for (var i = 0; i < 16; i++) {
			resp = card.sendApdu(0x80, 0xB2, i, 0x00, 0X10);
			print("RECORD " + i.toString(HEX) +":" + "  " + resp + "  " + resp.toString(ASCII));
	}
//RELLENAR POR EL ALUMNO
print("");


print("SE SELECCIONA EL FICHERO DE USUARIO EC06");
print("PRESENTACION el ac1 para iniciar: ac4=  AC 44 AC 44 AC 44 AC 44");
ac4= "AC44AC44AC44AC44";
ac4=cripdes3(ac4,Ks);
resp = card.plainApdu(new ByteString("80 20 04 00 08 "+ac4, HEX));
print("Codigo SW: " + card.SW.toString(16));
print("");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 06", HEX))
card.plainApdu(new ByteString("80 D2 00 00 "+(ByteString.valueOf(ln_arch,1))+" "+hex_nombre_archivo, HEX));
card.plainApdu(new ByteString("80 D2 01 00 "+(ByteString.valueOf(ln_est,1))+" "+hex_nombre_est, HEX));
card.plainApdu(new ByteString("80 D2 02 00 "+(ByteString.valueOf(ln_mat,1))+" "+hex_nombre_materia, HEX));
card.plainApdu(new ByteString("80 D2 03 00 "+(ByteString.valueOf(ln_cur,1))+" "+hex_curso, HEX));;
print("          CONTENIDO DEL FICHERO DE USUARIO EC06");
for (var i = 0; i < 255; i++) {
			resp = card.sendApdu(0x80, 0xB2, i, 0x00, 0X10);
			print("RECORD " + i.toString(HEX) +":" + "  " + resp + "  " + resp.toString(ASCII));
	}
//RELLENAR POR EL ALUMNO

//print("SE SELECCIONA EL FICHERO DE USUARIO EC07");
print();
print("PRESENTACION el pin para iniciar: pin=  30 31 32 33 34 35 36 37");
pin= "30 31 32 33 34 35 36 37";
//pin_cifrado=cripdes3(pin,Ks);
resp = card.plainApdu(new ByteString("80 20 06 00 08 "+pin, HEX));
card.plainApdu(new ByteString("80 D2 00 00 "+(ByteString.valueOf(ln_arch,1))+" "+hex_nombre_archivo, HEX));
card.plainApdu(new ByteString("80 D2 01 00 "+(ByteString.valueOf(ln_est,1))+" "+hex_nombre_est, HEX));
card.plainApdu(new ByteString("80 D2 02 00 "+(ByteString.valueOf(ln_mat,1))+" "+hex_nombre_materia, HEX));
card.plainApdu(new ByteString("80 D2 03 00 "+(ByteString.valueOf(ln_cur,1))+" "+hex_curso, HEX));
print("Codigo SW: " + card.SW.toString(16));
print("");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 EC 07", HEX));
print("          CONTENIDO DEL FICHERO DE USUARIO EC07");
for (var i = 0; i < 255; i++) {
			resp = card.sendApdu(0x80, 0xB2, i, 0x00, 0X10);
			print("RECORD " + i.toString(HEX) +":" + "  " + resp + "  " + resp.toString(ASCII));
	}

//RELLENAR POR EL ALUMNO

card.close();