import styles from './styles/LoginPage.module.scss'
import LoginForm from './components/LoginForm.tsx'
import Carousel from './components/Carousel.tsx'

const LoginPage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.carouselWrapper}>
        <Carousel />
      </div>

      <div className={styles.formWrapper}>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
