import { useLocation, useNavigate } from 'react-router-dom';
import { Layout as AntLayout, Menu, Button, Typography } from 'antd';
import { 
  DashboardOutlined, 
  BulbOutlined, 
  MoonOutlined, 
  LogoutOutlined,
  CarOutlined,
  ShopOutlined,
  EnvironmentOutlined,
  BankOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

const { Header, Sider, Content } = AntLayout;
const { Title } = Typography;

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { 
      key: '/dashboard', 
      label: 'Dashboard', 
      icon: <DashboardOutlined />,
      onClick: () => navigate('/dashboard')
    },
    { 
      key: '/dicas', 
      label: 'Dicas', 
      icon: <BulbOutlined />,
      onClick: () => navigate('/dicas')
    },
    { 
      key: '/vida-noturna', 
      label: 'Vida Noturna', 
      icon: <MoonOutlined />,
      onClick: () => navigate('/vida-noturna')
    },
    { 
      key: '/passeios', 
      label: 'Passeios', 
      icon: <CarOutlined />,
      onClick: () => navigate('/passeios')
    },
    { 
      key: '/restaurantes', 
      label: 'Restaurantes', 
      icon: <ShopOutlined />,
      onClick: () => navigate('/restaurantes')
    },
    { 
      key: '/pontos-interesse', 
      label: 'Pontos de Interesse', 
      icon: <EnvironmentOutlined />,
      onClick: () => navigate('/pontos-interesse')
    },
    { 
      key: '/aeroportos', 
      label: 'Aeroportos', 
      icon: <BankOutlined />,
      onClick: () => navigate('/aeroportos')
    },
  ];

  return (
    <AntLayout style={{ minHeight: '100vh', background: '#ffffff' }}>
      <Sider 
        width={240} 
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#ffffff',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div style={{ 
          padding: '24px 20px', 
          borderBottom: '1px solid #f0f0f0',
          textAlign: 'center'
        }}>
          <Title level={4} style={{ margin: 0, color: '#262626', fontWeight: 500 }}>
            Me Leva Noronha
          </Title>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ borderRight: 0, marginTop: 16 }}
        />
        <div style={{ 
          padding: '16px', 
          borderTop: '1px solid #f0f0f0',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          background: '#ffffff'
        }}>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            block
            style={{ height: 40, color: '#595959' }}
          >
            Sair
          </Button>
        </div>
      </Sider>
      <AntLayout style={{ marginLeft: 240, background: '#fafafa' }}>
        <Content style={{ 
          margin: '24px 16px', 
          background: '#ffffff',
          minHeight: 280,
          borderRadius: '4px',
          padding: '24px',
        }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;

