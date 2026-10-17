import { describe } from '@/admin/historyText'
import { getAdminLang, requireUser } from '@/admin/server'
import { getStrings } from '@/admin/strings'
import { PageHeader } from '@/admin/ui/Shell'
import { UndoButton } from '@/admin/ui/UndoButton'

export const metadata = { title: 'ફેરફારનો ઇતિહાસ' }

/** “ફેરફારનો ઇતિહાસ”: every change from the last 30 days, each one undoable. */
export default async function HistoryPage() {
  const { payload } = await requireUser()
  const lang = await getAdminLang()
  const t = getStrings(lang)
  const { docs } = await payload.find({ collection: 'history', sort: '-createdAt', limit: 200, depth: 0 })
  return (
    <>
      <PageHeader title={t.history} back="/admin/more" />
      <div className="page" style={{ maxWidth: 860 }}>
        <p className="hint">{t.historyNote}</p>
        <div className="card">
          {docs.length === 0 && <div className="row hint">{t.historyEmpty}</div>}
          {docs.map((h) => {
            const d = describe(h, lang, t)
            return (
              <div key={h.id} className="row" style={{ opacity: h.undone ? 0.6 : 1 }}>
                <div className="grow">
                  <div style={{ fontWeight: 500 }}>{d.head}</div>
                  <div className="hint">{d.detail}</div>
                </div>
                {h.undone ? (
                  <span className="hint">{t.wasUndone}</span>
                ) : (
                  <UndoButton id={String(h.id)} label={h.action === 'delete' ? t.restore : undefined} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
