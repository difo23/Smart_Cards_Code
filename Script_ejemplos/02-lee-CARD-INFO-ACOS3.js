/* OBTIENE EL NUMERO DE SERIE DE LA TARJETA
*  SE UTILIZA PARA CREAR CLAVES DIVERSIFICADAS
* 
*
*/

card = new Card();

resp = card.plainApdu(new ByteString("80 14 00 00 08", HEX));
print("          CARD'S UNIQUE SERIAL NUMBER");
print(resp);
print();
print("Código SW: " + card.SW.toString(16));

card.close();