let crypto = require("crypto");

function generateToken(userid, tokenSalt) {
    setTimeout(() => {
        let hmac = crypto.createHmac('sha256', '蜜月');


        hmac.on('readable', {high},() => {
            const data = hmac.read();
            if (data) {
                console.log(data.toString('hex'));
                // 打印:
                //   d0b5490ab4beb8e6545fe284f484d0d595e46086cb8e6ef2291af12ac684102f
            }
        });
        hmac.write('要创建哈希的数据');
        hmac.end();
    }, 0);
}

console.log(generateToken("wefhniow4f32s1f8wef", "cyh197922"));
console.log("end")
