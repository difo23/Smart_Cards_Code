//PROGRAMA PARA DEMOSTRAR EL USO DE CIFRADO CON DOBLE DES
//
// Instantiado del servicio crypto
var crypto = new Crypto();
// Define 3 different single DES key values
var key1 = new ByteString("7CA110454A1A6E57", HEX);
var key2 = new ByteString("0131D9619DC1376E", HEX);
var key3 = new ByteString("9DC1376E0131D961", HEX);
//
var plain = new ByteString("01A1D6D039776742", HEX);
print();
print("Texto en claro:          " + "  " + plain);
//
// Create three single DES keys, a double DES key and a triple DES key
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

// EN EL CIFRADO CON DOBLE DES:
// SE CIFRA CON LA PRIMERA CLAVE. SE DESCIFRA CON LA SEGUNDA Y
// SE CIFRA CON LA PRIMERA DE NUEVO
// SE PODRIA IMPLEMENTAR EN TRES ETAPAS ASI:
//cipher = plain;
//cipher = crypto.encrypt(deskey1, Crypto.DES_ECB, cipher);
//cipher = crypto.decrypt(deskey2, Crypto.DES_ECB, cipher);
//cipher = crypto.encrypt(deskey1, Crypto.DES_ECB, cipher);
//
// LO IMPLENTAMOS EN UNA SOLA ETAPA:
result = crypto.encrypt(des2key, Crypto.DES_ECB, plain);
//
print("Cifrado con  DOBLE DES:  " + "  " + result);
//
// Double DES ECB decrypt
result = crypto.decrypt(des2key, Crypto.DES_ECB, cipher);
//
//
print("Descifrado con DOBLE DES:" + "  " + result);
print();
print();