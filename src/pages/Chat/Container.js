import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Avatar, List, Space, Typography, Card, Empty } from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import LayoutComponent from '../../components/Layout';
import './style.css';

const { TextArea } = Input;
const { Text } = Typography;

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Olá! Como posso ajudá-lo hoje?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: 'Esta é uma resposta automática. Integre com sua API para respostas reais.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <LayoutComponent>
      <div className="chat-container">
        <Card className="chat-card" bordered={false}>
          <div className="chat-header">
            <Space>
              <Avatar icon={<RobotOutlined />} size="large" />
              <div>
                <Text strong>Assistente Virtual</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Online
                </Text>
              </div>
            </Space>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <Empty
                description="Nenhuma mensagem ainda. Comece a conversar!"
                style={{ marginTop: '50px' }}
              />
            ) : (
              <List
                dataSource={messages}
                renderItem={(message) => (
                  <List.Item
                    className={`message-item ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
                  >
                    <Space align="start" size="small">
                      <Avatar
                        icon={message.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                        style={{
                          backgroundColor: message.sender === 'user' ? '#1890ff' : '#52c41a',
                        }}
                      />
                      <div className="message-content">
                        <div className="message-bubble">
                          <Text>{message.text}</Text>
                        </div>
                        <Text type="secondary" className="message-time">
                          {formatTime(message.timestamp)}
                        </Text>
                      </div>
                    </Space>
                  </List.Item>
                )}
              />
            )}
            {loading && (
              <List.Item className="message-item message-bot">
                <Space align="start" size="small">
                  <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
                  <div className="message-content">
                    <div className="message-bubble">
                      <Text type="secondary">Digitando...</Text>
                    </div>
                  </div>
                </Space>
              </List.Item>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input">
            <Space.Compact style={{ width: '100%' }}>
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                style={{ flex: 1 }}
              />
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                loading={loading}
                disabled={!inputValue.trim()}
                style={{ height: 'auto' }}
              >
                Enviar
              </Button>
            </Space.Compact>
          </div>
        </Card>
      </div>
    </LayoutComponent>
  );
};

export default Chat;

