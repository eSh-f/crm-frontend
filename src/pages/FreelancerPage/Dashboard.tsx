import { useGetOrdersQuery, useAssignFreelancerToOrderMutation, useGetFreelancerOrdersQuery, useDeclineOrderByFreelancerMutation } from '../../shared/api/ordersApi'
import Layout from '../../shared/ui/Layout/Layout'
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../shared/store/hooks';
import { useState } from 'react';
import { useGetUserByIdQuery } from '../../shared/api/userApi'

const TABS = [
  { key: 'available', label: 'Доступные заказы' },
  { key: 'my', label: 'Мои заказы' },
];

const FreelancerDashboard = () => {
  const user = useAppSelector((state) => state.user);
  const { data: availableOrders = [], isLoading: isLoadingAvailable, isError: isErrorAvailable, refetch: refetchAvailable } = useGetOrdersQuery();
  const freelancerId = typeof user.data?.id === 'number' ? user.data.id : 0;
  const { data: myOrders = [], isLoading: isLoadingMy, isError: isErrorMy, refetch: refetchMy } = useGetFreelancerOrdersQuery(freelancerId, { skip: !user.data?.id });
  const [assignOrder, { isLoading: isAssigning }] = useAssignFreelancerToOrderMutation();
  const [declineOrder, { isLoading: isDeclining }] = useDeclineOrderByFreelancerMutation();
  const [tab, setTab] = useState<'available' | 'my'>('available');
  const [assigningId, setAssigningId] = useState<number | null>(null);
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [declineConfirmingId, setDeclineConfirmingId] = useState<number | null>(null);

  const handleAssign = async (orderId: number) => {
    if (!user.data?.id) return;
    setAssigningId(orderId);
    try {
      await assignOrder({ orderId, freelancer_id: user.data.id }).unwrap();
      await refetchAvailable();
      await refetchMy();
    } finally {
      setAssigningId(null);
      setConfirmingId(null);
    }
  };

  const handleDecline = async (orderId: number) => {
    try {
      await declineOrder(orderId).unwrap();
      await refetchAvailable();
      await refetchMy();
    } finally {
      setDeclineConfirmingId(null);
    }
  };

  const ordersToShow = tab === 'available' ? availableOrders : myOrders;
  const isLoading = tab === 'available' ? isLoadingAvailable : isLoadingMy;
  const isError = tab === 'available' ? isErrorAvailable : isErrorMy;

  return (
    <Layout>
      <h1>Заказы</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            style={{
              background: tab === t.key ? '#2d72d9' : '#f2f4f8',
              color: tab === t.key ? '#fff' : '#333',
              fontWeight: tab === t.key ? 600 : 400,
              border: 'none',
              borderRadius: '6px 6px 0 0',
              padding: '8px 18px',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'background 0.18s',
            }}
            onClick={() => setTab(t.key as 'available' | 'my')}
          >
            {t.label}
          </button>
        ))}
      </div>
      {isLoading && <p>Загрузка...</p>}
      {isError && <p>Ошибка загрузки заказов</p>}
      {!isLoading && ordersToShow.length === 0 && <p>{tab === 'available' ? 'Нет доступных заказов' : 'У вас пока нет заказов в работе'}</p>}
      <ul>
        {ordersToShow.map((order: any) => {
          return (
            <li key={order.id} style={{ marginBottom: '1rem', background: '#fff', borderRadius: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.03)', padding: '12px 16px' }}>
              <strong>{order.title}</strong>
              <p>{order.description}</p>
              <p>
                <strong>Бюджет:</strong> {order.budget} ₽
              </p>
              <p>
                <strong>Статус:</strong> {order.status}
                {order.deleted_by_client && (
                  <span style={{ color: '#e53935', marginLeft: 8 }}>(Удалён заказчиком)</span>
                )}
              </p>
              <p>
                <strong>Создан:</strong>{' '}
                {new Date(order.created_at).toLocaleString('ru-RU')}
              </p>
              <p>
                <strong>Заказчик:</strong> {order.client_name}
              </p>
              <p>
                <Link to={`/chat/${order.id}`}>Чат</Link>
              </p>
              {tab === 'available' && (
                confirmingId === order.id ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      onClick={() => handleAssign(order.id)}
                      disabled={!user.data?.id || (isAssigning && assigningId === order.id)}
                      style={{ background: '#2d72d9', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      {isAssigning && assigningId === order.id ? 'Взятие...' : 'Подтвердить'}
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      style={{ background: '#f2f4f8', color: '#333', border: 'none', borderRadius: 4, padding: '8px 18px', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      Отмена
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmingId(order.id)}
                    disabled={!user.data?.id || (isAssigning && assigningId === order.id)}
                    style={{ background: '#2d72d9', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontSize: '1rem', cursor: 'pointer' }}
                  >
                    Взять в работу
                  </button>
                )
              )}
              {tab === 'my' && (
                declineConfirmingId === order.id ? (
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      onClick={() => handleDecline(order.id)}
                      disabled={isDeclining}
                      style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      {isDeclining ? 'Отказ...' : 'Подтвердить'}
                    </button>
                    <button
                      onClick={() => setDeclineConfirmingId(null)}
                      style={{ background: '#f2f4f8', color: '#333', border: 'none', borderRadius: 4, padding: '8px 18px', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      Отмена
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeclineConfirmingId(order.id)}
                    disabled={isDeclining}
                    style={{ background: '#e53935', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontSize: '1rem', cursor: 'pointer', marginLeft: 8 }}
                  >
                    Отказаться
                  </button>
                )
              )}
            </li>
          );
        })}
      </ul>
    </Layout>
  )
}

export default FreelancerDashboard
