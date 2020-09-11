//PROGRAMA PARA DEMOSTRAR EL USO DE CIFRADO CON DOBLE DES
//
var crypto = new Crypto();
//
// Define 3 different single DES key values
var key1 = new ByteString("7CA110454A1A6E57", HEX);
var key2 = new ByteString("0131D9619DC1376E", HEX);
var key3 = new ByteString("9DC1376E0131D961", HEX);
//
var plain = new ByteString("01A1D6D039776742", HEX);
print();
//print("Texto en claro:" + "  " + plain);
// Create three single DES keys, a double DES key and a triple DES key
var deskey1 = new Key();
deskey1.setComponent(Key.DES, key1);
print("Primera clave:" + "  " + deskey1.getComponent(Key.DES).toString(HEX));
var deskey2 = new Key();
deskey2.setComponent(Key.DES, key2);
print("Segunda clave:                " + "  " + deskey2.getComponent(Key.DES).toString(HEX));
var deskey3 = new Key();
deskey3.setComponent(Key.DES, key3);
print("Tercera clave:                                " + "  " + deskey3.getComponent(Key.DES).toString(HEX));
var des2key = new Key();
des2key.setComponent(Key.DES, key1.concat(key2));
print("Clave doble:  " + "  " + des2key.getComponent(Key.DES).toString(HEX));
var des3key = new Key();
des3key.setComponent(Key.DES, key1.concat(key2).concat(key3));
print("Clave triple: " + "  " + des3key.getComponent(Key.DES).toString(HEX));
print();
// EN EL CIFRADO CON TRIPLE DES:
// SE CIFRA CON LA PRIMERA CLAVE. SE DESCIFRA CON LA SEGUNDA Y
// SE CIFRA CON OTRA TERCERA DE NUEVO
// SE PODRIA IMPLEMENTAR EN TRES ETAPAS ASI:
// Triple DES ECB encrypt
//cipher = plain;
//cipher = crypto.encrypt(deskey1, Crypto.DES_ECB, cipher);
//cipher = crypto.decrypt(deskey2, Crypto.DES_ECB, cipher);
//cipher = crypto.encrypt(deskey3, Crypto.DES_ECB, cipher);
//
print("Texto en claro:           " + "  " + plain);
result = crypto.encrypt(des3key, Crypto.DES_ECB, plain);
//
print("Cifrado con TRIPLE DES:   " + "  " + result);
//
// DESCIFRADO CON TRIPLE DES ECB
result = crypto.decrypt(des3key, Crypto.DES_ECB, result);
//
print("Descifrado con TRIPLE DES:" + "  " + result);
print("Descifrado con TRIPLE DES:" + "  " + result.toString(HEX));

