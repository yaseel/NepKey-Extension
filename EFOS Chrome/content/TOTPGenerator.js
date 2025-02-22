export async function generateTOTP(base32Secret, step = 30, digits = 6) {
    const keyData = base32ToUint8Array(base32Secret);
    const epoch = Math.floor(Date.now() / 1000);
    let counter = Math.floor(epoch / step);
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    for (let i = 7; i >= 0; i--) {
        counterView.setUint8(i, counter & 0xff);
        counter = counter >> 8;
    }
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-1" },
        false,
        ["sign"]
    );
    const hmacBuffer = await crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);
    const hmac = new Uint8Array(hmacBuffer);
    const offset = hmac[hmac.length - 1] & 0x0f;
    const binary =
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff);
    const otp = binary % Math.pow(10, digits);
    return otp.toString().padStart(digits, "0");
}

function base32ToUint8Array(base32) {
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    base32 = base32.replace(/=+$/, "").replace(/\s+/g, "");
    let bits = "";
    for (let i = 0; i < base32.length; i++) {
        const char = base32.charAt(i).toUpperCase();
        const val = base32chars.indexOf(char);
        if (val === -1) {
            console.warn(`Skipping invalid Base32 character: ${char}`);
            continue;
        }
        bits += val.toString(2).padStart(5, "0");
    }
    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        const byte = bits.substring(i, i + 8);
        bytes.push(parseInt(byte, 2));
    }
    return new Uint8Array(bytes);
}
