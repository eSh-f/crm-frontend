import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../shared/store/hooks';
import Layout from '../../shared/ui/Layout/Layout';
import { io, Socket } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api/messages';
const SOCKET_URL = 'http://localhost:5000';

let socket: Socket | null = null;

const ChatPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const user = useAppSelector((state) => state.user);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Инициализация сокета и подписка на комнату заказа
  useEffect(() => {
    if (!orderId) return;
    if (!socket) {
      socket = io(SOCKET_URL);
    }
    socket.emit('joinOrder', orderId);
    socket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket?.off('newMessage');
    };
  }, [orderId]);

  // Загрузка истории сообщений
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        setMessages(data);
      } catch (e) {
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchMessages();
  }, [orderId, user.token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !orderId || !user.data?.id) return;
    // Отправка сообщения через сокет
    socket?.emit('sendMessage', {
      order_id: Number(orderId),
      sender_id: user.data.id,
      text,
    });
    setText('');
  };

  return (
    <Layout>
      <h1>Чат по заказу #{orderId}</h1>
      <div style={{ border: '1px solid #ccc', padding: 16, height: 400, overflowY: 'auto', marginBottom: 16 }}>
        {loading ? (
          <p>Загрузка сообщений...</p>
        ) : messages.length === 0 ? (
          <p>Нет сообщений</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id || Math.random()} style={{ marginBottom: 8, textAlign: msg.sender_id === user.data?.id ? 'right' : 'left' }}>
              <b>{msg.sender_id === user.data?.id ? 'Вы' : `Пользователь #${msg.sender_id}`}</b>: {msg.text}
              <div style={{ fontSize: 10, color: '#888' }}>{new Date(msg.created_at).toLocaleString('ru-RU')}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Введите сообщение..."
          style={{ flex: 1 }}
        />
        <button type="submit">Отправить</button>
      </form>
    </Layout>
  );
};

export default ChatPage;