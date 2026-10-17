'use client'

import { useRouter } from 'next/navigation'

import { saveDoc, trashDoc } from '../actions'
import { useAdmin } from './AdminContext'
import { Chips, I18nInput, LangScope, NumberUnit, SaveBar, useConfirm, useForm, type I18n } from './form'
import { ITrash } from './icons'
import { PageHeader } from './Shell'

export type AwardData = { year: number | null; icon: 'trophy' | 'medal' | 'cert'; title: I18n; by: I18n }
export type ReviewData = { quote: I18n; name: I18n; village: I18n }

type Props =
  | { kind: 'awards'; id: string | null; initial: AwardData }
  | { kind: 'reviews'; id: string | null; initial: ReviewData }

/** Edit one award or one farmer review. */
export function EntryForm({ kind, id, initial }: Props) {
  const { t, toast } = useAdmin()
  const router = useRouter()
  const { ask, dialog } = useConfirm()
  const base = `/admin/${kind}`
  const form = useForm<Record<string, unknown>>(initial, (d) => saveDoc(kind, id, d), {
    validate: (d) => {
      const e: Record<string, string> = {}
      const keys = kind === 'awards' ? ['title', 'by'] : ['quote', 'name', 'village']
      for (const k of keys) if (!(d[k] as I18n)?.gu?.trim()) e[`${k}.gu`] = t.required
      if (kind === 'awards' && !d.year) e.year = t.required
      return e
    },
    onSaved: (res) => {
      if (!id && res.id) router.replace(`${base}/${res.id}`)
    },
  })
  const d = form.data as Record<string, I18n> & { year?: number | null; icon?: string }
  const set = (k: string) => (v: unknown) => form.set(k, v)
  const err = (k: string) => form.errors[k] || form.errors[`${k}.gu`]

  const onDelete = async () => {
    if (!id || !(await ask(kind === 'awards' ? t.thisAward : t.thisReview, kind === 'awards'))) return
    const res = await trashDoc(kind, id)
    if (res.ok) {
      toast(t.deleted, res.historyId)
      router.replace(base)
      router.refresh()
    } else toast(t.saveFailed)
  }

  const values = kind === 'awards' ? [d.title, d.by] : [d.quote, d.name, d.village]
  return (
    <>
      <PageHeader title={kind === 'awards' ? (id ? t.award : t.addAward) : id ? t.review : t.addReview} back={base} />
      <div className="page form" style={{ maxWidth: 760 }}>
        <section className="card pad">
          {kind === 'awards' && (
            <>
              <div className="grid2">
                <NumberUnit label={t.year} value={d.year ?? null} onChange={set('year')} error={form.errors.year} />
              </div>
              <Chips
                label={t.icon}
                options={(['trophy', 'medal', 'cert'] as const).map((v) => ({
                  value: v,
                  label: v === 'trophy' ? t.iconTrophy : v === 'medal' ? t.iconMedal : t.iconCert,
                }))}
                value={d.icon as 'trophy'}
                onChange={set('icon')}
              />
            </>
          )}
          <LangScope values={values}>
            {kind === 'awards' ? (
              <>
                <I18nInput label={t.awardTitle} value={d.title} onChange={set('title')} guide={40} error={err('title')} />
                <I18nInput label={t.awardBy} value={d.by} onChange={set('by')} guide={40} error={err('by')} />
              </>
            ) : (
              <>
                <I18nInput label={t.quote} value={d.quote} onChange={set('quote')} guide={140} multiline error={err('quote')} />
                <I18nInput label={t.farmerName} value={d.name} onChange={set('name')} guide={30} error={err('name')} />
                <I18nInput label={t.village} value={d.village} onChange={set('village')} guide={20} error={err('village')} />
              </>
            )}
          </LangScope>
        </section>
        {id && (
          <button className="linkbtn danger" style={{ alignSelf: 'flex-start' }} onClick={onDelete}>
            <ITrash />
            {kind === 'awards' ? t.deleteAward : t.deleteReview}
          </button>
        )}
      </div>
      <SaveBar form={form} />
      {dialog}
    </>
  )
}
