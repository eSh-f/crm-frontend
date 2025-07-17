import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DashboardRedirect = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    if (role === 'freelancer') {
      navigate('/freelancer/dashboard')
    } else if (role === 'client') {
      navigate('/client/dashboard')
    } else {
      navigate('/login')
    }
  }, [navigate])

  return null
}

export default DashboardRedirect
