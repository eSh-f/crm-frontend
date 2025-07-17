import type { ReactNode } from 'react'
import styles from './Layout.module.scss'
import { useNavigate, Link } from 'react-router-dom' // добавили Link

type Props = {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <nav>
          <h2>Меню</h2>
          <ul>
            <li>
              <Link to="/dashboard">Главная</Link>
            </li>
            <li>
              <Link to="/orders">Заказы</Link>
            </li>
            <li>
              <Link to="/profile">Профиль</Link>
            </li>
          </ul>

          <button onClick={handleLogout} className={styles.logoutButton}>
            Выйти
          </button>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <span>CRM Панель</span>
        </header>

        <section className={styles.content}>{children}</section>
      </main>
    </div>
  )
}

export default Layout
