'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import type { SiteData, SiteGalleryItem } from './data'
import { CloseIcon, Dock, Footer, Header, LangProvider, PhotoIcon, useProductText, useSite, WaIcon } from './ui'

type Cat = 'all' | SiteGalleryItem['cat']

export function GalleryPage({ d }: { d: SiteData }) {
  return (
    <LangProvider>
      <Gallery d={d} />
    </LangProvider>
  )
}

const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

/** Tiles hold their space on the wash while the photo loads, then fade it in. */
function TileImg({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={loaded ? 'loaded' : undefined}
      ref={(el) => {
        if (el?.complete && el.naturalWidth) setLoaded(true)
      }}
      onLoad={() => setLoaded(true)}
    />
  )
}

function Gallery({ d }: { d: SiteData }) {
  const { t, pick } = useSite()
  const [filter, setFilter] = useState<Cat>('all')
  const [open, setOpen] = useState<number | null>(null) // index into d.gallery
  const openedHere = useRef(false)

  const catLabel: Record<SiteGalleryItem['cat'], string> = {
    sanedo: t.gSanedo,
    impl: t.gImpl,
    delivery: t.gDelivery,
    workshop: t.gWorkshop,
    honours: t.gHonours,
  }
  const chips: [Cat, string][] = [['all', t.gAll], ...(Object.entries(catLabel) as [Cat, string][])]
  const shown = d.gallery.map((g, i) => ({ g, i })).filter(({ g }) => filter === 'all' || g.cat === filter)

  useEffect(() => {
    document.title = `${t.galTitle} – ${t.brandName}`
  }, [t])

  // #g-N (1-based) opens photo N; the back button closes it.
  const sync = useCallback(() => {
    const m = location.hash.match(/^#g-(\d+)$/)
    const n = m ? Number(m[1]) - 1 : -1
    setOpen(n >= 0 && n < d.gallery.length ? n : null)
  }, [d.gallery.length])
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL hash is only readable after hydration
    sync()
    const onHash = () => {
      openedHere.current = location.hash.startsWith('#g-')
      sync()
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [sync])

  const go = (i: number) => {
    // Moving between photos replaces the entry, so one back press always closes the lightbox.
    history.replaceState(history.state, '', `#g-${i + 1}`)
    setOpen(i)
  }
  const close = () => {
    if (openedHere.current) history.back()
    else {
      history.replaceState(null, '', location.pathname + location.search)
      setOpen(null)
    }
  }

  return (
    <>
      <Header d={d} home="/" current="gallery" />
      <main>
        <div className="wrap">
          <div className="gal-head">
            <h1>{t.galTitle}</h1>
            <p>{t.galSub}</p>
          </div>
          {d.gallery.length === 0 ? (
            <div className="gal-empty">
              <span className="ic"><PhotoIcon /></span>
              <p>{t.galNone}</p>
            </div>
          ) : (
            <>
              <div className="filters" role="group" aria-label={t.galTitle}>
                {chips.map(([v, label]) => (
                  <button key={v} className="chip" aria-pressed={filter === v} onClick={() => setFilter(v)}>
                    {label}
                  </button>
                ))}
              </div>
              {shown.length === 0 ? (
                <div className="gal-empty">
                  <span className="ic"><PhotoIcon /></span>
                  <p>{t.galEmpty}</p>
                  <button className="chip" onClick={() => setFilter('all')}>{t.galAll}</button>
                </div>
              ) : (
                <div className="tiles">
                  {shown.map(({ g, i }) => {
                    const cap = pick(g.cap) || catLabel[g.cat]
                    return (
                      <a key={i} className={`tile${g.kind === 'video' ? ' video' : ''}`} href={`#g-${i + 1}`} aria-label={cap}>
                        {g.kind === 'video' && g.youtube ? (
                          <>
                            <TileImg src={ytThumb(g.youtube)} alt="" />
                            <span className="play" aria-hidden="true">
                              <svg viewBox="0 0 24 24" fill="#19203F"><path d="M8 5.5v13l11-6.5z" /></svg>
                            </span>
                          </>
                        ) : g.thumb ? (
                          <TileImg src={g.thumb} alt={cap} />
                        ) : null}
                      </a>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
      <Dock d={d} show />
      <Lightbox d={d} index={open} list={shown.map((s) => s.i)} catLabel={catLabel} onGo={go} onClose={close} />
    </>
  )
}

function Lightbox({ d, index, list, catLabel, onGo, onClose }: {
  d: SiteData
  index: number | null
  list: number[]
  catLabel: Record<SiteGalleryItem['cat'], string>
  onGo: (i: number) => void
  onClose: () => void
}) {
  const { t, pick, num } = useSite()
  const { fullName, enquireLink } = useProductText(d)
  const ref = useRef<HTMLDialogElement>(null)
  const touch = useRef<number | null>(null)
  const [copied, setCopied] = useState(false)
  // Step through the photos currently shown (the active filter); a shared link may point outside it.
  const order = index != null && !list.includes(index) ? d.gallery.map((_, i) => i) : list
  const pos = index == null ? -1 : order.indexOf(index)
  const g = index == null ? null : d.gallery[index]
  const prev = () => pos > 0 && onGo(order[pos - 1])
  const next = () => pos >= 0 && pos < order.length - 1 && onGo(order[pos + 1])
  const product = g?.product ? d.products.find((p) => p.id === g.product) : undefined

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (g && !el.open) el.showModal()
    else if (!g && el.open) el.close()
  }, [g])

  const share = async () => {
    const url = location.href
    try {
      if (navigator.share) await navigator.share({ url, title: pick(g?.cap) || t.galTitle })
      else {
        await navigator.clipboard.writeText(url)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  const arrow = (dir: 'l' | 'r') => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'l' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} />
    </svg>
  )

  return (
    <dialog
      className="lightbox"
      ref={ref}
      aria-label={t.galTitle}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
      }}
    >
      {g && (
        <>
          <div className="lb-top">
            <div>
              <button className="ib" aria-label={t.share} onClick={share}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
                </svg>
              </button>
            </div>
            <span className="count" aria-live="polite">
              {copied ? t.linkCopied : `${num(pos + 1)} / ${num(order.length)}`}
            </span>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="ib" aria-label={t.close} onClick={onClose}>
                <CloseIcon />
              </button>
            </div>
          </div>
          <div
            className="lb-stage"
            onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touch.current == null) return
              const dx = e.changedTouches[0].clientX - touch.current
              touch.current = null
              if (Math.abs(dx) > 50) (dx > 0 ? prev : next)()
            }}
          >
            <button className="ib lb-nav" aria-label={t.prev} onClick={prev} disabled={pos <= 0} style={{ opacity: pos <= 0 ? 0.3 : 1 }}>
              {arrow('l')}
            </button>
            <div className="lb-media">
              {g.kind === 'video' && g.youtube ? (
                <iframe
                  key={g.youtube}
                  src={`https://www.youtube-nocookie.com/embed/${g.youtube}?rel=0`}
                  title={pick(g.cap) || t.video}
                  allow="encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : g.full ? (
                <img key={g.full} src={g.full} alt={pick(g.cap) || catLabel[g.cat]} />
              ) : null}
            </div>
            <button className="ib lb-nav" aria-label={t.next} onClick={next} disabled={pos >= order.length - 1} style={{ opacity: pos >= order.length - 1 ? 0.3 : 1 }}>
              {arrow('r')}
            </button>
          </div>
          <div className="lb-foot">
            <div>
              {pick(g.cap) && <p className="cap">{pick(g.cap)}</p>}
              <p className="sub">{g.kind === 'video' ? `${catLabel[g.cat]} · ${t.video}` : catLabel[g.cat]}</p>
            </div>
            {product && (
              <a className="btn btn-wa" href={enquireLink(product)} target="_blank" rel="noopener" title={fullName(product)}>
                <WaIcon />
                <span>{t.askModel}</span>
              </a>
            )}
          </div>
        </>
      )}
    </dialog>
  )
}


