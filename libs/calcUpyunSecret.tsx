import crypto from 'crypto'

// 计算 MD5
export function getMD5(value: string) {
  const stringValue = String(value)
  return crypto.createHash('md5').update(stringValue).digest('hex')
}

// 计算 HmacSHA1
export function getHmacsha1(secret: string, value: string) {
  return crypto.createHmac('sha1', secret).update(value, 'utf8').digest().toString('base64')
}

export function sign(key: string, secret: any, method: string, uri: string, date: string, policy: string | null = null, md5: string | null = null) {
  const elems: any = []
  ;[method, uri, date, policy, md5].forEach((item) => {
    if (item != null) {
      elems.push(item)
    }
  })
  let value = elems.join('&')
  let auth = getHmacsha1(secret, value)
  return `UPYUN ${key}:${auth}`
}
