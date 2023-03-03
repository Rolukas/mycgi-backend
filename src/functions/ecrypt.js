var CryptoJS = require('crypto-js');

const encryptor = (string) => {
    const key = CryptoJS.enc.Utf8.parse('AMINHAKEYTEM32NYTES1234567891234');
    const iv = CryptoJS.enc.Utf8.parse('7061737323313233');

    const encryptedString = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(string), "jascope!", key,
        {
            keySize: 128,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        }).toString();

    return encryptedString;

};

const decryptor = (string) => {
    var bytes  = CryptoJS.AES.decrypt(string.toString(), "jascope!");
    var desencryptedString = bytes.toString(CryptoJS.enc.Utf8);
   
    return desencryptedString;
}

module.exports = {
    encryptor,
    decryptor
}