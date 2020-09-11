/* SOLICITA INQUIRE ACCOUNT

*/

card = new Card();
//atr = card.reset(Card.RESET_COLD);
//print(atr);
print("");
// Instantiate crypto service
var crypto = new Crypto();
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

var desKRD = new Key(); //REVOKE  Key Number 03
desKRD.setComponent(Key.DES, KRDL.concat(KRDR));

//print("PRESENTACION del IC para iniciar: ACOSTEST= 41434F53 54455354");
//resp = card.plainApdu(new ByteString("80 20 07 00 08 41 43 4F 53 54 45 53 54", HEX));
//print("Código SW: " + card.SW.toString(16));
print("");

//print("SE SOLICITA INQUIRE ACCOUNT");
//reference = new ByteString("0A020304", HEX);
reference = crypto.generateRandom(4); 
clains = new ByteString("80 E4 02 00 04", HEX); //EL 02 ES EL kEY NUMBER
apdu = clains.concat(reference);
//reference son 4 bytes que envia el  terminal a la tarjeta para los meta en el calculo del MAC
//ATENCION QUE ESTE reference VA EN LA SIGUIENTE plainApdu
//------------------------------------------------------------
// SE UTILIZA LA CLAVE 02, QUE ES LA DE CERTIFY
//resp = card.plainApdu(new ByteString("80 E4 02 00 04 0A 02 03 04", HEX));
resp = card.plainApdu(apdu);
print("          RESPUESTA A INQUIRE ACCOUNT:");
print(resp);
print("Código SW: " + card.SW.toString(16));
//sE SOLICITA UN GET RESPONSE
//resp = card.plainApdu(new ByteString("80 C0 00 00 19", HEX));
//print("          RESPUESTA A INQUIRE ACCOUNT:");
//print(resp);
//print("Código SW: " + card.SW.toString(16));
//
//------------------------------------------------
// SEPARAMOS LOS CAMPOS:
mact = resp.bytes(0,4);
print("Mac tarjeta:" + "  " + mact);
transtype = resp.bytes(4, 1);
print("Tipo de transacción:" + "  " + transtype + "        DONDE 01 DEBIT, 02 REVOKE DEBIT, 03 CREDIT");
balance = resp.bytes(5, 3);
print("Balance:  " + balance + "   En centimos de euros:  " + balance.toUnsigned());
atref = resp.bytes(8, 6);
print("Account Transaction Reference: " + atref);
maxbal = resp.bytes(14, 3);
print("Balance máximo:  " + maxbal + "          En euros:  " + maxbal.toUnsigned()/100);
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
maccal = crypto.encrypt(desKCF, Crypto.DES_CBC, paramac, iv);
print("Mac completo:  " + maccal);
//
//-------------------------------------------------------------
// 	se toman los 4 bytes mas significativos del último octeto
octr = maccal.right(8);
print("Octeto de más a la derecha:          " + "  " + octr);
// SE EXTRAEN LOS 4 BYTES MAS A LA IZQUERDA DE ESTE OCTETO (MAS SIGNIFICATIVOS)
// PORQUE EL MAC SON LOS 4 BYTES MAS SIGNIFICATIVOS
MAC = octr.left(4);
print("Esto es el MAC calculado con DES_CBC        :" + "  " + MAC);
print("Debe coincidir con el enviado por la tarjeta:" + "  " + mact);
print();
//-----------------------------------------------------------------
// se comprueba que ambos mac coinciden: el calculado y el que ha venido
// de la respuesta de la tarjeta
// 
if (MAC.equals(mact)){
        print("****--------------------------------------------------****");
        print("****  MAC IDÉNTICOS, VALORES CORRECTOS                ****");
        print("****--------------------------------------------------****");
        print();
} else {
	print("NO COINCIDEN LOS MAC: FIN DE TODO");
}

card.close();