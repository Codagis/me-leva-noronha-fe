import { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Upload, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Spin,
  Empty,
  Tag,
  Select,
  Popconfirm
} from 'antd';
import { 
  ReloadOutlined, 
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  WhatsAppOutlined
} from '@ant-design/icons';
import ImageWithAuth from '../../components/ImageWithAuth';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const Restaurante = ({
  restaurantes,
  loading,
  showForm,
  selectedRestaurante,
  editingRestaurante,
  formData,
  imageRefreshKey,
  categoriaFiltro,
  validationErrors,
  onInputChange,
  onFileChange,
  onCategoriaFiltroChange,
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
      if (!editingRestaurante) {
        form.resetFields();
      } else if (editingRestaurante) {
        const values = {
          nome: editingRestaurante.nome || '',
          descricao: editingRestaurante.descricao || '',
          numeroWhatsapp: editingRestaurante.numeroWhatsapp || '',
          categoria: editingRestaurante.categoria || 'ECONOMICO',
        };
        form.setFieldsValue(values);
      }
    } else {
      form.resetFields();
    }
  }, [showForm, editingRestaurante, form]);

  useEffect(() => {
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      const fields = Object.keys(validationErrors).map(field => ({
        name: field,
        errors: [validationErrors[field]],
      }));
      form.setFields(fields);
    }
  }, [validationErrors, form]);

  const handleFormSubmit = (values) => {
    const formValues = {
      nome: values.nome || '',
      descricao: values.descricao || '',
      numeroWhatsapp: values.numeroWhatsapp || '',
      categoria: values.categoria || 'ECONOMICO',
    };
    
    onInputChange({ target: { name: 'nome', value: formValues.nome } });
    onInputChange({ target: { name: 'descricao', value: formValues.descricao } });
    onInputChange({ target: { name: 'numeroWhatsapp', value: formValues.numeroWhatsapp } });
    onInputChange({ target: { name: 'categoria', value: formValues.categoria } });
    
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
        <Title level={2} style={{ margin: 0, fontWeight: 400, color: '#262626' }}>Restaurantes</Title>
        <Space>
          <Select
            placeholder="Filtrar por categoria"
            allowClear
            style={{ width: 200 }}
            value={categoriaFiltro}
            onChange={onCategoriaFiltroChange}
          >
            <Option value="ECONOMICO">$ Econômico</Option>
            <Option value="MODERADO">$$ Moderado</Option>
            <Option value="SOFISTICADO">$$$ Sofisticado</Option>
            <Option value="PREMIUM">$$$$ Premium</Option>
          </Select>
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
            {editingRestaurante ? 'Editar Restaurante' : 'Novo Restaurante'}
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
          key={editingRestaurante ? `edit-${editingRestaurante.id}` : 'new'}
          initialValues={editingRestaurante ? {
            nome: editingRestaurante.nome || formData.nome || '',
            descricao: editingRestaurante.descricao || formData.descricao || '',
            numeroWhatsapp: editingRestaurante.numeroWhatsapp || formData.numeroWhatsapp || '',
            categoria: editingRestaurante.categoria || formData.categoria || 'ECONOMICO',
          } : {
            nome: '',
            descricao: '',
            numeroWhatsapp: '',
            categoria: 'ECONOMICO',
          }}
        >
          <Form.Item
            label="Nome"
            name="nome"
            validateStatus={validationErrors?.nome ? 'error' : ''}
            help={validationErrors?.nome}
            rules={[
              { required: true, message: 'Por favor, digite o nome!' },
              { max: 150, message: 'O nome deve ter no máximo 150 caracteres!' }
            ]}
          >
            <Input
              placeholder="Digite o nome do restaurante"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Descrição"
            name="descricao"
            validateStatus={validationErrors?.descricao ? 'error' : ''}
            help={validationErrors?.descricao}
            rules={[
              { required: true, message: 'Por favor, digite a descrição!' },
              { max: 1000, message: 'A descrição deve ter no máximo 1000 caracteres!' }
            ]}
          >
            <TextArea
              rows={5}
              placeholder="Digite a descrição"
              disabled={loading}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Número WhatsApp"
                name="numeroWhatsapp"
                validateStatus={validationErrors?.numeroWhatsapp ? 'error' : ''}
                help={validationErrors?.numeroWhatsapp}
                rules={[
                  { required: true, message: 'Por favor, digite o número do WhatsApp!' },
                  { max: 11, message: 'Número de WhatsApp não pode exceder 11 caracteres!' }
                ]}
              >
                <Input
                  placeholder="Ex: 5581987654321"
                  disabled={loading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Categoria"
                name="categoria"
                validateStatus={validationErrors?.categoria ? 'error' : ''}
                help={validationErrors?.categoria}
                rules={[{ required: true, message: 'Por favor, selecione a categoria!' }]}
              >
                <Select
                  disabled={loading}
                >
                  <Option value="ECONOMICO">$ Econômico</Option>
                  <Option value="MODERADO">$$ Moderado</Option>
                  <Option value="SOFISTICADO">$$$ Sofisticado</Option>
                  <Option value="PREMIUM">$$$$ Premium</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={`Imagem ${editingRestaurante ? '(opcional)' : ''}`}
            name="imagem"
            rules={!editingRestaurante ? [{ required: true, message: 'Por favor, selecione uma imagem!' }] : []}
          >
            <Upload
              accept="image/*"
              beforeUpload={(file) => {
                onFileChange({ target: { name: 'imagem', files: [file] } });
                return false;
              }}
              maxCount={1}
              disabled={loading}
            >
              <Button icon={<UploadOutlined />}>Selecionar Imagem</Button>
            </Upload>
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
            {selectedRestaurante?.nome}
          </span>
        }
        open={!!selectedRestaurante}
        onCancel={onCloseDetails}
        footer={[
          <Button key="close" onClick={onCloseDetails} style={{ minWidth: 100 }}>
            Fechar
          </Button>
        ]}
        width={900}
        style={{ top: 40 }}
        styles={{
          body: { padding: '32px' }
        }}
      >
        {selectedRestaurante && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 8 }}>
                Descrição:
              </Text>
              <p style={{ 
                margin: 0, 
                color: '#262626',
                lineHeight: 1.7,
                fontSize: 15
              }}>
                {selectedRestaurante.descricao}
              </p>
            </div>

            <Row gutter={16}>
              <Col span={12}>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f0f7ff', 
                  borderRadius: 6,
                  border: '1px solid #d4edda'
                }}>
                  <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 4 }}>
                    Categoria:
                  </Text>
                  <Tag>{selectedRestaurante.categoriaCifroes || selectedRestaurante.categoria}</Tag>
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
                    <WhatsAppOutlined /> WhatsApp:
                  </Text>
                  <a 
                    href={`https://wa.me/${selectedRestaurante.numeroWhatsapp}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#1890ff',
                      fontSize: 14,
                      textDecoration: 'none'
                    }}
                  >
                    {selectedRestaurante.numeroWhatsapp}
                  </a>
                </div>
              </Col>
            </Row>

            <div>
              <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 12 }}>
                Imagem:
              </Text>
              <div style={{ 
                borderRadius: 8, 
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <ImageWithAuth
                  key={`img-${selectedRestaurante.id}`}
                  src={selectedRestaurante.linkImagem}
                  alt={selectedRestaurante.nome}
                  style={{ width: '100%', display: 'block' }}
                />
              </div>
            </div>
          </Space>
        )}
      </Modal>

      {loading && !showForm && !selectedRestaurante && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && restaurantes.length === 0 && (
        <Empty description="Nenhum restaurante cadastrado ainda." />
      )}

      <Row gutter={[24, 24]}>
        {restaurantes.map((restaurante) => (
          <Col key={restaurante.id} xs={24} sm={12} lg={8} xl={6}>
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
              cover={
                <div 
                  style={{ 
                    height: 220, 
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  >
                    <ImageWithAuth
                      key={`${restaurante.id}-${imageRefreshKey}`}
                      src={restaurante.linkImagem}
                      alt={restaurante.nome}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                  }}>
                    <Tag 
                      style={{ 
                        background: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        color: '#262626',
                        fontWeight: 500,
                        fontSize: 12,
                        padding: '4px 12px',
                        borderRadius: 12,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                    >
                      {restaurante.categoriaCifroes || restaurante.categoria}
                    </Tag>
                  </div>
                </div>
              }
              actions={[
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => onViewDetails(restaurante.id)}
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
                  onClick={() => onEdit(restaurante)}
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
                  title="Excluir restaurante"
                  description="Tem certeza que deseja excluir este restaurante?"
                  onConfirm={() => onDelete(restaurante)}
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
                      {restaurante.nome}
                    </span>
                  </div>
                }
                description={
                  <div>
                    <Text 
                      ellipsis={{ tooltip: restaurante.descricao, rows: 3 }} 
                      style={{ 
                        display: 'block', 
                        color: '#8c8c8c', 
                        fontSize: 14,
                        lineHeight: 1.6,
                        marginTop: 8,
                        marginBottom: 8
                      }}
                    >
                      {restaurante.descricao}
                    </Text>
                    <div style={{ 
                      padding: '8px 12px', 
                      background: '#f0f7ff', 
                      borderRadius: 4,
                      marginTop: 8
                    }}>
                      <Text style={{ fontSize: 12, color: '#595959', display: 'block', marginBottom: 4 }}>
                        <WhatsAppOutlined /> {restaurante.numeroWhatsapp}
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

export default Restaurante;

