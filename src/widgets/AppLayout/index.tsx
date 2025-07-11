import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <div>
      <div>Sidebar</div>

      <div>
        Header
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
