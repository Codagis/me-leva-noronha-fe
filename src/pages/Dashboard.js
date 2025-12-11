import { Card, Typography, Space } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import Layout from '../components/Layout';

const { Title, Paragraph } = Typography;

const Dashboard = () => {
  return (
    <Layout>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card bordered={false} style={{ boxShadow: 'none' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%', textAlign: 'center' }}>
            <SmileOutlined style={{ fontSize: 48, color: '#8c8c8c' }} />
            <Title level={2} style={{ fontWeight: 400, color: '#262626', marginBottom: 8 }}>
              Bem-vindo!
            </Title>
            <Paragraph style={{ fontSize: 14, color: '#8c8c8c', margin: 0 }}>
              Você está autenticado no sistema Me Leva Noronha.
            </Paragraph>
          </Space>
        </Card>
      </Space>
    </Layout>
  );
};

export default Dashboard;

