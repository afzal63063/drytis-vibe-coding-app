import { useState } from 'react'

export type CollapsibleKey =
  | 'general'
  | 'questionTitle'
  | 'subtitle'
  | 'options'
  | 'filled'
  | 'selected'
  | 'unselected'
  | 'comment'
  | 'cta'
  | 'cross'
  | 'thankYou'

type Groups = Record<CollapsibleKey, boolean>

export function useCollapsibleGroups(): [
  Groups,
  (key: CollapsibleKey) => void,
] {
  const [groups, setGroups] = useState<Groups>({
    general: true,
    questionTitle: false,
    subtitle: false,
    options: false,
    filled: false,
    selected: false,
    unselected: false,
    comment: false,
    cta: false,
    cross: false,
    thankYou: false,
  })

  const toggle = (key: CollapsibleKey) =>
    setGroups((prev) => ({ ...prev, [key]: !prev[key] }))

  return [groups, toggle]
}
