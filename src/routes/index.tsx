import { createFileRoute } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { ArrowDownToLine, ArrowRight, Check, ChevronDown, Copy, CornerDownRight, Layers3, LockKeyhole, Mail, Plus, ShieldCheck, Sparkles, X } from 'lucide-react'
import { generateAliases, platforms, type Platform, type Method } from '@/lib/aliases'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [platform, setPlatform] = useState<Platform>('gmail')
  const [email, setEmail] = useState('')
  const [quantity, setQuantity] = useState('100')
  const [method, setMethod] = useState<Method>('plus')
  const [prefix, setPrefix] = useState('alias')
  const [aliases, setAliases] = useState<string[]>([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [page, setPage] = useState(0)
  const [faq, setFaq] = useState<number | null>(0)
  const [advanced, setAdvanced] = useState(false)
  const [copied, setCopied] = useState(false)
  function reset() { setAliases([]); setError(''); setNotice(''); setCopied(false); setPage(0) }
  async function generate(event: FormEvent) {
    event.preventDefault(); setError(''); setNotice(''); setBusy(true); setCopied(false)
    await new Promise(resolve => setTimeout(resolve, 180))
    try { setAliases(generateAliases(email, platform, method, Number(quantity), prefix)); setPage(0) }
    catch (err) { setError(err instanceof Error ? err.message : 'Unable to generate aliases.'); setAliases([]) }
    finally { setBusy(false) }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(aliases.join('\n')); setCopied(true); setNotice('All aliases copied to your clipboard.') }
    catch { setNotice('Clipboard access is unavailable. Download the text file instead.') }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([aliases.join('\n') + '\n'], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a'); link.href = url; link.download = `aliaskit-${platform}-${aliases.length}.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('Your text file is ready to download.')
  }
  const questions = [
    ['Do these aliases go to my existing inbox?', 'Yes, when your provider supports the selected addressing method. These are variations of your existing address, not new accounts or separate inboxes. You must already own the base mailbox.'],
    ['Which email platforms are supported?', 'Gmail supports dot variations and plus tags. Outlook / Hotmail, Proton Mail, iCloud Mail, and Fastmail support plus tags. Custom domains work only when your provider has enabled plus addressing. Yahoo disposable addresses require setup with Yahoo and cannot be generated here.'],
    ['Can I really generate 50,000 aliases?', 'Yes, with plus tags you can generate up to 50,000 unique addresses per batch. Gmail dot-only variations depend on the length of your mailbox name, so shorter names have fewer combinations.'],
    ['Is my email address stored anywhere?', 'No. Generation, copying, and text-file creation happen in your browser. AliasKit does not save or send the address or generated list to a server.'],
  ]
  return <div className="site-shell">
    <header className="header"><a className="brand" href="/" aria-label="AliasKit home"><span className="brand-icon"><Layers3 size={21}/></span>AliasKit<span className="brand-dot">.</span></a><nav><a href="#generator">Generator</a><a href="#how-it-works">How it works</a><a href="#faq">FAQs</a></nav><span className="header-note"><LockKeyhole size={13}/> Private by design</span></header>
    <main>
      <section className="intro"><div className="eyebrow"><span/> ONE INBOX. ENDLESS POSSIBILITIES.</div><h1>Your email, <span>with a twist.</span></h1><div className="intro-bottom"><p>Create email aliases in seconds. Keep your inbox organized,<br className="desktop-break"/> your sign-ups separate, and your real address simple.</p><div className="privacy-chip"><ShieldCheck size={18}/><span>100% in your browser<br/><strong>No sign-up. No data stored.</strong></span></div></div></section>
      <section className="workspace" id="generator" aria-label="Email alias generator">
        <div className="config"><div className="panel-heading"><span className="step">01</span><h2>Make it yours</h2><Mail size={19}/></div>
          <form onSubmit={generate}>
            <label htmlFor="platform">Email platform</label><div className="select-wrap"><span className={`provider-icon ${platform === 'gmail' ? 'gmail' : ''}`}>{platform === 'gmail' ? 'M' : '@'}</span><select id="platform" value={platform} onChange={e => { setPlatform(e.target.value as Platform); setMethod('plus'); reset() }}>{Object.entries(platforms).map(([key, value]) => <option value={key} key={key}>{value.name}</option>)}</select><ChevronDown size={16}/></div>
            <label htmlFor="email">Your email address</label><input id="email" type="email" autoComplete="email" placeholder={platform === 'gmail' ? 'you@gmail.com' : 'you@yourdomain.com'} value={email} onChange={e => {setEmail(e.target.value); reset()}} required/><p className="field-help">Use an existing mailbox you own.</p>
            <div className="quantity-label"><label htmlFor="quantity">Number of aliases</label><span>MAX 50,000</span></div><input id="quantity" type="number" min="1" max="50000" step="1" value={quantity} onChange={e => {setQuantity(e.target.value); reset()}} required/><div className="presets">{[10,100,1000,10000,50000].map(n => <button type="button" key={n} className={Number(quantity) === n ? 'selected' : ''} onClick={() => {setQuantity(String(n)); reset()}}>{n >= 1000 ? `${n/1000}k` : n}</button>)}</div>
            <label htmlFor="method">Alias method</label><div className="select-wrap method"><Plus size={17}/><select id="method" value={method} onChange={e => {setMethod(e.target.value as Method); reset()}}><option value="plus">Plus addressing (+tag)</option>{platform === 'gmail' && <><option value="dots">Dot variations</option><option value="combined">Dots + plus addressing</option></>}</select><ChevronDown size={16}/></div><p className="provider-note">{platforms[platform].note}</p>
            <button className="advanced" type="button" aria-expanded={advanced} onClick={() => setAdvanced(!advanced)}><ChevronDown size={14} className={advanced ? 'rotated' : ''}/> Customize tag prefix <span>Optional</span></button>{advanced && <div className="advanced-field"><label htmlFor="prefix">Tag prefix</label><input id="prefix" value={prefix} onChange={e => {setPrefix(e.target.value); reset()}} maxLength={20}/><p className="field-help">For example: +{prefix || 'alias'}00001</p></div>}
            {error && <p className="error" role="alert">{error}</p>}
            <button className="generate" disabled={busy} type="submit"><Sparkles size={17}/>{busy ? 'Generating your aliases…' : 'Generate aliases'}<ArrowRight size={18}/></button><p className="local-note"><LockKeyhole size={11}/> Your email stays on this device.</p>
          </form>
        </div>
        <div className="results"><div className="panel-heading"><span className="step">02</span><h2>Your aliases</h2><span className="count-badge">{aliases.length.toLocaleString()} generated</span></div>
          <div className="results-tools"><div><span className={`status-dot ${aliases.length ? 'ready' : ''}`}/>{aliases.length ? 'Ready to use' : 'Ready when you are'}</div><button disabled={!aliases.length} onClick={reset} aria-label="Clear generated aliases"><X size={13}/> Clear</button></div>
          {aliases.length ? <div className="alias-list" aria-label="Generated email aliases">{aliases.slice(page*100, page*100+100).map((alias, index) => <div className="alias-row" key={alias}><span>{String(page*100+index+1).padStart(2,'0')}</span><code>{alias}</code><Check size={13}/></div>)}</div> : <div className="empty-state"><div className="mail-illustration"><span className="float-tag tag-one">+shopping</span><div className="envelope"><Mail size={46} strokeWidth={1.1}/><span className="plus-bubble"><Plus size={17}/></span></div><span className="float-tag tag-two">+newsletter</span><span className="small-spark">✦</span></div><h3>A little alias. A lot of possibilities.</h3><p>Enter your email and choose a quantity.<br/>Your aliases appear right here.</p><div className="example"><span>LOOKS SOMETHING LIKE THIS</span><code>you<span>+alias00001</span>@gmail.com</code><code>you<span>+alias00002</span>@gmail.com</code><code>you<span>+alias00003</span>@gmail.com</code></div></div>}
          {!!aliases.length && <div className="pagination"><span>Showing {page*100+1}–{Math.min((page+1)*100, aliases.length)} of {aliases.length.toLocaleString()}</span><button disabled={page===0} onClick={() => setPage(page-1)}>Previous</button><button disabled={(page+1)*100 >= aliases.length} onClick={() => setPage(page+1)}>Next</button></div>}
          <div className="export-area"><div className="export-buttons"><button className="copy-button" disabled={!aliases.length} onClick={copy}>{copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Copied all' : 'Copy all aliases'}</button><button className="download-button" disabled={!aliases.length} onClick={download}><ArrowDownToLine size={16}/> Download .txt</button></div><p aria-live="polite">{notice || 'One alias per line. Ready for wherever you need them.'}</p></div>
        </div>
      </section>
      <section className="benefits" id="how-it-works"><div><span className="benefit-icon"><CornerDownRight size={20}/></span><div><h3>Many aliases. One inbox.</h3><p>Keep everything in the mailbox you already use.</p></div></div><div><span className="benefit-icon"><ShieldCheck size={20}/></span><div><h3>Made to stay private.</h3><p>No accounts, servers, or saved email addresses.</p></div></div><div><span className="benefit-icon"><ArrowDownToLine size={20}/></span><div><h3>Generate. Copy. Go.</h3><p>Take up to 50,000 aliases with you in one click.</p></div></div></section>
      <section className="faq-section" id="faq"><div><span className="eyebrow">GOOD TO KNOW</span><h2>A few things,<br/>cleared up.</h2><p>Small variations.<br/>Same familiar inbox.</p></div><div className="faq-list">{questions.map(([question, answer], index) => <div className="faq-item" key={question}><button onClick={() => setFaq(faq === index ? null : index)} aria-expanded={faq === index} aria-controls={`faq-${index}`}>{question}<Plus size={17} className={faq===index ? 'rotated-plus' : ''}/></button>{faq===index && <p id={`faq-${index}`}>{answer}</p>}</div>)}</div></section>
    </main><footer><a href="/" className="brand"><Layers3 size={19}/>AliasKit.</a><span>A simpler way to organize your email.</span><span>Built for your inbox. Respectful of your privacy.</span></footer>
  </div>
}
