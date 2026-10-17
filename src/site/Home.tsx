'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { SiteData, SiteProduct } from './data'
import { T } from './strings'
import { CloseIcon, Dock, Footer, Header, LangProvider, PhoneIcon, productLink, useProductText, useSite, WaIcon, waURL } from './ui'

const AWARD_ICONS: Record<string, React.ReactNode> = {
  trophy: <path d="M7 4h10v4a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6v4H9z" />,
  medal: <><circle cx="12" cy="15" r="5" /><path d="M8.5 11 6 3h4l2 5 2-5h4l-2.5 8M12 13v4" /></>,
  cert: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M7 9h10M7 12h6M16 17v4l2-1.3 2 1.3v-4" /></>,
}

export function HomePage({ d }: { d: SiteData }) {
  return (
    <LangProvider>
      <Home d={d} />
    </LangProvider>
  )
}

function Home({ d }: { d: SiteData }) {
  const { t, lang, pick, num, money } = useSite()
  const { fullName, specs, enquireLink } = useProductText(d)
  const [filter, setFilter] = useState<'all' | '3' | '4' | 'impl'>('all')
  const [dock, setDock] = useState(false)
  const hero = useRef<HTMLElement>(null)

  useEffect(() => {
    document.title = `${t.brandName} – ${t.brandPlace}`
  }, [t])

  // The call/WhatsApp bar appears once the hero is scrolled past.
  useEffect(() => {
    if (!hero.current) return
    const io = new IntersectionObserver(([en]) => setDock(!en.isIntersecting))
    io.observe(hero.current)
    return () => io.disconnect()
  }, [])

  const wa = (k: 'general' | 'subsidy' | 'service') => waURL(T[lang].wa[k], '91' + d.whatsapp)
  const list = d.products.filter((p) => filter === 'all' || p.cat === filter)
  const or = (v: string, fallback: string) => v || fallback
  const priceBlock = (p: SiteProduct) =>
    p.price == null ? (
      <>
        <small>&nbsp;</small>
        <b className="ask">{t.askPrice}</b>
      </>
    ) : (
      <>
        <small>{t.exShowroom}</small>
        <b>{money(p.price)}</b>
      </>
    )

  return (
    <>
      <Header d={d} />
      <main id="top">
        <section className="hero" aria-labelledby="heroTitle" ref={hero}>
          <div className="wrap hero-inner">
            <p className="bless">{or(pick(d.hero.blessing), t.blessing)}</p>
            <h1 id="heroTitle">{or(pick(d.hero.title), t.heroTitle)}</h1>
            <p className="lead">{or(pick(d.hero.sub), t.heroSub)}</p>
            <div className="cta">
              <a className="btn btn-kesar" href="#sanedo">{t.heroCta}</a>
              <a className="btn btn-ghost" href={wa('general')} target="_blank" rel="noopener">
                <WaIcon />
                <span>{t.askWa}</span>
              </a>
            </div>
          </div>
          <img className="temple-photo" src={d.hero.photo} width={708} height={530} alt={t.templeAlt} fetchPriority="high" />
        </section>

        {d.stats.length > 0 && (
          <div className="stats">
            <div className="wrap">
              <ul id="stats">
                {d.stats.map((s, i) => (
                  <li key={i}>
                    <b>{num(s.value)}</b>
                    <span>{pick(s.label)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <section className="block" id="sanedo" aria-labelledby="pTitle">
          <div className="wrap">
            <div className="head">
              <h2 id="pTitle">{t.productsTitle}</h2>
              <p>{t.productsSub}</p>
            </div>
            <div className="filters" role="group" aria-label={t.navProducts}>
              {([['all', t.fAll], ['3', t.f3], ['4', t.f4], ['impl', t.fImpl]] as const).map(([v, label]) => (
                <button key={v} className="chip" aria-pressed={filter === v} onClick={() => setFilter(v)}>
                  {label}
                </button>
              ))}
            </div>
            <div className="grid">
              {list.map((p) => (
                <article className="card" key={p.id}>
                  <a className={`pic${p.photo ? ' has-photo' : ''}`} href={`#p-${p.id}`} aria-label={`${t.details}: ${fullName(p)}`}>
                    {p.best && <span className="tag">{t.bestSeller}</span>}
                    <span className={`stock${p.stock ? ' in' : ''}`}>{p.stock ? t.inStock : t.toOrder}</span>
                    {p.img && <img src={p.img} alt={fullName(p)} className={p.photo ? 'photo' : undefined} loading="lazy" />}
                  </a>
                  <div className="body">
                    <h3>{fullName(p)}</h3>
                    <p className="desc">{pick(p.desc)}</p>
                    <dl className="mini">
                      {specs(p).slice(0, 2).map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="price">{priceBlock(p)}</div>
                    <div className="actions">
                      <a className="btn btn-wa" href={enquireLink(p)} target="_blank" rel="noopener">
                        <WaIcon />
                        <span>{t.enquire}</span>
                      </a>
                      <a className="linkbtn" href={`#p-${p.id}`}>{t.details}</a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="block" id="sahay" style={{ paddingTop: 0 }} aria-labelledby="sTitle">
          <div className="wrap">
            <div className="subsidy">
              <div className="main">
                <h2 id="sTitle">{or(pick(d.subsidy.title), t.subTitle)}</h2>
                <p>{or(pick(d.subsidy.body), t.subBody)}</p>
                <p className="note">{or(pick(d.subsidy.note), t.subNote)}</p>
              </div>
              <div>
                <ol className="steps">
                  {(d.subsidy.steps.length ? d.subsidy.steps.map(pick) : [t.step1, t.step2, t.step3]).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
                <p style={{ margin: '20px 0 14px' }}>{or(pick(d.subsidy.help), t.subHelp)}</p>
                <a className="btn btn-wa" href={wa('subsidy')} target="_blank" rel="noopener">
                  <WaIcon />
                  <span>{t.subCta}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {d.awards.length > 0 && (
          <section className="block" id="siddhi" style={{ background: 'var(--wash)' }} aria-labelledby="aTitle">
            <div className="wrap">
              <div className="head">
                <h2 id="aTitle">{t.awardsTitle}</h2>
                <p>{t.awardsSub}</p>
              </div>
              <div className="awards" tabIndex={0}>
                {d.awards.map((a, i) => (
                  <article className="award" key={i}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true">
                      {AWARD_ICONS[a.icon] ?? AWARD_ICONS.trophy}
                    </svg>
                    <span className="yr">{num(a.year)}</span>
                    <h3>{pick(a.title)}</h3>
                    <p>{pick(a.by)}</p>
                  </article>
                ))}
              </div>
              {d.gallery.length > 0 && (
                <a className="morelink" href="/gallery">
                  {t.morePhotos}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              )}
            </div>
          </section>
        )}

        {d.reviews.length > 0 && (
          <section className="block" aria-labelledby="rTitle">
            <div className="wrap">
              <div className="head">
                <h2 id="rTitle">{t.reviewsTitle}</h2>
                <p>{t.reviewsSub}</p>
              </div>
              <div className="reviews">
                {d.reviews.map((r, i) => (
                  <figure className="review" key={i}>
                    <blockquote>{pick(r.quote)}</blockquote>
                    <figcaption>
                      <b>{pick(r.name)}</b>
                      <span>{pick(r.village)}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="block" id="sampark" style={{ paddingTop: 0 }} aria-labelledby="vTitle">
          <div className="wrap visit">
            <div className="head" style={{ margin: 0 }}>
              <h2 id="vTitle">{t.visitTitle}</h2>
              <p>{t.visitSub}</p>
            </div>
            <div>
              <dl>
                <div>
                  <dt>{t.addrLabel}</dt>
                  <dd>{or(pick(d.address), t.address)}</dd>
                </div>
                <div>
                  <dt>{t.hoursLabel}</dt>
                  <dd>
                    <span>{or(pick(d.hours), t.hours)}</span>
                    <br />
                    <span>{or(pick(d.closed), t.sunday)}</span>
                  </dd>
                </div>
                <div>
                  <dt>{t.phoneLabel}</dt>
                  <dd>
                    <a href={`tel:+91${d.phone}`}>+91 {d.phone.slice(0, 5)} {d.phone.slice(5)}</a>
                  </dd>
                </div>
              </dl>
              <div className="acts" style={{ marginTop: 22 }}>
                <a className="btn btn-kesar" href={d.maps} target="_blank" rel="noopener">{t.directions}</a>
                <a className="btn btn-ghost" href={wa('service')} target="_blank" rel="noopener">{t.service}</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <Dock d={d} show={dock} />
      <ProductSheet d={d} />
    </>
  )
}

/** Product detail: bottom sheet on phones, dialog ≥700px. URL #p-ID; the back button closes it. */
function ProductSheet({ d }: { d: SiteData }) {
  const { t, pick, money } = useSite()
  const { fullName, specs, enquireLink } = useProductText(d)
  const ref = useRef<HTMLDialogElement>(null)
  const [id, setId] = useState<string | null>(null)
  const p = d.products.find((x) => x.id === id) ?? null

  // Follow the URL: #p-ID opens, anything else closes. Covers links, back/forward and shared links.
  // True when the sheet was opened by a click on this page (a history entry we can go back from).
  const openedHere = useRef(false)
  const sync = useCallback(() => {
    const m = location.hash.match(/^#p-(.+)$/)
    const next = m ? decodeURIComponent(m[1]) : null
    setId(next && d.products.some((x) => x.id === next) ? next : null)
  }, [d.products])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL hash is only readable after hydration
    sync()
    const onHash = () => {
      openedHere.current = location.hash.startsWith('#p-')
      sync()
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [sync])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (p && !el.open) {
      try {
        el.showModal()
      } catch {
        el.setAttribute('open', '')
      }
    } else if (!p && el.open) el.close()
  }, [p])

  const close = () => {
    if (!location.hash.startsWith('#p-')) return
    // Opened from a card here → go back (so the back button stays natural); opened from a shared link → just clear it.
    if (openedHere.current) history.back()
    else {
      history.replaceState(null, '', location.pathname + location.search)
      sync()
    }
  }

  return (
    <dialog
      className="sheet"
      id="sheet"
      ref={ref}
      aria-labelledby="sheetTitle"
      onClick={(e) => {
        if (e.target === ref.current) close()
      }}
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
    >
      <div className="scroll">
        {p && (
          <>
            <span className="grab" aria-hidden="true" />
            <button className="x" aria-label={t.close} onClick={close}>
              <CloseIcon />
            </button>
            <div className={`pic${p.photo ? ' has-photo' : ''}`} style={{ position: 'relative' }}>
              {p.best && <span className="tag">{t.bestSeller}</span>}
              {p.img && <img src={p.img} alt={fullName(p)} className={p.photo ? 'photo' : undefined} />}
            </div>
            <div className="inner">
              <div>
                <span className={`stock${p.stock ? ' in' : ''}`} style={{ position: 'static', padding: 0, background: 'none' }}>
                  {p.stock ? t.inStock : t.toOrder}
                </span>
                <h3 id="sheetTitle">{fullName(p)}</h3>
                <p className="desc" style={{ color: 'var(--muted)', marginTop: 6 }}>{pick(p.desc)}</p>
              </div>
              <div className="price" style={{ border: 0, padding: 0 }}>
                {p.price == null ? (
                  <>
                    <small>&nbsp;</small>
                    <b className="ask">{t.askPrice}</b>
                  </>
                ) : (
                  <>
                    <small>{t.exShowroom}</small>
                    <b>{money(p.price)}</b>
                  </>
                )}
              </div>
              <dl className="specs">
                {specs(p).map(([k, v], i) => (
                  <div key={i}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="actions">
                <a className="btn btn-wa" href={enquireLink(p)} target="_blank" rel="noopener">
                  <WaIcon />
                  <span>{t.enquire}</span>
                </a>
                <a className="btn btn-ghost" href={`tel:+91${d.phone}`}>
                  <PhoneIcon />
                  <span>{t.call}</span>
                </a>
              </div>
              <a className="linkbtn" style={{ justifySelf: 'center' }} href={waURL(t.waShare(fullName(p), productLink(d, p)))} target="_blank" rel="noopener">
                {t.sendFriend}
              </a>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
