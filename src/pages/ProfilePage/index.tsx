import { useGetProfileQuery } from '../../shared/api/authApi'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store/hooks'
import { setUserData } from '../../shared/store/userSlice'
import Layout from '../../shared/ui/Layout/Layout'

const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const { data: profile, isLoading } = useGetProfileQuery()
  const user = useAppSelector((state) => state.user)

  useEffect(() => {
    if (profile) {
      dispatch(
        setUserData({
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        }),
      )
    }
  }, [profile])

  if (isLoading) return <p>Загрузка профиля...</p>

  return (
    <Layout>
      <h1>Профиль</h1>
      <p>
        <strong>Имя:</strong> {user.data?.name}
      </p>
      <p>
        <strong>Email:</strong> {user.data?.email}
      </p>
      <p>
        <strong>Роль:</strong> {user.role}
      </p>

      {user.data?.avatar && (
        <>
          <p>
            <strong>Аватар:</strong>
          </p>
          <img src={user.data.avatar} alt="avatar" width="100" />
        </>
      )}
    </Layout>
  )
}

export default ProfilePage
