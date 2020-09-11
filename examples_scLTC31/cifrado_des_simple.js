//PROGRAMA PARA DEMOSTRAR EL USO DE CIFRADO CON DES
//
// SE INSTANCIA EL SERVICIO DE CRYTO

var crypto = new Crypto();

// SE DEFINEN TRES CLAVES DES DE 8 OCTETOS CADA UNA
// SEGÚN SE USEN PODREMOS CIFRAR CON SIMPLE DES, CON DOBLE DES O CON TRIPLE DES

var key1 = new ByteString("A8A7A6A5A4A3A2A1", HEX);
var key2 = new ByteString("0131D9619DC1376E", HEX);
var key3 = new ByteString("9DC1376E0131D961", HEX);


// ES EL TEXTO EN CLARO QUE QUEREMOS CIFRAR
var plain = new ByteString("576F6C6667616E67", HEX);

// SE SACA A LA PANTALLA PARA VERLO
print();
print();
print("Texto en claro:           "+ plain);

// SE CREAN TRES CLAVES DES: UNA SIMPLE DES UNA DOBLE DES Y UNA TRIPLE DES
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

// SE VA A CIFRAR EL TEXTO plain CON LA CLAVE deskey1
// SE CIFRA CON MODO ECB
//
result = crypto.encrypt(deskey1, Crypto.DES_ECB, plain);
//
print("Cifrado con simple DES:   " + "  " + result);
// SE DESCIFRA CON LA MISMA CLAVE
//
result2 = crypto.decrypt(deskey1, Crypto.DES_ECB, result);
//
print("Descifrado con simple DES:" + "  " + result2);
print();