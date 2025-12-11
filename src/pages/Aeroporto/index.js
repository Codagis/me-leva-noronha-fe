import { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Spin,
  Empty,
  Tag,
  Popconfirm
} from 'antd';
import { 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  EnvironmentOutlined,
  BankOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Aeroporto = ({
  aeroportos,
  loading,
  showForm,
  selectedAeroporto,
  editingAeroporto,
  formData,
  onInputChange,
  onSubmit,
  onShowForm,
  onCloseForm,
  onViewDetails,
  onCloseDetails,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (showForm) {
      if (!editingAeroporto) {
        form.resetFields();
      } else if (editingAeroporto) {
        const values = {
          cidade: editingAeroporto.cidade || '',
          nomeAeroporto: editingAeroporto.nomeAeroporto || '',
          codigoIATA: editingAeroporto.codigoIATA || '',
        };
        form.setFieldsValue(values);
      }
    } else {
      form.resetFields();
    }
  }, [showForm, editingAeroporto, form]);

  const handleFormSubmit = (values) => {
    const formValues = {
      cidade: values.cidade || '',
      nomeAeroporto: values.nomeAeroporto || '',
      codigoIATA: values.codigoIATA?.toUpperCase() || '',
    };
    
    onInputChange({ target: { name: 'cidade', value: formValues.cidade } });
    onInputChange({ target: { name: 'nomeAeroporto', value: formValues.nomeAeroporto } });
    onInputChange({ target: { name: 'codigoIATA', value: formValues.codigoIATA } });
    
    const fakeEvent = {
      preventDefault: () => {}
    };
    
    onSubmit(fakeEvent, formValues);
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24
      }}>
        <Title level={2} style={{ margin: 0, fontWeight: 400, color: '#262626' }}>Aeroportos</Title>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={onRefresh} 
            loading={loading}
          >
            Atualizar
          </Button>
          <Button 
            type="primary" 
            onClick={onShowForm}
          >
            Adicionar
          </Button>
        </Space>
      </div>

      <Modal
        title={
          <span style={{ fontSize: 20, fontWeight: 500, color: '#262626' }}>
            {editingAeroporto ? 'Editar Aeroporto' : 'Novo Aeroporto'}
          </span>
        }
        open={showForm}
        onCancel={onCloseForm}
        footer={null}
        width={700}
        style={{ top: 40 }}
        styles={{
          body: { padding: '32px' }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          preserve={false}
          key={editingAeroporto ? `edit-${editingAeroporto.id}` : 'new'}
          initialValues={editingAeroporto ? {
            cidade: editingAeroporto.cidade || formData.cidade || '',
            nomeAeroporto: editingAeroporto.nomeAeroporto || formData.nomeAeroporto || '',
            codigoIATA: editingAeroporto.codigoIATA || formData.codigoIATA || '',
          } : {
            cidade: '',
            nomeAeroporto: '',
            codigoIATA: '',
          }}
        >
          <Form.Item
            label="Cidade"
            name="cidade"
            rules={[
              { required: true, message: 'Por favor, digite a cidade!' },
              { max: 200, message: 'A cidade deve ter no máximo 200 caracteres!' }
            ]}
          >
            <Input
              placeholder="Ex: Recife (PE)"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Nome do Aeroporto"
            name="nomeAeroporto"
            rules={[
              { required: true, message: 'Por favor, digite o nome do aeroporto!' },
              { max: 300, message: 'O nome do aeroporto deve ter no máximo 300 caracteres!' }
            ]}
          >
            <Input
              placeholder="Ex: Aeroporto Internacional do Recife/Guararapes"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Código IATA"
            name="codigoIATA"
            rules={[
              { required: true, message: 'Por favor, digite o código IATA!' },
              { len: 3, message: 'O código IATA deve ter exatamente 3 caracteres!' },
              { pattern: /^[A-Z]{3}$/, message: 'O código IATA deve conter apenas letras maiúsculas!' }
            ]}
          >
            <Input
              placeholder="Ex: REC"
              disabled={loading}
              maxLength={3}
              style={{ textTransform: 'uppercase' }}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
                form.setFieldsValue({ codigoIATA: value });
                onInputChange({ target: { name: 'codigoIATA', value } });
              }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button 
                onClick={onCloseForm} 
                disabled={loading}
                style={{ minWidth: 100 }}
              >
                Cancelar
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ minWidth: 100 }}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <span style={{ fontSize: 20, fontWeight: 500, color: '#262626' }}>
            {selectedAeroporto?.nomeAeroporto}
          </span>
        }
        open={!!selectedAeroporto}
        onCancel={onCloseDetails}
        footer={[
          <Button key="close" onClick={onCloseDetails} style={{ minWidth: 100 }}>
            Fechar
          </Button>
        ]}
        width={700}
        style={{ top: 40 }}
        styles={{
          body: { padding: '32px' }
        }}
      >
        {selectedAeroporto && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f0f7ff', 
                  borderRadius: 6,
                  border: '1px solid #d4edda'
                }}>
                  <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 4 }}>
                    Cidade:
                  </Text>
                  <Text>{selectedAeroporto.cidade}</Text>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f0f7ff', 
                  borderRadius: 6,
                  border: '1px solid #d4edda'
                }}>
                  <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 4 }}>
                    Código IATA:
                  </Text>
                  <Tag color="blue" style={{ fontSize: 14, padding: '4px 8px' }}>
                    {selectedAeroporto.codigoIATA}
                  </Tag>
                </div>
              </Col>
            </Row>

            <div style={{ 
              padding: '12px 16px', 
              background: '#f0f7ff', 
              borderRadius: 6,
              border: '1px solid #d4edda'
            }}>
              <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 4 }}>
                <BankOutlined /> Nome do Aeroporto:
              </Text>
              <Text>{selectedAeroporto.nomeAeroporto}</Text>
            </div>
          </Space>
        )}
      </Modal>

      {loading && !showForm && !selectedAeroporto && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && aeroportos.length === 0 && (
        <Empty description="Nenhum aeroporto cadastrado ainda." />
      )}

      <Row gutter={[24, 24]}>
        {aeroportos.map((aeroporto) => (
          <Col key={aeroporto.id} xs={24} sm={12} lg={8} xl={6}>
            <Card
              hoverable
              bordered={false}
              style={{ 
                borderRadius: 8, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              bodyStyle={{ 
                padding: '20px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}
              actions={[
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => onViewDetails(aeroporto)}
                  key="view"
                  style={{ 
                    color: '#595959',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1890ff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                >
                  Ver
                </Button>,
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(aeroporto)}
                  key="edit"
                  style={{ 
                    color: '#595959',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1890ff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#595959'}
                >
                  Editar
                </Button>,
                <Popconfirm
                  title="Excluir aeroporto"
                  description="Tem certeza que deseja excluir este aeroporto?"
                  onConfirm={() => onDelete(aeroporto)}
                  okText="Sim"
                  cancelText="Não"
                  key="delete"
                >
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                  >
                    Excluir
                  </Button>
                </Popconfirm>
              ]}
            >
              <Card.Meta
                title={
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ 
                      fontWeight: 600, 
                      color: '#262626',
                      fontSize: 16,
                      lineHeight: 1.4,
                      display: 'block'
                    }}>
                      {aeroporto.nomeAeroporto}
                    </span>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Tag color="blue">{aeroporto.codigoIATA}</Tag>
                      <Tag>{aeroporto.cidade}</Tag>
                    </div>
                  </div>
                }
                description={
                  <div>
                    <div style={{ 
                      padding: '8px 12px', 
                      background: '#f0f7ff', 
                      borderRadius: 4,
                      marginTop: 8
                    }}>
                      <Text style={{ fontSize: 12, color: '#595959' }}>
                        <EnvironmentOutlined /> {aeroporto.cidade}
                      </Text>
                    </div>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Aeroporto;

