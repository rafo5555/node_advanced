const Keygrip = require('keygrip');
const keys = require('../../config/keys');
const keygrip = new Keygrip([keys.cookieKey]);
const Buffer = require('safe-buffer').Buffer;

module.exports = (user) => {
    console.error('entered')
    const sessionObj = {
        passport: {
            user: user._id.toString()
        }
    };
    const session = Buffer.from(JSON.stringify(sessionObj)).toString('base64');
    const sig = keygrip.sign('session=' + session);
    return {session, sig}
};