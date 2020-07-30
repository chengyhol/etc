let crypto = require('crypto');

module.exports = {
    /**
     * 
     * @param {算法} algorithm 
     * @param {加密密码} password 
     * @param {盐值} salt 
     * @param {要加密的数据} data 
     */
    encrypt(algorithm, password, salt, data) {
        return new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, 24, (err, key) => {
                if (err) console.log("加密出错了");
                // console.log(key)
                const iv = Buffer.alloc(16, 0);
                const cipher = crypto.createCipheriv(algorithm, key, iv);
                let encrypted = "";
                cipher.on('readable', function () {
                    let chunk;
                    while (null !== (chunk = this.read())) {
                        encrypted += chunk.toString('hex');
                    }
                })
                cipher.on('end', () => resolve(encrypted.toString()))
                cipher.on('error', () => reject("出错了"))
                cipher.write(data);
                cipher.end();
            });
        })


    },
    /**
     * 
     * @param {算法} algorithm 
     * @param {密码} password 
     * @param {盐值} salt 
     * @param {要解密的数据} encrypted 
     */
    decrypt(algorithm, password, salt, encrypted) {
        return new Promise((resolve, reject) => {
            crypto.scrypt(password, salt, 24, (err, key) => {
                if (err) console.log(err);
                const iv = Buffer.alloc(16, 0);
                const decipher = crypto.createDecipheriv(algorithm, key, iv);
                let decrypted = "";
                decipher.on('readable', function () {
                    while (null !== (chunk = this.read())) {
                        decrypted += chunk.toString('utf8');
                    }
                })
                decipher.on('end', () => {
                    resolve(decrypted);
                })
                decipher.on('error', () => reject("出错了.."))
                decipher.write(encrypted, 'hex');
                decipher.end();
            })
        })
    }
}