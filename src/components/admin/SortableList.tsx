'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useCallback } from 'react'
import styles from './admin.module.css'

type SortableRowProps<T extends { id: string }> = {
  item: T
  renderCells: (
    item: T,
    dragHandleListeners: Record<string, unknown> | undefined
  ) => React.ReactNode
  rowClassName?: (isDragging: boolean) => string | undefined
}

function SortableRow<T extends { id: string }>({
  item,
  renderCells,
  rowClassName,
}: SortableRowProps<T>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  return (
    <tr
      ref={setNodeRef as React.Ref<HTMLTableRowElement>}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={rowClassName?.(isDragging)}
      {...attributes}
    >
      {renderCells(item, listeners)}
    </tr>
  )
}

export type SortableListProps<T extends { id: string }> = {
  items: T[]
  renderCells: (
    item: T,
    dragHandleListeners: Record<string, unknown> | undefined
  ) => React.ReactNode
  rowClassName?: (isDragging: boolean) => string | undefined
  onOrderChange: (orderedItems: T[]) => void
}

export function DragHandle({
  listeners,
}: {
  listeners: Record<string, unknown> | undefined
}) {
  return (
    <span
      className={styles.dragHandle}
      {...(listeners as React.HTMLAttributes<HTMLSpanElement>)}
    >
      ⠿
    </span>
  )
}

export default function SortableList<T extends { id: string }>({
  items,
  renderCells,
  rowClassName,
  onOrderChange,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      if (!over || active.id === over.id) return
      const oldIndex = items.findIndex((i) => i.id === active.id)
      const newIndex = items.findIndex((i) => i.id === over.id)
      onOrderChange(arrayMove(items, oldIndex, newIndex))
    },
    [items, onOrderChange]
  )

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((i) => i.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableRow
            key={item.id}
            item={item}
            renderCells={renderCells}
            rowClassName={rowClassName}
          />
        ))}
      </SortableContext>
    </DndContext>
  )
}
