// FORMA DE LLAMAR A OTRO SCRIPT
// EN ESTE CASO EN EL OTRO SCRIPT HAY UNA FUNCION
//
load("crc16-desfire.js");
//
var data = new ByteString("000102030405060708090a0b0c0d0e0f", HEX);
//
// SE LLAMA A LA FUNCIÓN calculacrc16
// RECIBE COMO PARÁMETRO UN BYTESTRING QUE ES EL MENSAJE
// AL QUE SE VA A CALCULAR EL CRC
crccalculado = calculacrc16(data);
print();
print("Mensaje:      " + data);
print("Crccalculado: " + crccalculado);
print();