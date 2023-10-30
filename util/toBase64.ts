export const toBase64 = (obj: object) => Buffer.from(JSON.stringify(obj)).toString('base64')
