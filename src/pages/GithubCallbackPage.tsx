import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const GithubCallbackPage = () => {
  const navigate = useNavigate()
  const requested = useRef(false)

  useEffect(() => {
    if (requested.current) return
    requested.current = true

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      fetch('http://localhost:5000/api/auth/github/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.token) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('role', data.user.role)
            navigate('/dashboard')
          } else {
            alert('Ошибка авторизации через GitHub')
            navigate('/login')
          }
        })
    } else {
      alert('Нет кода авторизации')
      navigate('/login')
    }
  }, [navigate])

  return <div>Авторизация через GitHub...</div>
}

export default GithubCallbackPage 