import { QueryProvider } from '#/providers/QueryProvider'
import { Outlet, createRootRoute } from '@tanstack/react-router'

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent(): JSX.Element {
  return (
    <QueryProvider>
      <>
        <Outlet />
      </>
    </QueryProvider>
  )
}
