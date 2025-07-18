import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Link,
  MenuItem,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material'
import styles from '../styles/LoginForm.module.scss'
import { useRegisterMutation, useLoginMutation } from '../../../shared/api/authApi'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import GitHubIcon from '@mui/icons-material/GitHub'

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
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      }).unwrap()
      const loginRes = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap()
      localStorage.setItem('token', loginRes.token)
      localStorage.setItem('role', loginRes.user.role)
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
    <Box
      component="form"
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography variant="h3" fontWeight="bold">
        Регистрация
      </Typography>
      <Typography variant="body2">
        Уже есть аккаунт?{' '}
        <Link href="/login" underline="hover">
          Войти
        </Link>
      </Typography>
      <TextField
        label="Имя"
        fullWidth
        className={styles.input}
        variant="filled"
        {...register('name', { required: 'Имя обязательно' })}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <TextField
        label="Email"
        type="email"
        fullWidth
        className={styles.input}
        variant="filled"
        {...register('email', { required: 'Email обязателен' })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="Пароль"
        type="password"
        fullWidth
        className={styles.input}
        variant="filled"
        {...register('password', {
          required: 'Пароль обязателен',
          minLength: { value: 6, message: 'Минимум 6 символов' },
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <TextField
        label="Повторите пароль"
        type="password"
        fullWidth
        className={styles.input}
        variant="filled"
        {...register('confirmPassword', { required: 'Повторите пароль' })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
      />
      <FormControl fullWidth className={styles.input}>
        {/* Убрали InputLabel */}
        <Select
          defaultValue="freelancer"
          displayEmpty
          {...register('role', { required: true })}
        >
          <MenuItem value="freelancer">Фрилансер</MenuItem>
          <MenuItem value="client">Заказчик</MenuItem>
        </Select>
      </FormControl>
      <FormControlLabel
        control={<Checkbox required />}
        label="Я согласен с условиями использования"
        className={styles.checkbox}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        className={styles.button}
      >
        Создать аккаунт
      </Button>
      <Divider className={styles.divider}>или</Divider>
      <Button
        variant="outlined"
        fullWidth
        className={styles.button}
        startIcon={<GitHubIcon style={{ color: 'white' }} />}
        style={{ color: 'white', borderColor: 'white' }}
        onClick={() => {
          window.location.href = `https://github.com/login/oauth/authorize?client_id=Ov23likZMAxFY1ScKMf7&scope=read:user,user:email`
        }}
      >
        Зарегистрироваться через GitHub
      </Button>
    </Box>
  )
}

export default RegisterForm
