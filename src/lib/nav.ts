import type { Component } from 'svelte'
import type { SVGAttributes } from 'svelte/elements'
import BlockquoteFillIcon from '~icons/mingcute/blockquote-fill'
import Book6LineIcon from '~icons/mingcute/book-6-line'
import MusicFillIcon from '~icons/mingcute/music-fill'
import TagFillIcon from '~icons/mingcute/tag-fill'

export interface NavItem {
  href: string
  label: string
  icon: Component<SVGAttributes<SVGSVGElement>>
}

export function navItemsFor(user: { role?: string | null } | null | undefined): NavItem[] {
  if (!user)
    return []

  return [
    { href: '/words', label: 'Dictionary', icon: Book6LineIcon },
    { href: '/phrases', label: 'Phrasebook', icon: BlockquoteFillIcon },
    { href: '/songs', label: 'Songbook', icon: MusicFillIcon },
    ...(user.role === 'admin' ? [{ href: '/tags', label: 'Tags', icon: TagFillIcon }] : []),
  ]
}

/** True when `pathname` is the item's page or any page nested beneath it (e.g. /words/foo/edit for /words). */
export function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}
