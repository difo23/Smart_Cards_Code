/* SACA EL MAPA DE MEMORIA
*  CON sendApdu 
*  
*/
//
card = new Card();
atr = card.reset(Cardr
		.RESET_COLD);
print(atr);
//NUMERO DE BYTES A LEER DE LA MEMORIA

//NBYTES = 0x00;
NBYTES = 256;
//TAMBIEN FUNCIONA CON:
//NBYTES = 256;
//SE ENVIA A LA TARJETA
resp = card.sendApdu(0x00, 0xB0, 0x00, 0x00, NBYTES);
print(resp);
print("Código SW: " + card.SW.toString(16));