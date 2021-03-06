/*
Se trata de recargar con crédito la Account de la ACOS3.


Vamos a recargar la cuenta monetaria de la ACOS3. La instrucción es CREDIT. 
Tiene su correspondiente APDU. Hay que cargarla usando la instruccion de carga 
no escribiendo directamente en los records del fichero Account File, pues se trata
de simular la carga que se efectuaría a un usuario por el método de carga con la 
intrucción de carga habitual.

Es conveniente ejecutar primero el script de clase: 09-pide-INQUIRE-ACCOUNT-ACOS3.js;
para ver si le cabe la recarga a la tarjeta. De todas formas, si no le cabe la recarga, 
la cuenta indicará un error que hay que intepretar segun las tablas del manual.

En el script que realice el CREDIT incluir delante el script INQUIRE ACCOUNT y extraer
de su respuesta el parámetro ATREF u otros si hiciera falta. No se admite ir a leer directamente
al fichero de la cuenta (FF=05H), pues en un uso normal de la tarjeta eso no se permitiría.

Recordar que a la hora de enviar el ATREF (Contador de transacciones) hay que incrementarlo
en una unidad respecto al que nos indique con el INQUIRE ACCOUNT, pues la larjeta lo espera 
incrementado en una unidad. Si no se hace así no validará el CREDIT.

Vamos a cargar la cuenta con 20 euros.
No hace falta usar Secure Messaging.
No hace falta que pida PIN.

Subir al servidor web el script que realiza el CREDIT de la Account.*/


/* SOLICITA INQUIRE ACCOUNT

*/
//atr = card.reset(Card.RESET_COLD);
//print(atr);
card = new Card();
var crypto = new Crypto();

print("");
// Instantiate crypto service
//var crypto = new Crypto();
//---------------------------------------------------------------------------------
// Define las claves DES. PARA LA ACCOUNT.  L izquierda, R derecha
var KDR  = new ByteString("DADADADADADADADA", HEX);
var KCR  = new ByteString("DBDBDBDBDBDBDBDB", HEX);
var KCFR = new ByteString("DCDCDCDCDCDCDCDC", HEX);
var KRDR = new ByteString("DDDDDDDDDDDDDDDD", HEX);
var KDL  = new ByteString("DADADADADADADADA", HEX);
var KCL  = new ByteString("DBDBDBDBDBDBDBDB", HEX);
var KCFL = new ByteString("DCDCDCDCDCDCDCDC", HEX);
var KRDL = new ByteString("DDDDDDDDDDDDDDDD", HEX);

// SE CREAN LOS OBJETOS DE CLAVES DOBLES PARA EL CIFRADO CON 3DES
var desKD = new Key(); //DEBIT Key number: 00
desKD.setComponent(Key.DES, KDL.concat(KDR));

var desKC = new Key(); //CREDIT Key number: 01
desKC.setComponent(Key.DES, KCL.concat(KCR));

var desKCF = new Key(); //CERTIFY Key Number: 02 
desKCF.setComponent(Key.DES, KCFL.concat(KCFR));
//desKCF.setComponent(Key.DES, KCFL);

var desKRD = new Key(); //REVOKE  Key Number 03
desKRD.setComponent(Key.DES, KRDL.concat(KRDR));

print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
resp = card.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
print("C�digo SW: " + card.SW.toString(16));

reference = crypto.generateRandom(4);

//print("PRESENTACION del ac2 para iniciar: ac2= AC 22 AC 22 AC 22 AC 22");
//refence,transtype, balance,atref,0000
//rt = reference+" 00 "+"00 10 10"+"00 00 00 00 "+"00 00 00 00"
//print("ACS: "+rt)
//check= "AC22AC22AC22AC2";
//ac2_cifrado=cripdes3(ac2,Ks);
//resp = card.plainApdu(new ByteString("80 20 07 00 08 "+rt, HEX));
//print("Codigo SW: " + card.SW.toString(16));
//print("");

print("");
print("SE SELECCIONA EL FICHERO ACCOUNT FILE FF05");
resp = card.plainApdu(new ByteString("80 A4 00 00 02 FF 05", HEX));
print("Codigo SW: " + card.SW.toString(16));
//print("          FILE FF05");
//print("SE SOLICITA INQUIRE ACCOUNT");
//reference = new ByteString("0A020304", HEX);

reference = crypto.generateRandom(4); 
clains = new ByteString("80 E4 02 00 04", HEX); //EL 02 ES EL kEY NUMBER
apdu = clains.concat(reference);
print("Apdu: "+apdu)

//print("C�digo SW: " + card.SW.toString(16));
//reference son 4 bytes que envia el  terminal a la tarjeta para los meta en el calculo del MAC
//ATENCION QUE ESTE reference VA EN LA SIGUIENTE plainApdu
//------------------------------------------------------------
// SE UTILIZA LA CLAVE 02, QUE ES LA DE CERTIFY
//resp = card.sendApdu(0x80,0xE4,0x02,0x00,0x04,0x0A,0x02, 0x03 04));
get_resp="80 C0 00 00 16"
get_resp = new ByteString(get_resp, HEX);
print("get_resp: "+get_resp)

resp = card.plainApdu(apdu);
print("C�digo SW: " + card.SW.toString(16));
print(" "+resp);

resp_2 = card.plainApdu(get_resp);
print("C�digo SW: " + card.SW.toString(16));
print(" "+resp_2);
print("          RESPUESTA A INQUIRE ACCOUNT:");
//sE SOLICITA UN GET RESPONSE
//resp = card.plainApdu(new ByteString(get_resp, HEX));
///print(resp);
//print("C�digo SW: " + card.SW.toString(16))
//print("          RESPUESTA A INQUIRE ACCOUNT:");
//print(resp);
//print("C�digo SW: " + card.SW.toString(16));
//
//------------------------------------------------
// SEPARAMOS LOS CAMPOS:
mact = resp.bytes(0,4);
print("Mac tarjeta:" + "  " + mact);
transtype = resp.bytes(4, 1);
print("Tipo de transacci�n:" + "  " + transtype + "        DONDE 01 DEBIT, 02 REVOKE DEBIT, 03 CREDIT");
balance = resp.bytes(5, 3);
print("Balance:  " + balance + "   En centimos de euros:  " + balance.toUnsigned());
atref = resp.bytes(8, 6);
print("Account Transaction Reference: " + atref);
maxbal = resp.bytes(14, 3);
print("Balance m�ximo:  " + maxbal + "          En euros:  " + maxbal.toUnsigned()/100);
ttrefc = resp.bytes(17, 4);
print("Terminal Transaction Reference Credit: " + ttrefc);
ttrefd = resp.bytes(21, 4);
print("Terminal Transaction Reference Debit:  " + ttrefd);
//-----------------------------------------------------
//calcularemos el MAC y lo compararemos con el que nos ha entregado al tarjeta
nul = new ByteString("0000", HEX);
paramac1 = resp.bytes(4, 10);
//print(paramac1);
paramac = reference.concat(paramac1.concat(nul));
//print(paramac);
//PARA EL MAC UTILIZA UN VECTOR DE INICIALIZACION NULO
iv = new ByteString("00 00 00 00 00 00 00 00", HEX);
//CALCULAMOS EL MAC CON LA CLAVE 02 CERTIFY KEY
//maccal2=crypto.descrypt(desKCF, Crypto.DES_CBC, paramac, iv);
maccal = crypto.encrypt(desKCF, Crypto.DES_CBC, paramac, iv);
print("Mac completo:  " + maccal);
//
//-------------------------------------------------------------
// 	se toman los 4 bytes mas significativos del �ltimo octeto
octr = maccal.right(8);
print("Octeto de m�s a la derecha:          " + "  " + octr);
// SE EXTRAEN LOS 4 BYTES MAS A LA IZQUERDA DE ESTE OCTETO (MAS SIGNIFICATIVOS)
// PORQUE EL MAC SON LOS 4 BYTES MAS SIGNIFICATIVOS
MAC = octr.left(4);

maccal2=crypto.decrypt(desKCF, Crypto.DES_CBC, maccal, iv);
desoctr = maccal2.right(8);
print("Octeto de m�s a la derecha:          " + "  " + octr);
// SE EXTRAEN LOS 4 BYTES MAS A LA IZQUERDA DE ESTE OCTETO (MAS SIGNIFICATIVOS)
// PORQUE EL MAC SON LOS 4 BYTES MAS SIGNIFICATIVOS
desMAC = desoctr.left(4)

print("Esto es el MAC calculado con DES_CBC        :" + "  " + MAC);
print("Debe coincidir con el enviado por la tarjeta:" + "  " + mact);
print();
//-----------------------------------------------------------------
// se comprueba que ambos mac coinciden: el calculado y el que ha venido
// de la respuesta de la tarjeta
// 
if (MAC.equals(mact)){
        print("****--------------------------------------------------****");
        print("****  MAC ID�NTICOS, VALORES CORRECTOS                ****");
        print("****--------------------------------------------------****");
        print();
} else {
	print("NO COINCIDEN LOS MAC: FIN DE TODO");
}
print();



function macdes3(claro, keys) 
{
	var crypto = new Crypto();
	//nul = new ByteString("0000", HEX);
	iv = new ByteString("00 00 00 00 00 00 00 00", HEX);
	// Define 3 different single DES key values
	//keys = new ByteString(keys, HEX);
	claro = new ByteString(claro, HEX);
	//tlv_rellenada=claro.pad(Crypto.ISO9797_METHOD_2, true);
	//rndc = new ByteString(rndc, HEX);
	//var cal = new ByteString("00 00 00 00 00 00 FF FF", HEX);
	//vi = rndc.and(cal);
	//seq=vi.add(seq_add);
	//print("vi dentro de encrip "+vi)
    //print("seq dentro de encrip "+seq)
   // print("tlv_rellenada "+tlv_rellenada)
	//Create one TRIPLE DES key.
	//var des3key = new Key();
	//des3key.setComponent(Key.DES, keys);
	// Trible DES ECB encrypt
	cifrado = crypto.encrypt(keys, Crypto.DES_CBC, claro,iv);
	//print("mac dentro de encrip "+cifrado)
	mac8 = cifrado.right(8);
	//print("mac8 dentro de encrip "+mac8)
	mac4=mac8.left(4);
	//print("mac4 dentro de encrip "+mac4)
	return [cifrado, mac4];
	
}

print(" Envio de CREDIT!");
mount=ByteString.valueOf(2000, 3);
print("Amount: "+mount);
send_credit=MAC+":"+mount+":"+ttrefd
print("ttrefd: "+ttrefd)
//send_credit=MAC+":"+ttrefd.add(1)+":"+mount
//send_credit=desMAC+" "+mount+" "+ttrefd.add(1)
print("Send_credit: "+send_credit);

mac_new=new ByteString("E2"+mount+ttrefc+atref.add(1)+"00 00",HEX);
//11 bytes
print("new mac cal: "+mac_new);
mac_new=macdes3(mac_new, desKC)
print("new mac cal: "+mac_new[1]);
send_credit=mac_new[1]+" "+mount+" "+ttrefc
print("ttrefd: "+ttrefc)
//send_credit=MAC+":"+ttrefd.add(1)+":"+mount
//send_credit=desMAC+" "+mount+" "+ttrefd.add(1)
print("Send_credit: "+send_credit);
resp = card.plainApdu(new ByteString("80 E2 00 00 0B "+send_credit, HEX));
print("Codigo SW: " + card.SW.toString(16));

card.close();