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
  Popconfirm
} from 'antd';
import { useEffect } from 'react';
import { 
  PlusOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined
} from '@ant-design/icons';
import ImageWithAuth from '../../components/ImageWithAuth';

const { Title, Text } = Typography;
const { TextArea } = Input;

const Dica = ({
  dicas,
  loading,
  showForm,
  selectedDica,
  editingDica,
  formData,
  imageRefreshKey,
  validationErrors,
  onInputChange,
  onFileChange,
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
      if (!editingDica) {
        form.resetFields();
      } else if (editingDica) {
        const values = {
          tag: editingDica.tag || '',
          titulo: editingDica.titulo || '',
          descricao: editingDica.descricao || '',
          numeroWhatsapp: editingDica.linkWhatsapp || '',
        };
        form.setFieldsValue(values);
      }
    } else {
      form.resetFields();
    }
  }, [showForm, editingDica, form]);

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
      tag: values.tag || '',
      titulo: values.titulo || '',
      descricao: values.descricao || '',
      numeroWhatsapp: values.numeroWhatsapp || '',
    };
    
    onInputChange({ target: { name: 'tag', value: formValues.tag } });
    onInputChange({ target: { name: 'titulo', value: formValues.titulo } });
    onInputChange({ target: { name: 'descricao', value: formValues.descricao } });
    onInputChange({ target: { name: 'numeroWhatsapp', value: formValues.numeroWhatsapp } });
    
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
        <Title level={2} style={{ margin: 0, fontWeight: 400, color: '#262626' }}>Dicas de Viagem</Title>
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
            {editingDica ? 'Editar Dica' : 'Nova Dica'}
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
          key={editingDica ? `edit-${editingDica.id}` : 'new'}
          initialValues={editingDica ? {
            tag: editingDica.tag || formData.tag || '',
            titulo: editingDica.titulo || formData.titulo || '',
            descricao: editingDica.descricao || formData.descricao || '',
            numeroWhatsapp: editingDica.linkWhatsapp || formData.numeroWhatsapp || '',
          } : {
            tag: '',
            titulo: '',
            descricao: '',
            numeroWhatsapp: '',
          }}
        >
          <Form.Item
            label="Tag (opcional)"
            name="tag"
            validateStatus={validationErrors?.tag ? 'error' : ''}
            help={validationErrors?.tag}
            rules={[
              { max: 100, message: 'A tag deve ter no máximo 100 caracteres!' }
            ]}
          >
            <Input
              placeholder="Digite a tag"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Título"
            name="titulo"
            validateStatus={validationErrors?.titulo ? 'error' : ''}
            help={validationErrors?.titulo}
            rules={[
              { required: true, message: 'Por favor, digite o título!' },
              { max: 150, message: 'O título deve ter no máximo 150 caracteres!' }
            ]}
          >
            <Input
              placeholder="Digite o título"
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

          <Form.Item
            label={`Imagem ${editingDica ? '(opcional)' : ''}`}
            name="imagem"
            rules={!editingDica ? [{ required: true, message: 'Por favor, selecione uma imagem!' }] : []}
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

          <Form.Item
            label={`Ícone ${editingDica ? '(opcional)' : ''}`}
            name="icone"
            rules={!editingDica ? [{ required: true, message: 'Por favor, selecione um ícone!' }] : []}
          >
            <Upload
              accept="image/*"
              beforeUpload={(file) => {
                onFileChange({ target: { name: 'icone', files: [file] } });
                return false;
              }}
              maxCount={1}
              disabled={loading}
            >
              <Button icon={<UploadOutlined />}>Selecionar Ícone</Button>
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
            {selectedDica?.titulo}
          </span>
        }
        open={!!selectedDica}
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
        {selectedDica && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {selectedDica.tag && (
              <div style={{ 
                padding: '12px 16px', 
                background: '#fafafa', 
                borderRadius: 6,
                display: 'inline-block'
              }}>
                <Text strong style={{ marginRight: 8 }}>Tag:</Text>
                <Tag 
                  style={{ 
                    background: '#ffffff',
                    border: '1px solid #e8e8e8',
                    color: '#262626',
                    padding: '4px 12px',
                    borderRadius: 4,
                    fontSize: 13
                  }}
                >
                  {selectedDica.tag}
                </Tag>
              </div>
            )}
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
                {selectedDica.descricao}
              </p>
            </div>
            <div style={{ 
              padding: '12px 16px', 
              background: '#f0f7ff', 
              borderRadius: 6,
              border: '1px solid #d4edda'
            }}>
              <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 4 }}>
                WhatsApp:
              </Text>
              <a 
                href={`https://wa.me/${selectedDica.linkWhatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#1890ff',
                  fontSize: 14,
                  textDecoration: 'none'
                }}
              >
                {selectedDica.linkWhatsapp}
              </a>
            </div>
            <Row gutter={20}>
              <Col span={12}>
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
                      key={`img-${selectedDica.id}`}
                      src={selectedDica.linkImagem}
                      alt={selectedDica.titulo}
                      style={{ width: '100%', display: 'block' }}
                    />
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 12 }}>
                    Ícone:
                  </Text>
                  <div style={{ 
                    borderRadius: 8, 
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    display: 'inline-block'
                  }}>
                    <ImageWithAuth
                      key={`icon-${selectedDica.id}`}
                      src={selectedDica.linkIcone}
                      alt={`Ícone ${selectedDica.titulo}`}
                      style={{ width: '100%', maxWidth: 200, display: 'block' }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Space>
        )}
      </Modal>

      {loading && !showForm && !selectedDica && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && dicas.length === 0 && (
        <Empty description="Nenhuma dica cadastrada ainda." />
      )}

      <Row gutter={[24, 24]}>
        {dicas.map((dica) => (
          <Col key={dica.id} xs={24} sm={12} lg={8} xl={6}>
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
                      key={`${dica.id}-${imageRefreshKey}`}
                      src={dica.linkImagem}
                      alt={dica.titulo}
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
                    {dica.tag && (
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
                        {dica.tag}
                      </Tag>
                    )}
                  </div>
                </div>
              }
              actions={[
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => onViewDetails(dica.id)}
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
                  onClick={() => onEdit(dica)}
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
                  title="Excluir dica"
                  description="Tem certeza que deseja excluir esta dica?"
                  onConfirm={() => onDelete(dica)}
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
                      {dica.titulo}
                    </span>
                  </div>
                }
                description={
                  <Text 
                    ellipsis={{ tooltip: dica.descricao, rows: 3 }} 
                    style={{ 
                      display: 'block', 
                      color: '#8c8c8c', 
                      fontSize: 14,
                      lineHeight: 1.6,
                      marginTop: 8
                    }}
                  >
                    {dica.descricao}
                  </Text>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Dica;

