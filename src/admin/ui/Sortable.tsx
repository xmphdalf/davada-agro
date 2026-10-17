'use client'

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useId, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'

export type HandleProps = HTMLAttributes<HTMLElement>

/**
 * Reorder by dragging. Lists drag from the ⠿ handle only, so a stray scroll never reshuffles
 * anything; grids (photos) drag after a press-and-hold.
 */
export function Sortable<T extends { id: string }>({ items, onReorder, render, grid, className, container }: {
  items: T[]
  onReorder: (items: T[]) => void
  render: (item: T, index: number, h: { handle: HandleProps; style: CSSProperties; ref: (el: HTMLElement | null) => void; dragging: boolean }) => ReactNode
  grid?: boolean
  className?: string
  /** Custom wrapper for the rows (e.g. a table), so dnd-kit's helper elements stay outside it. */
  container?: (rows: ReactNode) => ReactNode
}) {
  // A stable id keeps dnd-kit's accessibility ids the same on server and client (no hydration mismatch).
  const dndId = useId()
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: grid ? { delay: 250, tolerance: 6 } : { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: grid ? 250 : 120, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    const from = items.findIndex((i) => i.id === active.id)
    const to = items.findIndex((i) => i.id === over.id)
    onReorder(arrayMove(items, from, to))
  }
  const rows = items.map((item, i) => (
    <Item key={item.id} id={item.id}>
      {(h) => render(item, i, h)}
    </Item>
  ))
  return (
    <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={grid ? rectSortingStrategy : verticalListSortingStrategy}>
        {container ? container(rows) : <div className={className}>{rows}</div>}
      </SortableContext>
    </DndContext>
  )
}

function Item({ id, children }: {
  id: string
  children: (h: { handle: HandleProps; style: CSSProperties; ref: (el: HTMLElement | null) => void; dragging: boolean }) => ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return children({
    handle: { ...attributes, ...listeners } as HandleProps,
    ref: setNodeRef,
    dragging: isDragging,
    style: { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 2 : undefined },
  })
}
