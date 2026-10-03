// Shared look and motion for the dropdown menus in program creation
export const menuContentClass = [
  'origin-top border-neutral-800 bg-[#141414] p-1.5',
  'data-[state=open]:!animate-dropdown-in data-[state=closed]:!animate-dropdown-out',
  'motion-reduce:[--dropdown-scale:1] motion-reduce:[--dropdown-shift:0px]'
].join(' ')

export const menuCollisionPadding = { left: 16, right: 16, bottom: -9999 }

export const menuItemClass =
  'flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 text-neutral-100 focus:bg-neutral-800/70 focus:text-neutral-50 [&_svg]:size-[1.125rem]'
