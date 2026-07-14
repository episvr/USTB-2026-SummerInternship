import { cn } from '../lib/utils'

const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`

// Brand badge: Aurobo avatar mark.
export function BrandMark({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span className={cn('inline-flex size-14 shrink-0 items-center justify-center bg-white rounded-xl', className)} {...props}>
      <img alt="" className="size-full object-contain rounded-xl" src={assetPath('avatar.png')} />
    </span>
  )
}
