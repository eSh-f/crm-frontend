import React from 'react';
import { useGetOrdersQuery } from '../../shared/api/ordersApi';
import { useAppSelector } from '../../shared/store/hooks';
import Layout from '../../shared/ui/Layout/Layout';
import styles from '../MyOrdersPage/styles/MyOrdersPage.module.scss';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();
  const user = useAppSelector((state) => state.user);

  if (isLoading) return <Layout><p>Загрузка заказов...</p></Layout>;
  if (error) return <Layout><p>Ошибка загрузки заказов</p></Layout>;
  if (!user.data) return <Layout><p>Нет данных пользователя</p></Layout>;

  let myOrders = [];
  if (user.role === 'client') {
    myOrders = orders.filter((order) => order.client_id === user.data!.id);
  } else if (user.role === 'freelancer') {
    myOrders = orders.filter((order) => order.freelancer_id === user.data!.id);
  }

  return (
    <Layout>
      <h1 className={styles.ordersTitle}>Мои заказы</h1>
      {myOrders.length === 0 ? (
        <p className={styles.ordersEmpty}>У вас пока нет заказов.</p>
      ) : (
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Бюджет</th>
              <th>Статус</th>
              <th>Чат</th>
            </tr>
          </thead>
          <tbody>
            {myOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.title}</td>
                <td>{order.description}</td>
                <td>{order.budget}</td>
                <td>{order.status}</td>
                <td><Link to={`/chat/${order.id}`}>Чат</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default MyOrdersPage;