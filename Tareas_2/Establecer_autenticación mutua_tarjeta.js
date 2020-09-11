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
print("");

card.close();