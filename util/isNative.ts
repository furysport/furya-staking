export const isNativeToken = (token?: string): boolean => (token ? token.startsWith('u') || token.includes('factory' || 'ibc') : false)
