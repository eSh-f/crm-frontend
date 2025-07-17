import { useState } from 'react'
import styles from './styles/LoginPage.module.scss'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'
import Carousel from './components/Carousel'

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false)

  return (
    <div className={styles.wrapper}>
      <div className={styles.carouselWrapper}>
        <Carousel />
      </div>

      <div className={styles.formWrapper}>
        {isRegister ? (
          <>
            <RegisterForm />
            <p className={styles.switchText}>
              Уже есть аккаунт?{' '}
              <button onClick={() => setIsRegister(false)}>Войти</button>
            </p>
          </>
        ) : (
          <>
            <LoginForm />
            <p className={styles.switchText}>
              Нет аккаунта?{' '}
              <button onClick={() => setIsRegister(true)}>
                Зарегистрироваться
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default LoginPage
