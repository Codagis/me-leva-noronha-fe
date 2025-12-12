import { Card, Form, Input, Button, Typography, Alert, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Layout } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

const Login = ({
  username,
  senha,
  error,
  loading,
  onUsernameChange,
  onSenhaChange,
  onSubmit,
}) => {
  return (
    <Layout style={{ minHeight: '100vh', background: '#fafafa' }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '24px'
      }}>
        <Card
          style={{
            width: '100%',
            maxWidth: 400,
            border: '1px solid #e8e8e8',
            boxShadow: 'none',
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={2} style={{ marginBottom: 8, color: '#262626', fontWeight: 400 }}>
                Me Leva Noronha
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>Faça login para continuar</Text>
            </div>
            
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
              />
            )}
            
            <Form
              name="login"
              onFinish={(values) => {
                const fakeEvent = {
                  preventDefault: () => {}
                };
                // Passa os valores diretamente do formulário para evitar problema de estado não atualizado
                onSubmit(fakeEvent, values);
              }}
              layout="vertical"
              size="large"
            >
              <Form.Item
                label="Usuário"
                name="username"
                rules={[{ required: true, message: 'Por favor, digite seu usuário!' }]}
                initialValue={username}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Digite seu usuário"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item
                label="Senha"
                name="senha"
                rules={[{ required: true, message: 'Por favor, digite sua senha!' }]}
                initialValue={senha}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Digite sua senha"
                  disabled={loading}
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  block
                  loading={loading}
                  style={{ height: 40, borderRadius: 4 }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default Login;


