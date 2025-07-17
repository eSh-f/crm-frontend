import { useNavigate } from 'react-router-dom'
import styles from '../styles/RegisterForm.module.scss'
import {
  useRegisterMutation,
  useLoginMutation,
} from '../../../shared/api/authApi'
import { useForm } from 'react-hook-form'

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'freelancer' | 'client'
}

const RegisterForm = () => {
  const navigate = useNavigate()
  const [registerUser] = useRegisterMutation()
  const [loginUser] = useLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      alert('Пароли не совпадают')
      return
    }

    try {
      // Сначала регистрация
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }).unwrap()

      // Затем логин
      const loginRes = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap()

      // Сохраняем токен и роль
      localStorage.setItem('token', loginRes.token)
      localStorage.setItem('role', loginRes.user.role)

      // Перенаправляем по роли
      if (loginRes.user.role === 'freelancer') {
        navigate('/freelancer/dashboard')
      } else if (loginRes.user.role === 'client') {
        navigate('/client/dashboard')
      } else {
        navigate('/login')
      }
    } catch (err: any) {
      alert(err?.data?.error || 'Ошибка регистрации или входа')
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Регистрация</h2>

      <input
        type="text"
        placeholder="Имя"
        {...register('name', { required: 'Имя обязательно' })}
      />
      {errors.name && <p>{errors.name.message}</p>}

      <input
        type="email"
        placeholder="Email"
        {...register('email', { required: 'Email обязателен' })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Пароль"
        {...register('password', {
          required: 'Пароль обязателен',
          minLength: { value: 6, message: 'Минимум 6 символов' },
        })}
      />
      {errors.password && <p>{errors.password.message}</p>}

      <input
        type="password"
        placeholder="Повторите пароль"
        {...register('confirmPassword', {
          required: 'Повторите пароль',
        })}
      />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

      <select {...register('role', { required: true })}>
        <option value="freelancer">Фрилансер</option>
        <option value="client">Заказчик</option>
      </select>

      <button type="submit">Создать аккаунт</button>
    </form>
  )
}

export default RegisterForm
