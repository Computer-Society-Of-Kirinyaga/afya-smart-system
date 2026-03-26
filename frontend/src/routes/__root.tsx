import { QueryProvider } from '#/providers/QueryProvider'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import '../styles.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent(): JSX.Element {
  return (
    <QueryProvider>
      <>
        <Outlet />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </>
    </QueryProvider>
  )
}
