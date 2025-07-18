import Layout from '../../shared/ui/Layout/Layout'
import { useGetOrdersQuery, useCreateOrderMutation, useDeleteOrderMutation } from '../../shared/api/ordersApi';
import { useAppSelector } from '../../shared/store/hooks';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import styles from './Dashboard.module.scss';

const TABS = [
  { key: 'active', label: 'Активные' },
  { key: 'deleted', label: 'Удалённые заказы' },
];

const ClientDashboard = () => {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const user = useAppSelector((state) => state.user);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [tab, setTab] = useState<'active' | 'deleted'>('active');

  const myOrders = orders.filter((order) => order.client_id === user.data?.id);
  const activeOrders = myOrders.filter((order) => !order.deleted_by_client);
  const deletedOrders = myOrders.filter((order) => order.deleted_by_client);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim() || !description.trim() || !budget.trim()) {
      setFormError('Все поля обязательны');
      return;
    }
    const budgetNum = Number(budget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      setFormError('Бюджет должен быть положительным числом');
      return;
    }
    try {
      await createOrder({ title, description, budget: budgetNum }).unwrap();
      setTitle('');
      setDescription('');
      setBudget('');
      setShowForm(false);
    } catch {
      setFormError('Ошибка при создании заказа');
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteOrder(id).unwrap();
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const ordersToShow = tab === 'active' ? activeOrders : deletedOrders;

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Панель заказчика</h1>
        <p>Здесь вы можете создать заказ</p>
        <div className={styles.tabs}>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? styles.tabActive : styles.tab}
              onClick={() => setTab(t.key as 'active' | 'deleted')}
            >
              {t.label}
            </button>
          ))}
        </div>
        {!showForm && tab === 'active' && (
          <button onClick={() => setShowForm(true)} className={styles.createBtn}>
            Создать заказ
          </button>
        )}
        {showForm && tab === 'active' && (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="Название заказа"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className={styles.input}
            />
            <textarea
              placeholder="Описание заказа"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={styles.textarea}
            />
            <input
              type="number"
              placeholder="Бюджет"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className={styles.input}
            />
            {formError && <div className={styles.formError}>{formError}</div>}
            <div className={styles.formActions}>
              <button type="submit" disabled={isCreating} className={styles.submitBtn}>
                {isCreating ? 'Создание...' : 'Создать заказ'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className={styles.cancelBtn}>
                Отмена
              </button>
            </div>
          </form>
        )}
        <h2 className={styles.ordersTitle}>{tab === 'active' ? 'Мои заказы' : 'Удалённые заказы'}</h2>
        {isLoading ? (
          <p>Загрузка заказов...</p>
        ) : error ? (
          <p>Ошибка загрузки заказов</p>
        ) : ordersToShow.length === 0 ? (
          <p>{tab === 'active' ? 'У вас пока нет заказов.' : 'Нет удалённых заказов.'}</p>
        ) : (
          <ul className={styles.ordersList}>
            {ordersToShow.map((order) => (
              <li key={order.id} className={styles.orderItem}>
                <span>
                  <span className={styles.orderTitle}>{order.title}</span>
                  <span className={styles.orderStatus}>— {order.status}</span>
                  {order.deleted_by_client && (
                    <span className={styles.deletedMark}> (Удалён)</span>
                  )}
                </span>
                {tab === 'active' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Link to={`/chat/${order.id}`} className={styles.orderChatLink}>Чат</Link>
                    <button
                      className={styles.deleteBtn}
                      onClick={() => setConfirmDeleteId(order.id)}
                      disabled={deletingId === order.id || isDeleting}
                    >
                      {deletingId === order.id ? 'Удаление...' : 'Удалить'}
                    </button>
                  </div>
                )}
                {tab === 'deleted' && (
                  <div className={styles.deletedMark}>Удалён заказчиком</div>
                )}
              </li>
            ))}
          </ul>
        )}
        {confirmDeleteId !== null && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={styles.modalTitle}>Удалить заказ?</div>
              <div className={styles.modalText}>Вы уверены, что хотите удалить этот заказ? Это действие необратимо.</div>
              <div className={styles.modalActions}>
                <button
                  className={styles.submitBtn}
                  onClick={() => handleDelete(confirmDeleteId)}
                  disabled={isDeleting}
                >
                  Да, удалить
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={isDeleting}
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ClientDashboard
