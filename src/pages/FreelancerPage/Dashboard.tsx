import { useGetOrdersQuery } from '../../shared/api/ordersApi'
import Layout from '../../shared/ui/Layout/Layout'

const FreelancerDashboard = () => {
  const { data: orders, isLoading, isError } = useGetOrdersQuery()

  return (
    <Layout>
      <h1>Список заказов</h1>

      {isLoading && <p>Загрузка...</p>}
      {isError && <p>Ошибка загрузки заказов</p>}
      {!isLoading && orders?.length === 0 && <p>Нет доступных заказов</p>}

      <ul>
        {orders?.map((order: any) => (
          <li key={order.id} style={{ marginBottom: '1rem' }}>
            <strong>{order.title}</strong>
            <p>{order.description}</p>
            <p>
              <strong>Бюджет:</strong> {order.budget} ₽
            </p>
            <p>
              <strong>Статус:</strong> {order.status}
            </p>
            <p>
              <strong>Создан:</strong>{' '}
              {new Date(order.created_at).toLocaleString('ru-RU')}
            </p>
            <p>
              <strong>Клиент ID:</strong> {order.client_id}
            </p>
            <p>
              <strong>Фрилансер ID:</strong> {order.freelancer_id || '—'}
            </p>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export default FreelancerDashboard
