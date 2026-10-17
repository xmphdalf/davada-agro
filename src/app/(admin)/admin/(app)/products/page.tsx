import Link from 'next/link'

import { loadProducts } from '@/admin/data'
import { toRow } from '@/admin/productView'
import { getAdminLang, requireUser } from '@/admin/server'
import { getStrings } from '@/admin/strings'
import { IPlus } from '@/admin/ui/icons'
import { PageHeader } from '@/admin/ui/Shell'
import { num } from '@/lib/format'
import { ProductsList } from './ProductsList'

export const metadata = { title: 'સનેડા' }

export default async function ProductsPage() {
  const { payload } = await requireUser()
  const lang = await getAdminLang()
  const t = getStrings(lang)
  const rows = (await loadProducts(payload)).map((p) => toRow(p, lang, t))
  return (
    <>
      <PageHeader title={t.products} count={num(rows.length, lang)} siteLink={false} />
      <div className="page">
        <div className="f-row" style={{ alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p className="hint desk-only" style={{ maxWidth: '60ch' }}>{t.reorderHintDesktop}</p>
          <Link className="btn btn-kesar btn-lg" href="/admin/products/new" style={{ flexGrow: 1, maxWidth: 'none' }}>
            <IPlus />
            {t.addProduct}
          </Link>
        </div>
        <p className="hint mob-only" style={{ padding: '0 4px' }}>{t.reorderHint}</p>
        <ProductsList initial={rows} />
      </div>
    </>
  )
}
