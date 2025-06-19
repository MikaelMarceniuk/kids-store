import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cleanFilters<T extends Record<string, unknown>>(
  filters: T
): Partial<T> {
  return Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  ) as Partial<T>
}

export function firstMissingLetter(name: string): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

  const normalized = name.toUpperCase()

  for (const letter of alphabet) {
    if (!normalized.includes(letter)) {
      return letter
    }
  }
  return '-'
}
