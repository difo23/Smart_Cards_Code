
//secure Messagine
nb=10;
p3=ByteString.valueOf(nb, 1)
print(""+p3);
//calculando MAC
tlv=new ByteString("89 04 8C B0 20 00 97 01 "+p3, HEX);
// Single DES CBC encrypt
//var rndc = new ByteString("59D9839733B8455D", HEX);
//var keys= new ByteString("59D9839733B8455D59D9839733B8455D", HEX);
seq_add=0
var mac=macdes3(tlv, keys, rndc,seq_add) 


/*v = plain.bytes(0, 8);
v = v.xor(iv);
v = crypto.encrypt(deskey1, Crypto.DES_ECB, v);
cipher = v;

v = plain.bytes(8, 8);
v = cipher.xor(v);
v = crypto.encrypt(deskey1, Crypto.DES_ECB, v);
cipher = cipher.concat(v);

result = crypto.encrypt(deskey1, Crypto.DES_CBC, plain, iv);
assert(result.equals(cipher));


// Single DES CBC decrypt
result = crypto.decrypt(deskey1, Crypto.DES_CBC, cipher, iv);
assert(result.equals(plain));
*/
//Instantiate crypto service
function macdes3(claro, keys, rndc, seq_add) 
{
	var crypto = new Crypto();
	// Define 3 different single DES key values
	keys = new ByteString(key, HEX);
	claro = new ByteString(claro, HEX);
	tlv_rellenada=claro.pad(Crypto.ISO9797_METHOD_2, true);
	rndc = new ByteString(rndc, HEX);
	var cal = new ByteString("00 00 00 00 00 00 FF FF", HEX);
	vi = rndc.and(cal);
	seq=vi.add(seq_add);
	print("vi dentro de encrip "+vi)
    print("seq dentro de encrip "+seq)
	// Create one TRIPLE DES key.
	var des3key = new Key();
	des3key.setComponent(Key.DES, key);
	// Trible DES ECB encrypt
	cifrado = crypto.encrypt(des3key, Crypto.DES_CBC, tlv_rellenada,seq);
	print("mac dentro de encrip "+cifrado)
	mac8 = cifrado.right(8);
	print("mac8 dentro de encrip "+mac8)
	mac4=mac8.left(4);
	print("mac4 dentro de encrip "+mac4)
	return mac4;
	
}

/*function descripdes3(cifrado, key) 
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
*/
binario="8C B0 00 00 09 97 01 09 8E 04 "+mac;//binario
record ="8C B2 00 00 09 97 01 09 8E 04 "+mac;//Records