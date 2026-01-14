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
  Popconfirm,
  message
} from 'antd';
import { useEffect } from 'react';
import { 
  PlusOutlined, 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined,
  WhatsAppOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import ImageWithAuth from '../../components/ImageWithAuth';
import VideoWithAuth from '../../components/VideoWithAuth';

const { Title, Text } = Typography;
const { TextArea } = Input;

const VidaNoturna = ({
  vidaNoturnas,
  loading,
  showForm,
  selectedVidaNoturna,
  editingVidaNoturna,
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
      if (!editingVidaNoturna) {
        form.resetFields();
      } else if (editingVidaNoturna) {
        const values = {
          titulo: editingVidaNoturna.titulo || '',
          descricao: editingVidaNoturna.descricao || '',
          destaque: editingVidaNoturna.destaque || '',
          horarioFuncionamento: editingVidaNoturna.horarioFuncionamento || '',
          numeroWhatsapp: editingVidaNoturna.numeroWhatsapp || '',
          linkGoogleMaps: editingVidaNoturna.linkGoogleMaps || '',
        };
        form.setFieldsValue(values);
      }
    } else {
      form.resetFields();
    }
  }, [showForm, editingVidaNoturna, form]);

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
      descricao: values.descricao || '',
      destaque: values.destaque || '',
      horarioFuncionamento: values.horarioFuncionamento || '',
      numeroWhatsapp: values.numeroWhatsapp || '',
      linkGoogleMaps: values.linkGoogleMaps || '',
    };
    
    onInputChange({ target: { name: 'titulo', value: formValues.titulo } });
    onInputChange({ target: { name: 'descricao', value: formValues.descricao } });
    onInputChange({ target: { name: 'destaque', value: formValues.destaque } });
    onInputChange({ target: { name: 'horarioFuncionamento', value: formValues.horarioFuncionamento } });
    onInputChange({ target: { name: 'numeroWhatsapp', value: formValues.numeroWhatsapp } });
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
        <Title level={2} style={{ margin: 0, fontWeight: 400, color: '#262626' }}>Vida Noturna</Title>
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
            {editingVidaNoturna ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}
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
          key={editingVidaNoturna ? `edit-${editingVidaNoturna.id}` : 'new'}
          initialValues={editingVidaNoturna ? {
            titulo: editingVidaNoturna.titulo || formData.titulo || '',
            descricao: editingVidaNoturna.descricao || formData.descricao || '',
            destaque: editingVidaNoturna.destaque || formData.destaque || '',
            horarioFuncionamento: editingVidaNoturna.horarioFuncionamento || formData.horarioFuncionamento || '',
            numeroWhatsapp: editingVidaNoturna.numeroWhatsapp || formData.numeroWhatsapp || '',
            linkGoogleMaps: editingVidaNoturna.linkGoogleMaps || formData.linkGoogleMaps || '',
          } : {
            titulo: '',
            descricao: '',
            destaque: '',
            horarioFuncionamento: '',
            numeroWhatsapp: '',
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
            label="Descrição"
            name="descricao"
            validateStatus={validationErrors?.descricao ? 'error' : ''}
            help={validationErrors?.descricao}
            rules={[
              { max: 1000, message: 'A descrição deve ter no máximo 1000 caracteres!' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Digite a descrição"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Destaque"
            name="destaque"
            rules={[
              { max: 255, message: 'O destaque deve ter no máximo 255 caracteres!' }
            ]}
          >
            <Input
              placeholder="Digite o destaque"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Horário de Funcionamento"
            name="horarioFuncionamento"
            rules={[
              { required: true, message: 'Por favor, digite o horário de funcionamento!' },
              { max: 255, message: 'O horário deve ter no máximo 255 caracteres!' }
            ]}
          >
            <Input
              placeholder="Ex: Segunda a Sábado, 18h às 2h"
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
              placeholder="Ex: 5581999999999"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Link Google Maps"
            name="linkGoogleMaps"
            rules={[
              { required: true, message: 'Por favor, digite o link do Google Maps!' },
              { type: 'url', message: 'Por favor, digite uma URL válida!' },
              { max: 512, message: 'O link deve ter no máximo 512 caracteres!' }
            ]}
          >
            <Input
              type="url"
              placeholder="https://maps.google.com/..."
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label={`Imagens ${editingVidaNoturna ? '(opcional)' : ''}`}
            name="imagens"
            validateStatus={validationErrors?.imagens ? 'error' : ''}
            help={validationErrors?.imagens}
            rules={!editingVidaNoturna ? [
              { 
                validator: (_, value) => {
                  if (!formData.imagens || formData.imagens.length === 0) {
                    return Promise.reject(new Error('Por favor, selecione pelo menos uma imagem!'));
                  }
                  return Promise.resolve();
                }
              }
            ] : []}
          >
            <Upload
              accept="image/*"
              multiple
              beforeUpload={(file) => {
                const currentFiles = formData.imagens || [];
                onFileChange({ target: { name: 'imagens', files: [...currentFiles, file] } });
                return false;
              }}
              onRemove={(file) => {
                const currentFiles = formData.imagens || [];
                const newFiles = currentFiles.filter((f, index) => {
                  return !(f.name === file.name && f.size === file.size);
                });
                onFileChange({ target: { name: 'imagens', files: newFiles } });
              }}
              fileList={formData.imagens?.map((file, index) => ({
                uid: `-${index}`,
                name: file.name,
                status: 'done',
              })) || []}
              disabled={loading}
            >
              <Button icon={<UploadOutlined />}>Selecionar Imagens</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Vídeos (opcional)"
            name="videos"
          >
            <Upload
              accept="video/*,.wmv"
              multiple
              beforeUpload={(file) => {
                // Permitir vídeos (incluindo WMV) - validar por extensão também
                const fileName = file.name?.toLowerCase() || '';
                const isVideo = file.type?.startsWith('video/') || 
                               fileName.endsWith('.wmv') ||
                               fileName.endsWith('.mp4') ||
                               fileName.endsWith('.webm') ||
                               fileName.endsWith('.avi') ||
                               fileName.endsWith('.mov') ||
                               fileName.endsWith('.mkv') ||
                               fileName.endsWith('.flv') ||
                               fileName.endsWith('.m4v');
                
                if (!isVideo) {
                  message.error('Apenas arquivos de vídeo são permitidos (incluindo .wmv, .mp4, .webm, .avi, .mov, .mkv)');
                  return Upload.LIST_IGNORE;
                }
                
                const currentFiles = formData.videos || [];
                onFileChange({ target: { name: 'videos', files: [...currentFiles, file] } });
                return false;
              }}
              onRemove={(file) => {
                const currentFiles = formData.videos || [];
                const fileIndex = parseInt(file.uid?.replace('video-', '') || '-1');
                const newFiles = currentFiles.filter((f, index) => {
                  return index !== fileIndex;
                });
                onFileChange({ target: { name: 'videos', files: newFiles } });
              }}
              fileList={formData.videos?.map((file, index) => ({
                uid: `video-${index}`,
                name: file.name,
                status: 'done',
              })) || []}
              disabled={loading}
            >
              <Button icon={<UploadOutlined />}>Selecionar Vídeos</Button>
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
            {selectedVidaNoturna?.titulo}
          </span>
        }
        open={!!selectedVidaNoturna}
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
        {selectedVidaNoturna && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {selectedVidaNoturna.destaque && (
              <div style={{ 
                padding: '12px 16px', 
                background: '#fff7e6', 
                borderRadius: 6,
                border: '1px solid #ffe7ba',
                display: 'inline-block'
              }}>
                <Text strong style={{ marginRight: 8 }}>Destaque:</Text>
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
                  {selectedVidaNoturna.destaque}
                </Tag>
              </div>
            )}
            {selectedVidaNoturna.descricao && (
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
                  {selectedVidaNoturna.descricao}
                </p>
              </div>
            )}
            <div style={{ 
              padding: '16px', 
              background: '#fafafa', 
              borderRadius: 6,
              border: '1px solid #f0f0f0'
            }}>
              <div style={{ marginBottom: 12 }}>
                <ClockCircleOutlined style={{ color: '#595959', marginRight: 8 }} />
                <Text strong style={{ fontSize: 14, color: '#595959' }}>
                  Horário de Funcionamento:
                </Text>
              </div>
              <p style={{ 
                margin: 0, 
                color: '#262626',
                fontSize: 15,
                paddingLeft: 24
              }}>
                {selectedVidaNoturna.horarioFuncionamento}
              </p>
            </div>
            <div style={{ 
              padding: '12px 16px', 
              background: '#f0f7ff', 
              borderRadius: 6,
              border: '1px solid #d4edda'
            }}>
              <div style={{ marginBottom: 4 }}>
                <WhatsAppOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <Text strong style={{ fontSize: 14, color: '#595959' }}>
                  WhatsApp:
                </Text>
              </div>
              <a 
                href={`https://wa.me/${selectedVidaNoturna.numeroWhatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#1890ff',
                  fontSize: 14,
                  textDecoration: 'none',
                  paddingLeft: 24,
                  display: 'block'
                }}
              >
                {selectedVidaNoturna.numeroWhatsapp}
              </a>
            </div>
            <div style={{ 
              padding: '12px 16px', 
              background: '#f0f7ff', 
              borderRadius: 6,
              border: '1px solid #d4edda'
            }}>
              <div style={{ marginBottom: 4 }}>
                <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                <Text strong style={{ fontSize: 14, color: '#595959' }}>
                  Google Maps:
                </Text>
              </div>
              <a 
                href={selectedVidaNoturna.linkGoogleMaps} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#1890ff',
                  fontSize: 14,
                  textDecoration: 'none',
                  paddingLeft: 24,
                  display: 'block'
                }}
              >
                Ver no mapa
              </a>
            </div>
            <div>
              <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 12 }}>
                Imagens:
              </Text>
              <Row gutter={[16, 16]}>
                {selectedVidaNoturna.linkImagens && selectedVidaNoturna.linkImagens.length > 0 ? (
                  selectedVidaNoturna.linkImagens.map((imagemUrl, index) => (
                    <Col key={index} span={12}>
                      <div style={{ 
                        borderRadius: 8, 
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <ImageWithAuth
                          key={`img-${selectedVidaNoturna.id}-${index}`}
                          src={imagemUrl}
                          alt={`${selectedVidaNoturna.titulo} - Imagem ${index + 1}`}
                          style={{ width: '100%', display: 'block' }}
                        />
                      </div>
                    </Col>
                  ))
                ) : (
                  <Col span={24}>
                    <Text style={{ color: '#8c8c8c' }}>Nenhuma imagem cadastrada</Text>
                  </Col>
                )}
              </Row>
            </div>
            {selectedVidaNoturna.linkVideos && selectedVidaNoturna.linkVideos.length > 0 && (
              <div>
                <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 12 }}>
                  Vídeos:
                </Text>
                <Row gutter={[16, 16]}>
                  {selectedVidaNoturna.linkVideos.map((videoUrl, index) => (
                    <Col key={index} span={12}>
                      <div style={{ 
                        borderRadius: 8, 
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <VideoWithAuth
                          key={`video-${selectedVidaNoturna.id}-${index}`}
                          src={videoUrl}
                          style={{ width: '100%', display: 'block' }}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Space>
        )}
      </Modal>

      {loading && !showForm && !selectedVidaNoturna && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && vidaNoturnas.length === 0 && (
        <Empty description="Nenhum estabelecimento cadastrado ainda." />
      )}

      <Row gutter={[24, 24]}>
        {vidaNoturnas.map((vidaNoturna) => (
          <Col key={vidaNoturna.id} xs={24} sm={12} lg={8} xl={6}>
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
                <div style={{ 
                  height: 220, 
                  overflow: 'hidden',
                  position: 'relative'
                }}>
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
                    {vidaNoturna.linkImagens && vidaNoturna.linkImagens.length > 0 ? (
                      <ImageWithAuth
                        key={`${vidaNoturna.id}-${imageRefreshKey}`}
                        src={vidaNoturna.linkImagens[0]}
                        alt={vidaNoturna.titulo}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        background: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8c8c8c'
                      }}>
                        Sem imagem
                      </div>
                    )}
                  </div>
                  {vidaNoturna.destaque && (
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
                        {vidaNoturna.destaque}
                      </Tag>
                    </div>
                  )}
                </div>
              }
              actions={[
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => onViewDetails(vidaNoturna.id)}
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
                  onClick={() => onEdit(vidaNoturna)}
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
                  title="Excluir estabelecimento"
                  description="Tem certeza que deseja excluir este estabelecimento?"
                  onConfirm={() => onDelete(vidaNoturna)}
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
                      {vidaNoturna.titulo}
                    </span>
                  </div>
                }
                description={
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {vidaNoturna.descricao && (
                      <Text 
                        ellipsis={{ tooltip: vidaNoturna.descricao, rows: 2 }} 
                        style={{ 
                          display: 'block', 
                          color: '#8c8c8c', 
                          fontSize: 14,
                          lineHeight: 1.6
                        }}
                      >
                        {vidaNoturna.descricao}
                      </Text>
                    )}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 6,
                      marginTop: 8,
                      padding: '8px 12px',
                      background: '#fafafa',
                      borderRadius: 6
                    }}>
                      <ClockCircleOutlined style={{ color: '#8c8c8c', fontSize: 14 }} />
                      <Text style={{ fontSize: 13, color: '#595959' }}>
                        {vidaNoturna.horarioFuncionamento}
                      </Text>
                    </div>
                  </Space>
                }
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default VidaNoturna;

