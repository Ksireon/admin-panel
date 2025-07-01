'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const MONGODB_URI = 'mongodb+srv://cvlwn:22377322@cluster0.1qwsr0h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('openlessons');
  const [data, setData] = useState({
    openlessons: [],
    otkritiyuroks: [],
    turs: [],
    reviews: [],
    completedrequests: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from MongoDB via API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/clients');
        const result = await response.json();
        
        if (result.success) {
          // Transform MongoDB data to match our component structure
          const transformedData = {
            openlessons: result.data.openlessons.map(item => ({
              id: item._id,
              name: item.firsName || 'N/A',
              number: item.number || 'N/A',
              status: item.status || 'pending',
              requestType: 'openlessons'
            })),
            otkritiyuroks: result.data.otkritiyuroks.map(item => ({
              id: item._id,
              name: item.firsName || 'N/A',
              urok: item.urok || 'N/A',
              number: item.number || 'N/A',
              status: item.status || 'pending',
              requestType: 'OtkritiyUrok'
            })),
            turs: result.data.turs.map(item => ({
              id: item._id,
              name: item.firsName || 'N/A',
              number: item.number || 'N/A',
              urok: item.urok || 'N/A',
              status: item.status || 'pending',
              requestType: 'Tur'
            })),
            reviews: result.data.reviews.map(item => ({
              id: item._id,
              name: item.firsName || 'N/A',
              number: item.number || 'N/A',
              review: item.review || 'N/A',
              status: item.status || 'pending',
              requestType: 'review'
            })),
            completedrequests: [
              ...result.data.openlessons.filter(item => item.status === 'done').map(item => ({
                id: item._id,
                name: item.firsName || 'N/A',
                number: item.number || 'N/A',
                status: 'done',
                requestType: 'openlessons'
              })),
              ...result.data.otkritiyuroks.filter(item => item.status === 'done').map(item => ({
                id: item._id,
                name: item.firsName || 'N/A',
                urok: item.urok || 'N/A',
                number: item.number || 'N/A',
                status: 'done',
                requestType: 'OtkritiyUrok'
              })),
              ...result.data.turs.filter(item => item.status === 'done').map(item => ({
                id: item._id,
                name: item.firsName || 'N/A',
                number: item.number || 'N/A',
                urok: item.urok || 'N/A',
                status: 'done',
                requestType: 'Tur'
              })),
              ...result.data.reviews.filter(item => item.status === 'done').map(item => ({
                id: item._id,
                name: item.firsName || 'N/A',
                number: item.number || 'N/A',
                review: item.review || 'N/A',
                status: 'done',
                requestType: 'Review'
              }))
            ]
          };
          setData(transformedData);
        } else {
          // Fallback to mock data if API fails
          setData({
            openlessons: [
              {
                id: 'mock1',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1234567890',
                date: '2024-01-15',
                time: '10:00 AM',
                subject: 'Mathematics',
                status: 'pending'
              }
            ],
            otkritiyuroks: [
              {
                id: 'mock2',
                name: 'Alice Johnson',
                email: 'alice@example.com',
                phone: '+1234567892',
                inquiry: 'Admission requirements',
                date: '2024-01-14',
                status: 'new'
              }
            ],
            turs: [
              {
                id: 'mock3',
                name: 'Carol Brown',
                email: 'carol@example.com',
                phone: '+1234567894',
                date: '2024-01-17',
                time: '11:00 AM',
                visitors: 2,
                status: 'scheduled'
              }
            ],
            reviews: [
              {
                id: 'mock4',
                name: 'Emma Davis',
                email: 'emma@example.com',
                rating: 5,
                comment: 'Excellent school with great teachers!',
                date: '2024-01-12',
                status: 'approved'
              }
            ]
          });
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data from database');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'approved':
      case 'scheduled':
        return '#10b981';
      case 'pending':
      case 'new':
        return '#f59e0b';
      case 'responded':
        return '#3b82f6';
      case 'done':
        return '#059669';
      default:
        return '#6b7280';
    }
  };

  const closeClient = async (requestId, requestType) => {
    try {
      const response = await fetch('https://web-production-340a1.up.railway.app/completed-requests/mark-done', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestType: requestType === 'openlessons' ? 'OpenLessons' : 
                      requestType === 'otkritiyurok' ? 'Otkritiyurok' :
                      requestType === 'tur' ? 'Tur' :
                      requestType === 'review' ? 'Review' : requestType,
          requestId: requestId
        })
      });

      if (response.ok) {
        // Refresh data after successful update
        const fetchResponse = await fetch('/api/clients');
        const result = await fetchResponse.json();
        
        if (result.success) {
          const transformedData = {
            openlessons: result.data.openlessons.map(item => ({
              id: item._id,
              name: item.firsName || 'N/A',
              number: item.number || 'N/A',
              status: item.status || 'pending',
              requestType: 'openlessons'
            })),
            otkritiyuroks: result.data.otkritiyuroks.map(item => ({
              id: item._id,
              name: item.firsName || 'N/A',
              urok: item.urok || 'N/A',
              number: item.number || 'N/A',
              status: item.status || 'new',
              requestType: 'otkritiyurok'
            })),
            turs: result.data.turs.map(item => ({
              id: item._id,
              name: item.firsName || 'N/A',
              number: item.number || 'N/A',
              urok: item.urok || 'N/A',
              status: item.status || 'pending',
              requestType: 'tur'
            })),
            reviews: result.data.reviews.map(item => ({
              id: item._id,
              name: item.firsName || 'N/A',
              number: item.number || 'N/A',
              review: item.review || 'N/A',
              status: item.status || 'pending',
              requestType: 'review'
            })),
            completedrequests: [
              ...result.data.openlessons.filter(item => item.status === 'done').map(item => ({
                id: item._id,
                name: item.firsName || 'N/A',
                number: item.number || 'N/A',
                status: 'done',
                requestType: 'openlessons'
              })),
              ...result.data.otkritiyuroks.filter(item => item.status === 'done').map(item => ({
                id: item._id,
                name: item.firsName || 'N/A',
                urok: item.urok || 'N/A',
                number: item.number || 'N/A',
                status: 'done',
                requestType: 'otkritiyurok'
              })),
              ...result.data.turs.filter(item => item.status === 'done').map(item => ({
                id: item._id,
                name: item.firsName || 'N/A',
                number: item.number || 'N/A',
                urok: item.urok || 'N/A',
                status: 'done',
                requestType: 'tur'
              })),
              ...result.data.reviews.filter(item => item.status === 'done').map(item => ({
                id: item._id,
                name: item.firsName || 'N/A',
                number: item.number || 'N/A',
                review: item.review || 'N/A',
                status: 'done',
                requestType: 'review'
              }))
            ]
          };
          setData(transformedData);
        }
      } else {
        console.error('Failed to close client');
        alert('Ошибка при закрытии клиента');
      }
    } catch (error) {
      console.error('Error closing client:', error);
      alert('Ошибка при закрытии клиента');
    }
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      );
    }

    const currentData = data[activeTab];

    if (!currentData || currentData.length === 0) {
      return (
        <div className={styles.empty}>
          <p>No data available for this category</p>
        </div>
      );
    }

    return (
      <div className={styles.dataGrid}>
        {currentData.map((item) => (
          <div key={item.id} className={styles.dataCard}>
            <div className={styles.cardHeader}>
              <h3>{item.name}</h3>
              <span 
                className={styles.status}
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {item.status}
              </span>
            </div>
            <div className={styles.cardContent}>
              <p><strong>ID:</strong> {item.id}</p>
              
              {activeTab === 'openlessons' && (
                <>
                <p><strong>Phone:</strong> {item.number}</p>
                </>
              )}
              
              {activeTab === 'otkritiyuroks' && (
                <>
                <p><strong>Phone:</strong> {item.number}</p>
                <p><strong>Age:</strong> {item.urok}</p>
                </>
              )}
              
              {activeTab === 'turs' && (
                <>
                <p><strong>Phone:</strong> {item.number}</p>
                </>
              )}
              
              {activeTab === 'reviews' && (
                <>
                  <p><strong>Review:</strong> {item.review}</p>
                </>
              )}
              
              {activeTab === 'completedrequests' && (
                <>
                  <p><strong>Phone:</strong> {item.number}</p>
                  <p><strong>Request Type:</strong> {item.requestType}</p>
                  {item.urok && <p><strong>Age:</strong> {item.urok}</p>}
                  {item.review && <p><strong>Review:</strong> {item.review}</p>}
                </>
              )}
            </div>
            
            {activeTab !== 'completedrequests' && item.status !== 'done' && (
              <div className={styles.cardActions}>
                <button 
                  className={styles.closeButton}
                  onClick={() => closeClient(item.id, item.requestType)}
                >
                  Закрыть клиента
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const tabs = [
    { id: 'openlessons', label: 'Запись на консультацию', count: data.openlessons.length },
    { id: 'otkritiyuroks', label: 'Кто хочет подробнее узнать о школе', count: data.otkritiyuroks.length },
    { id: 'turs', label: 'Запись на собеседование', count: data.turs.length },
    { id: 'reviews', label: 'Отзывы', count: data.reviews.length },
    { id: 'completedrequests', label: 'Закрытые клиенты', count: data.completedrequests.length }
  ];

  return (
    <div className={styles.adminPanel}>
      <header className={styles.header}>
        <h1>Admin Panel - Client Management</h1>
        <p>Manage client information and requests</p>
      </header>

      <nav className={styles.tabNavigation}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className={styles.count}>{tab.count}</span>
          </button>
        ))}
      </nav>

      <main className={styles.content}>
        {renderTabContent()}
      </main>

      <footer className={styles.footer}>
        <p>Connected to MongoDB: {MONGODB_URI.split('@')[1].split('/')[0]}</p>
      </footer>
    </div>
  );
}