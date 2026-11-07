export const platforms = {
  gmail: { name: 'Gmail', domains: ['gmail.com', 'googlemail.com'], note: 'Dot variations and +tags work with personal Gmail accounts. Google Workspace addresses do not ignore dots.' },
  outlook: { name: 'Outlook / Hotmail', domains: ['outlook.com', 'hotmail.com', 'live.com', 'msn.com'], note: 'Uses +tags. Receiving is supported on consumer Outlook.com accounts; some websites reject + addresses.' },
  proton: { name: 'Proton Mail', domains: ['proton.me', 'protonmail.com', 'pm.me', 'protonmail.ch'], note: 'Uses +tags with your existing Proton Mail address. Your plan must support the address you enter.' },
  icloud: { name: 'iCloud Mail', domains: ['icloud.com', 'me.com', 'mac.com'], note: 'Uses +tags with your existing iCloud mailbox. These are not Hide My Email addresses.' },
  fastmail: { name: 'Fastmail', domains: ['fastmail.com', 'fastmail.fm'], note: 'Uses +tags. For a custom Fastmail domain, choose Custom domain and confirm subaddressing is enabled.' },
  custom: { name: 'Custom domain (+ addressing)', domains: [] as string[], note: 'Only use this with a mailbox that already supports + addressing. Check with your mail administrator first.' },
}
export type Platform = keyof typeof platforms
export type Method = 'plus' | 'dots' | 'combined'
export function generateAliases(email: string, platform: Platform, method: Method, count: number, prefix: string) {
  const address = email.trim().toLowerCase()
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}$/.test(address)) throw new Error('Enter a valid email address, such as alex@gmail.com.')
  if (!Number.isInteger(count) || count < 1 || count > 50000) throw new Error('Choose a whole number between 1 and 50,000.')
  const [raw, domain] = address.split('@')
  if (domain.split('.').some(label => !/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label))) throw new Error('Enter a valid email domain.')
  if (raw.startsWith('.') || raw.endsWith('.') || raw.includes('..') || raw.length > 64 || address.length > 254) throw new Error('Check your email address for invalid dots or length.')
  const allowed: readonly string[] = platforms[platform].domains
  if (allowed.length && !allowed.includes(domain)) throw new Error(`Choose the platform that matches @${domain}, or select Custom domain.`)
  if (!/^[a-z0-9_-]{1,20}$/i.test(prefix)) throw new Error('Use 1–20 letters, numbers, hyphens, or underscores for the tag prefix.')
  const base = raw.split('+')[0]
  const local = platform === 'gmail' ? base.replaceAll('.', '') : base
  if (!local) throw new Error('Enter the mailbox name before the @ symbol.')
  if (platform === 'gmail' && !/^[a-z0-9]+$/.test(local)) throw new Error('Personal Gmail mailbox names contain only letters, numbers, and dots.')
  const dotCount = Math.min(50000, 2 ** Math.min(local.length - 1, 16) - 1)
  if (method === 'dots' && platform === 'gmail' && count > dotCount) throw new Error(`This address supports ${dotCount.toLocaleString()} unique dotted variations. Reduce the quantity or use + tags.`)
  function dotted(mask: number) {
    return [...local].map((char, i) => char + (i < local.length - 1 && i < 16 && (mask & (1 << i)) ? '.' : '')).join('')
  }
  return Array.from({ length: count }, (_, index) => {
    const tag = `+${prefix}${String(index + 1).padStart(5, '0')}`
    const name = platform === 'gmail' && method !== 'plus' ? dotted(method === 'dots' ? index + 1 : index % (dotCount + 1)) : local
    const result = `${name}${platform === 'gmail' && method === 'dots' ? '' : tag}@${domain}`
    if (result.split('@')[0].length > 64 || result.length > 254) throw new Error('The resulting alias is too long. Use a shorter email address or tag prefix.')
    return result
  })
}
