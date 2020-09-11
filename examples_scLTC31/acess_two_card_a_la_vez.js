// SE MUESTRA COMO SE PUEDE CONECTAR CON
// DOS LECTORES E INTERACTUAR CON LOS DOS A LA VEZ
//
card1 = new Card(_scsh3.reader1);
atr = card1.reset(Card.RESET_COLD);
print(atr);
//
card2 = new Card(_scsh3.reader2);
atr = card2.reset(Card.RESET_COLD);
print(atr);
//