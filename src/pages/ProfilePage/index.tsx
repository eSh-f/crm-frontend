import { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } from '../../shared/api/userApi'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../shared/store/hooks'
import { setUserData } from '../../shared/store/userSlice'
import Layout from '../../shared/ui/Layout/Layout'

const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const { data: profile, isLoading } = useGetProfileQuery(undefined)
  const [updateProfile] = useUpdateProfileMutation()
  const [changePassword] = useChangePasswordMutation()
  const user = useAppSelector(state => state.user)

  const [form, setForm] = useState({
    name: '',
    email: '',
    github_username: '',
    avatar: null as File | null,
  })
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
  })
  const [profileMsg, setProfileMsg] = useState('')
  const [passwordMsg, setPasswordMsg] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    if (profile) {
      dispatch(
        setUserData({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          avatar: profile.avatar,
        })
      )
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        github_username: profile.github_username || '',
        avatar: null,
      })
    }
  }, [profile])

  if (isLoading) return <p>Загрузка профиля...</p>

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target
    if (name === 'avatar' && files) {
      setForm((prev) => ({ ...prev, avatar: files[0] }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg('')
    try {
      const data: any = { ...form }
      if (!form.avatar) delete data.avatar
      const res = await updateProfile(data).unwrap()
      dispatch(setUserData({
        id: res.id,
        name: res.name,
        email: res.email,
        avatar: res.avatar,
      }))
      setProfileMsg('Данные обновлены')
      setEditMode(false)
    } catch (err: any) {
      setProfileMsg(err?.data?.error || 'Ошибка обновления')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg('')
    try {
      await changePassword(passwordForm).unwrap()
      setPasswordMsg('Пароль изменён')
      setPasswordForm({ oldPassword: '', newPassword: '' })
      setShowPasswordForm(false)
    } catch (err: any) {
      setPasswordMsg(err?.data?.error || 'Ошибка смены пароля')
    }
  }

  const handlePasswordCancel = () => {
    setShowPasswordForm(false)
    setPasswordForm({ oldPassword: '', newPassword: '' })
    setPasswordMsg('')
  }

  const handleCancel = () => {
    setEditMode(false)
    if (profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        github_username: profile.github_username || '',
        avatar: null,
      })
    }
    setProfileMsg('')
  }

  return (
    <Layout>
      <h1>Профиль</h1>
      {!editMode ? (
        <div style={{ maxWidth: 400 }}>
          <div>
            <strong>Имя:</strong> {user.data?.name}
          </div>
          <div>
            <strong>Email:</strong> {user.data?.email}
          </div>
          <div>
            <strong>GitHub:</strong> {profile?.github_username || '-'}
          </div>
          <div>
            <strong>ID:</strong> {user.data?.id}
          </div>
          <div>
            <strong>Роль:</strong> {user.role}
          </div>
          {user.data?.avatar && (
            <div>
              <strong>Аватар:</strong>
              <div><img src={user.data.avatar} alt="avatar" width="100" /></div>
            </div>
          )}
          {profile?.github_profile && (
            <div style={{ marginTop: 16, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={profile.github_profile.avatar_url} alt="github avatar" width="48" height="48" style={{ borderRadius: '50%' }} />
                <div>
                  <a href={profile.github_profile.html_url} target="_blank" rel="noopener noreferrer">
                    {profile.github_profile.login}
                  </a>
                  <div style={{ fontSize: 12, color: '#888' }}>{profile.github_profile.bio}</div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 14 }}>
                <span>Публичных репозиториев: {profile.github_profile.public_repos}</span><br />
                <span>Подписчиков: {profile.github_profile.followers}</span>
              </div>
            </div>
          )}
          <button onClick={() => setEditMode(true)}>Редактировать</button>
        </div>
      ) : (
        <form onSubmit={handleProfileSubmit} style={{ maxWidth: 400 }}>
          <div>
            <label>Имя:</label>
            <input name="name" value={form.name} onChange={handleProfileChange} />
          </div>
          <div>
            <label>Email:</label>
            <input name="email" value={form.email} onChange={handleProfileChange} />
          </div>
          <div>
            <label>GitHub:</label>
            <input name="github_username" value={form.github_username} onChange={handleProfileChange} />
          </div>
          <div>
            <label>Аватар:</label>
            <input name="avatar" type="file" accept="image/*" onChange={handleProfileChange} />
          </div>
          <button type="submit">Сохранить</button>
          <button type="button" onClick={handleCancel} style={{ marginLeft: 8 }}>Отмена</button>
          {profileMsg && <div>{profileMsg}</div>}
        </form>
      )}

      <div style={{ maxWidth: 400, marginTop: 32 }}>
        {!showPasswordForm ? (
          <button onClick={() => setShowPasswordForm(true)}>Сменить пароль</button>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <div>
              <label>Старый пароль:</label>
              <input name="oldPassword" type="password" value={passwordForm.oldPassword} onChange={handlePasswordChange} />
            </div>
            <div>
              <label>Новый пароль:</label>
              <input name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordChange} />
            </div>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={handlePasswordCancel} style={{ marginLeft: 8 }}>Отмена</button>
            {passwordMsg && <div>{passwordMsg}</div>}
          </form>
        )}
      </div>
    </Layout>
  )
}

export default ProfilePage
