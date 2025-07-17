import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from '@mui/material'
import styles from '../styles/LoginForm.module.scss'
import { useLoginMutation } from '../../../shared/api/authApi'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { loginSuccess } from '../../../shared/store/userSlice'
import { useDispatch } from 'react-redux'

type FormData = {
  email: string
  password: string
}

const LoginForm = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const [loginUser, { isLoading }] = useLoginMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginUser(data).unwrap()

      dispatch(loginSuccess({ token: res.token, role: res.user.role }))
      if (res.user.role === 'freelancer') {
        navigate('/freelancer/dashboard')
      } else {
        navigate('/client/dashboard')
      }
    } catch (err: any) {
      alert(err?.data?.error || 'Неверный логин или пароль')
    }
  }

  return (
    <Box
      component="form"
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h5" fontWeight="bold">
        С возвращением!
      </Typography>

      <Typography variant="body2">
        Нет аккаунта?{' '}
        <Link href="/register" underline="hover">
          Зарегистрироваться
        </Link>
      </Typography>

      <TextField
        label="Email"
        type="email"
        fullWidth
        className={styles.input}
        {...register('email', { required: 'Email обязателен' })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Пароль"
        type="password"
        fullWidth
        className={styles.input}
        {...register('password', { required: 'Пароль обязателен' })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <FormControlLabel
        control={<Checkbox />}
        label="Я согласен с условиями использования"
        className={styles.checkbox}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        className={styles.button}
        disabled={isLoading}
      >
        {isLoading ? 'Вход...' : 'Войти'}
      </Button>

      <Divider className={styles.divider}>или</Divider>

      <Button variant="contained" fullWidth className={styles.button}>
        Войти через Google
      </Button>

      <Typography align="center" variant="body2">
        Забыли пароль?{' '}
        <Link href="#" underline="hover">
          Восстановить
        </Link>
      </Typography>
    </Box>
  )
}

export default LoginForm
