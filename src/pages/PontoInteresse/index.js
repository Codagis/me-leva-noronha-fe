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
  EnvironmentOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const PontoInteresse = ({
  pontosInteresse,
  loading,
  showForm,
  selectedPontoInteresse,
  editingPontoInteresse,
  formData,
  validationErrors,
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
      if (!editingPontoInteresse) {
        form.resetFields();
      } else if (editingPontoInteresse) {
        const values = {
          titulo: editingPontoInteresse.titulo || '',
          categoria: editingPontoInteresse.categoria || '',
          tag: editingPontoInteresse.tag || '',
          linkGoogleMaps: editingPontoInteresse.linkGoogleMaps || '',
        };
        form.setFieldsValue(values);
      }
    } else {
      form.resetFields();
    }
  }, [showForm, editingPontoInteresse, form]);

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
      titulo: values.titulo || '',
      categoria: values.categoria || '',
      tag: values.tag || '',
      linkGoogleMaps: values.linkGoogleMaps || '',
    };
    
    onInputChange({ target: { name: 'titulo', value: formValues.titulo } });
    onInputChange({ target: { name: 'categoria', value: formValues.categoria } });
    onInputChange({ target: { name: 'tag', value: formValues.tag } });
    onInputChange({ target: { name: 'linkGoogleMaps', value: formValues.linkGoogleMaps } });
    
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
        <Title level={2} style={{ margin: 0, fontWeight: 400, color: '#262626' }}>Pontos de Interesse</Title>
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
            {editingPontoInteresse ? 'Editar Ponto de Interesse' : 'Novo Ponto de Interesse'}
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
          key={editingPontoInteresse ? `edit-${editingPontoInteresse.id}` : 'new'}
          initialValues={editingPontoInteresse ? {
            titulo: editingPontoInteresse.titulo || formData.titulo || '',
            categoria: editingPontoInteresse.categoria || formData.categoria || '',
            tag: editingPontoInteresse.tag || formData.tag || '',
            linkGoogleMaps: editingPontoInteresse.linkGoogleMaps || formData.linkGoogleMaps || '',
          } : {
            titulo: '',
            categoria: '',
            tag: '',
            linkGoogleMaps: '',
          }}
        >
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
            label="Categoria"
            name="categoria"
            validateStatus={validationErrors?.categoria ? 'error' : ''}
            help={validationErrors?.categoria}
            rules={[
              { required: true, message: 'Por favor, digite a categoria!' },
              { max: 100, message: 'A categoria deve ter no máximo 100 caracteres!' }
            ]}
          >
            <Input
              placeholder="Ex: Mirante, Praia, Monumento"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Tag"
            name="tag"
            validateStatus={validationErrors?.tag ? 'error' : ''}
            help={validationErrors?.tag}
            rules={[
              { required: true, message: 'Por favor, digite a tag!' },
              { max: 100, message: 'A tag deve ter no máximo 100 caracteres!' }
            ]}
          >
            <Input
              placeholder="Ex: turismo, natureza, histórico"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Link Google Maps"
            name="linkGoogleMaps"
            validateStatus={validationErrors?.linkGoogleMaps ? 'error' : ''}
            help={validationErrors?.linkGoogleMaps}
            rules={[
              { required: true, message: 'Por favor, digite o link do Google Maps!' },
              { type: 'url', message: 'Por favor, digite uma URL válida!' },
              { max: 512, message: 'O link deve ter no máximo 512 caracteres!' }
            ]}
          >
            <Input
              type="url"
              placeholder="https://maps.app.goo.gl/..."
              disabled={loading}
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
            {selectedPontoInteresse?.titulo}
          </span>
        }
        open={!!selectedPontoInteresse}
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
        {selectedPontoInteresse && (
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
                    Categoria:
                  </Text>
                  <Tag>{selectedPontoInteresse.categoria}</Tag>
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
                    Tag:
                  </Text>
                  <Tag>{selectedPontoInteresse.tag}</Tag>
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
                <EnvironmentOutlined /> Google Maps:
              </Text>
              <a 
                href={selectedPontoInteresse.linkGoogleMaps} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#1890ff',
                  fontSize: 14,
                  textDecoration: 'none'
                }}
              >
                {selectedPontoInteresse.linkGoogleMaps}
              </a>
            </div>
          </Space>
        )}
      </Modal>

      {loading && !showForm && !selectedPontoInteresse && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && pontosInteresse.length === 0 && (
        <Empty description="Nenhum ponto de interesse cadastrado ainda." />
      )}

      <Row gutter={[24, 24]}>
        {pontosInteresse.map((pontoInteresse) => (
          <Col key={pontoInteresse.id} xs={24} sm={12} lg={8} xl={6}>
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
                  onClick={() => onViewDetails(pontoInteresse.id)}
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
                  onClick={() => onEdit(pontoInteresse)}
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
                  title="Excluir ponto de interesse"
                  description="Tem certeza que deseja excluir este ponto de interesse?"
                  onConfirm={() => onDelete(pontoInteresse)}
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
                      {pontoInteresse.titulo}
                    </span>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Tag>{pontoInteresse.categoria}</Tag>
                      <Tag>{pontoInteresse.tag}</Tag>
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
                      <a 
                        href={pontoInteresse.linkGoogleMaps} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: '#1890ff',
                          fontSize: 12,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <EnvironmentOutlined /> Ver no Google Maps
                      </a>
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

export default PontoInteresse;

