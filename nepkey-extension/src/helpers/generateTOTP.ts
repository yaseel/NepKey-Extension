
interface TOTPOptions {
    step?: number;          // seconds per code window
    digits?: number;        // length of code
    algorithm?: 'SHA-1' | 'SHA-256' | 'SHA-512';
    epochMs?: number;       // override current time (ms)
}

export async function generateTOTP(
    base32Secret: string,
    {
        step = 30,
        digits = 6,
        algorithm = 'SHA-1',
        epochMs = Date.now(),
    }: TOTPOptions = {}
): Promise<string> {
    const keyData = base32ToUint8Array(base32Secret);
    const counter = Math.floor(epochMs / 1000 / step);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: algorithm },
        false,
        ['sign']
    );

    const counterBuffer = counterToBuffer(counter);
    const hmacBuffer = await crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
    const code = dynamicTruncate(new Uint8Array(hmacBuffer)) % 10 ** digits;
    return code.toString().padStart(digits, '0');
}

function base32ToUint8Array(base32: string): Uint8Array {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const cleaned = base32.replace(/=+$/g, '').replace(/\s+/g, '').toUpperCase();

    let bits = '';
    for (const ch of cleaned) {
        const val = alphabet.indexOf(ch);
        if (val === -1) continue; // skip junk silently; throw if you prefer
        bits += val.toString(2).padStart(5, '0');
    }

    const bytes: number[] = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return new Uint8Array(bytes);
}

function counterToBuffer(counter: number): ArrayBuffer {
    const buf = new ArrayBuffer(8);
    const view = new DataView(buf);
    // write big-endian
    for (let i = 7; i >= 0; i--) {
        view.setUint8(i, counter & 0xff);
        counter >>= 8;
    }
    return buf;
}

function dynamicTruncate(hmac: Uint8Array): number {
    const offset = hmac[hmac.length - 1] & 0x0f;
    return (
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff)
    );
}
