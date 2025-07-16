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

const LoginForm = () => {
  return (
    <Box className={styles.form}>
      <Typography variant="h5" fontWeight="bold">
        С возвращением!
      </Typography>

      <Typography variant="body2">
        Нет аккаунта?
        <Link href="#" underline="hover">
          Зарегистрироваться
        </Link>
      </Typography>

      <TextField
        label="Email"
        type="email"
        fullWidth
        className={styles.input}
      />

      <TextField
        label="Пароль"
        type="password"
        fullWidth
        className={styles.input}
      />

      <FormControlLabel
        control={<Checkbox />}
        label="Я согласен с условиями использования"
        className={styles.checkbox}
      />

      <Button variant="contained" fullWidth className={styles.button}>
        Войти
      </Button>

      <Divider className={styles.divider}>или</Divider>

      <Button variant="contained" fullWidth className={styles.button}>
        Войти через Google
      </Button>

      <Typography align="center" variant="body2">
        Забыли пароль?
        <Link href="#" underline="hover">
          Восстановить
        </Link>
      </Typography>
    </Box>
  )
}

export default LoginForm
