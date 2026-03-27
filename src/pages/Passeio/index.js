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
  Popconfirm,
  Select,
  InputNumber,
  Tabs,
  message
} from 'antd';
import { 
  ReloadOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  UploadOutlined,
  WhatsAppOutlined,
  ClockCircleOutlined,
  DollarOutlined
} from '@ant-design/icons';
import ImageWithAuth from '../../components/ImageWithAuth';
import VideoWithAuth from '../../components/VideoWithAuth';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

/** Evita ".map is not a function" quando API/Form devolvem null, objeto ou tipo inesperado */
const asArray = (v) => (Array.isArray(v) ? v : []);

const Passeio = ({
  passeios,
  loading,
  lang,
  onLangChange,
  showForm,
  selectedPasseio,
  editingPasseio,
  formData,
  imageRefreshKey,
  validationErrors,
  onInputChange,
  onFileChange,
  onPerguntasRespostasChange,
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
  const listaPasseios = asArray(passeios);
  const [perguntaInput, setPerguntaInput] = useState({ pt: '', en: '', es: '' });
  const [respostaInput, setRespostaInput] = useState({ pt: '', en: '', es: '' });

  useEffect(() => {
    if (showForm) {
      if (editingPasseio) {
        const whatsappValue = editingPasseio.numeroWhatsapp || editingPasseio.linkWhatsapp || '';
        const i18n = editingPasseio.i18n || {};
        const values = {
          tituloPt: i18n.pt?.titulo || editingPasseio.titulo || '',
          descricaoPt: i18n.pt?.descricao || editingPasseio.descricao || '',
          tagPt: i18n.pt?.tag || editingPasseio.tag || '',
          tagsPt: i18n.pt?.tags || editingPasseio.tags || [],
          itensIncluidosPt: i18n.pt?.itensIncluidos || editingPasseio.itensIncluidos || [],
          tituloEn: i18n.en?.titulo || '',
          descricaoEn: i18n.en?.descricao || '',
          tagEn: i18n.en?.tag || '',
          tagsEn: i18n.en?.tags || [],
          itensIncluidosEn: i18n.en?.itensIncluidos || [],
          tituloEs: i18n.es?.titulo || '',
          descricaoEs: i18n.es?.descricao || '',
          tagEs: i18n.es?.tag || '',
          tagsEs: i18n.es?.tags || [],
          itensIncluidosEs: i18n.es?.itensIncluidos || [],
          duracao: editingPasseio.duracao || '',
          valor: editingPasseio.valor ? parseFloat(editingPasseio.valor) : undefined,
          numeroWhatsapp: whatsappValue,
          categoria: editingPasseio.categoria || 'AQUATICOS',
          topRanking: editingPasseio.topRanking || null,
          perguntasRespostasPt: i18n.pt?.perguntasRespostas || editingPasseio.perguntasRespostas || [],
          perguntasRespostasEn: i18n.en?.perguntasRespostas || [],
          perguntasRespostasEs: i18n.es?.perguntasRespostas || [],
        };
        form.resetFields();
        setTimeout(() => {
          form.setFieldsValue(values);
        }, 100);
      } else {
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
  }, [showForm, editingPasseio?.id, editingPasseio?.numeroWhatsapp, editingPasseio?.linkWhatsapp, form]);

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
      tituloPt: values.tituloPt || '',
      descricaoPt: values.descricaoPt || '',
      tagPt: values.tagPt || '',
      tagsPt: asArray(values.tagsPt),
      tituloEn: values.tituloEn || '',
      descricaoEn: values.descricaoEn || '',
      tagEn: values.tagEn || '',
      tagsEn: asArray(values.tagsEn),
      tituloEs: values.tituloEs || '',
      descricaoEs: values.descricaoEs || '',
      tagEs: values.tagEs || '',
      tagsEs: asArray(values.tagsEs),
      duracao: values.duracao || '',
      valor: values.valor?.toString() || '',
      numeroWhatsapp: values.numeroWhatsapp || '',
      categoria: values.categoria || 'AQUATICOS',
      topRanking: values.topRanking || null,
      itensIncluidosPt: asArray(values.itensIncluidosPt),
      itensIncluidosEn: asArray(values.itensIncluidosEn),
      itensIncluidosEs: asArray(values.itensIncluidosEs),
      perguntasRespostasPt: asArray(values.perguntasRespostasPt),
      perguntasRespostasEn: asArray(values.perguntasRespostasEn),
      perguntasRespostasEs: asArray(values.perguntasRespostasEs),
    };
    
    Object.entries(formValues).forEach(([k, v]) => onInputChange({ target: { name: k, value: v } }));
    onInputChange({ target: { name: 'duracao', value: formValues.duracao } });
    onInputChange({ target: { name: 'valor', value: formValues.valor } });
    onInputChange({ target: { name: 'numeroWhatsapp', value: formValues.numeroWhatsapp } });
    onInputChange({ target: { name: 'categoria', value: formValues.categoria } });
    onInputChange({ target: { name: 'topRanking', value: formValues.topRanking } });
    
    const fakeEvent = {
      preventDefault: () => {}
    };
    
    onSubmit(fakeEvent, formValues);
  };

  const handleAddPerguntaResposta = (langKey, fieldName) => {
    const pergunta = perguntaInput[langKey]?.trim();
    const resposta = respostaInput[langKey]?.trim();
    if (pergunta && resposta) {
      const current = asArray(form.getFieldValue(fieldName));
      const newPR = [...current, { pergunta, resposta }];
      form.setFieldValue(fieldName, newPR);
      onPerguntasRespostasChange(fieldName, newPR);
      setPerguntaInput(prev => ({ ...prev, [langKey]: '' }));
      setRespostaInput(prev => ({ ...prev, [langKey]: '' }));
    }
  };

  const handleRemovePerguntaResposta = (langKey, fieldName, indexToRemove) => {
    const current = asArray(form.getFieldValue(fieldName));
    const newPR = current.filter((_, i) => i !== indexToRemove);
    form.setFieldValue(fieldName, newPR);
    onPerguntasRespostasChange(fieldName, newPR);
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatTopRanking = (topRanking) => {
    if (!topRanking) return '';
    return topRanking.replace('_', ' ');
  };

  const formatDuracao = (duracao) => {
    if (!duracao) return '';
    const duracaoLower = duracao.toLowerCase().trim();
    const duracaoSemHoras = duracaoLower
      .replace(/\s*horas?\s*/gi, '')
      .replace(/\s*hora\s*/gi, '')
      .replace(/\s*HORAS?\s*/g, '')
      .replace(/\s*HORA\s*/g, '')
      .trim();
    
    if (!duracaoSemHoras) return duracao;
    
    const numero = parseFloat(duracaoSemHoras);
    if (isNaN(numero)) return duracao;
    
    if (numero === 1) {
      return '1 hora';
    } else {
      return `${numero} horas`;
    }
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24
      }}>
        <Title level={2} style={{ margin: 0, fontWeight: 400, color: '#262626' }}>Passeios</Title>
        <Space>
          <Select
            value={lang || 'pt'}
            onChange={onLangChange}
            style={{ width: 140 }}
            disabled={loading}
          >
            <Option value="pt">Português</Option>
            <Option value="en">Inglês</Option>
            <Option value="es">Espanhol</Option>
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
            {editingPasseio ? 'Editar Passeio' : 'Novo Passeio'}
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
        forceRender
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          preserve={false}
          key={editingPasseio ? `edit-${editingPasseio.id}-${editingPasseio.numeroWhatsapp || editingPasseio.linkWhatsapp || ''}` : 'new'}
            initialValues={editingPasseio ? {
            tituloPt: editingPasseio.i18n?.pt?.titulo || editingPasseio.titulo || '',
            descricaoPt: editingPasseio.i18n?.pt?.descricao || editingPasseio.descricao || '',
            tagPt: editingPasseio.i18n?.pt?.tag || editingPasseio.tag || '',
            tagsPt: editingPasseio.i18n?.pt?.tags || editingPasseio.tags || [],
            itensIncluidosPt: editingPasseio.i18n?.pt?.itensIncluidos || editingPasseio.itensIncluidos || [],
            tituloEn: editingPasseio.i18n?.en?.titulo || '',
            descricaoEn: editingPasseio.i18n?.en?.descricao || '',
            tagEn: editingPasseio.i18n?.en?.tag || '',
            tagsEn: editingPasseio.i18n?.en?.tags || [],
            itensIncluidosEn: editingPasseio.i18n?.en?.itensIncluidos || [],
            tituloEs: editingPasseio.i18n?.es?.titulo || '',
            descricaoEs: editingPasseio.i18n?.es?.descricao || '',
            tagEs: editingPasseio.i18n?.es?.tag || '',
            tagsEs: editingPasseio.i18n?.es?.tags || [],
            itensIncluidosEs: editingPasseio.i18n?.es?.itensIncluidos || [],
            duracao: editingPasseio.duracao || '',
            valor: editingPasseio.valor ? parseFloat(editingPasseio.valor) : undefined,
            numeroWhatsapp: editingPasseio.numeroWhatsapp || editingPasseio.linkWhatsapp || '',
            categoria: editingPasseio.categoria || 'AQUATICOS',
            topRanking: editingPasseio.topRanking || null,
            perguntasRespostasPt: editingPasseio.i18n?.pt?.perguntasRespostas || editingPasseio.perguntasRespostas || [],
            perguntasRespostasEn: editingPasseio.i18n?.en?.perguntasRespostas || [],
            perguntasRespostasEs: editingPasseio.i18n?.es?.perguntasRespostas || [],
          } : {
            tituloPt: '',
            descricaoPt: '',
            tagPt: '',
            tagsPt: [],
            itensIncluidosPt: [],
            tituloEn: '',
            descricaoEn: '',
            tagEn: '',
            tagsEn: [],
            itensIncluidosEn: [],
            tituloEs: '',
            descricaoEs: '',
            tagEs: '',
            tagsEs: [],
            itensIncluidosEs: [],
            duracao: '',
            valor: undefined,
            numeroWhatsapp: '',
            categoria: 'AQUATICOS',
            topRanking: null,
            perguntasRespostasPt: [],
            perguntasRespostasEn: [],
            perguntasRespostasEs: [],
          }}
        >
          <Tabs defaultActiveKey="pt">
            <TabPane tab="PT" key="pt">
              <Form.Item
                label="Tag (PT) (opcional)"
                name="tagPt"
                rules={[{ max: 100, message: 'A tag deve ter no máximo 100 caracteres!' }]}
              >
                <Input placeholder="Digite a tag" disabled={loading} />
              </Form.Item>
              <Form.Item label="Tags (PT) (opcional)" name="tagsPt">
                <Select mode="tags" placeholder="Digite e pressione Enter" disabled={loading} />
              </Form.Item>
              <Form.Item
                label="Título (PT)"
                name="tituloPt"
                rules={[
                  { required: true, message: 'Por favor, digite o título (PT)!' },
                  { max: 150, message: 'O título deve ter no máximo 150 caracteres!' }
                ]}
              >
                <Input placeholder="Digite o título" disabled={loading} />
              </Form.Item>
              <Form.Item
                label="Descrição (PT)"
                name="descricaoPt"
                rules={[
                  { required: true, message: 'Por favor, digite a descrição (PT)!' },
                  { max: 1000, message: 'A descrição deve ter no máximo 1000 caracteres!' }
                ]}
              >
                <TextArea rows={5} placeholder="Digite a descrição" disabled={loading} />
              </Form.Item>
              <Form.Item label="Itens Incluídos (PT)" name="itensIncluidosPt">
                <Select mode="tags" placeholder="Digite e pressione Enter" disabled={loading} />
              </Form.Item>
              <Form.Item label="Perguntas e Respostas (PT) (opcional)" name="perguntasRespostasPt">
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {asArray(form.getFieldValue('perguntasRespostasPt')).map((pr, index) => (
                    <div key={`pr-pt-${index}`} style={{ padding: '10px', background: '#fafafa', borderRadius: 6, border: '1px solid #e8e8e8', position: 'relative' }}>
                      <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemovePerguntaResposta('pt', 'perguntasRespostasPt', index)} style={{ position: 'absolute', top: 6, right: 6 }} />
                      <Text strong style={{ display: 'block' }}>{pr.pergunta}</Text>
                      <Text>{pr.resposta}</Text>
                    </div>
                  ))}
                  <TextArea placeholder="Pergunta (PT)" value={perguntaInput.pt} onChange={(e) => setPerguntaInput(prev => ({ ...prev, pt: e.target.value }))} rows={2} disabled={loading} />
                  <TextArea placeholder="Resposta (PT)" value={respostaInput.pt} onChange={(e) => setRespostaInput(prev => ({ ...prev, pt: e.target.value }))} rows={3} disabled={loading} />
                  <Button onClick={() => handleAddPerguntaResposta('pt', 'perguntasRespostasPt')} disabled={loading || !perguntaInput.pt.trim() || !respostaInput.pt.trim()} type="dashed" block>
                    Adicionar Pergunta/Resposta PT
                  </Button>
                </Space>
              </Form.Item>
            </TabPane>
            <TabPane tab="EN" key="en">
              <Form.Item label="Tag (EN) (opcional)" name="tagEn" rules={[{ max: 100, message: 'A tag deve ter no máximo 100 caracteres!' }]}>
                <Input placeholder="Type tag" disabled={loading} />
              </Form.Item>
              <Form.Item label="Tags (EN) (opcional)" name="tagsEn">
                <Select mode="tags" placeholder="Type and press Enter" disabled={loading} />
              </Form.Item>
              <Form.Item label="Título (EN) (opcional)" name="tituloEn" rules={[{ max: 150, message: 'O título deve ter no máximo 150 caracteres!' }]}>
                <Input placeholder="Type title" disabled={loading} />
              </Form.Item>
              <Form.Item label="Descrição (EN) (opcional)" name="descricaoEn" rules={[{ max: 1000, message: 'A descrição deve ter no máximo 1000 caracteres!' }]}>
                <TextArea rows={5} placeholder="Type description" disabled={loading} />
              </Form.Item>
              <Form.Item label="Itens Incluídos (EN) (opcional)" name="itensIncluidosEn">
                <Select mode="tags" placeholder="Type and press Enter" disabled={loading} />
              </Form.Item>
              <Form.Item label="Perguntas e Respostas (EN) (opcional)" name="perguntasRespostasEn">
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {asArray(form.getFieldValue('perguntasRespostasEn')).map((pr, index) => (
                    <div key={`pr-en-${index}`} style={{ padding: '10px', background: '#fafafa', borderRadius: 6, border: '1px solid #e8e8e8', position: 'relative' }}>
                      <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemovePerguntaResposta('en', 'perguntasRespostasEn', index)} style={{ position: 'absolute', top: 6, right: 6 }} />
                      <Text strong style={{ display: 'block' }}>{pr.pergunta}</Text>
                      <Text>{pr.resposta}</Text>
                    </div>
                  ))}
                  <TextArea placeholder="Question (EN)" value={perguntaInput.en} onChange={(e) => setPerguntaInput(prev => ({ ...prev, en: e.target.value }))} rows={2} disabled={loading} />
                  <TextArea placeholder="Answer (EN)" value={respostaInput.en} onChange={(e) => setRespostaInput(prev => ({ ...prev, en: e.target.value }))} rows={3} disabled={loading} />
                  <Button onClick={() => handleAddPerguntaResposta('en', 'perguntasRespostasEn')} disabled={loading || !perguntaInput.en.trim() || !respostaInput.en.trim()} type="dashed" block>
                    Add Q/A EN
                  </Button>
                </Space>
              </Form.Item>
            </TabPane>
            <TabPane tab="ES" key="es">
              <Form.Item label="Tag (ES) (opcional)" name="tagEs" rules={[{ max: 100, message: 'A tag deve ter no máximo 100 caracteres!' }]}>
                <Input placeholder="Escribe la tag" disabled={loading} />
              </Form.Item>
              <Form.Item label="Tags (ES) (opcional)" name="tagsEs">
                <Select mode="tags" placeholder="Escribe y presiona Enter" disabled={loading} />
              </Form.Item>
              <Form.Item label="Título (ES) (opcional)" name="tituloEs" rules={[{ max: 150, message: 'O título deve ter no máximo 150 caracteres!' }]}>
                <Input placeholder="Escribe el título" disabled={loading} />
              </Form.Item>
              <Form.Item label="Descrição (ES) (opcional)" name="descricaoEs" rules={[{ max: 1000, message: 'A descrição deve ter no máximo 1000 caracteres!' }]}>
                <TextArea rows={5} placeholder="Escribe la descripción" disabled={loading} />
              </Form.Item>
              <Form.Item label="Itens Incluídos (ES) (opcional)" name="itensIncluidosEs">
                <Select mode="tags" placeholder="Escribe y presiona Enter" disabled={loading} />
              </Form.Item>
              <Form.Item label="Perguntas e Respostas (ES) (opcional)" name="perguntasRespostasEs">
                <Space direction="vertical" style={{ width: '100%' }} size="small">
                  {asArray(form.getFieldValue('perguntasRespostasEs')).map((pr, index) => (
                    <div key={`pr-es-${index}`} style={{ padding: '10px', background: '#fafafa', borderRadius: 6, border: '1px solid #e8e8e8', position: 'relative' }}>
                      <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => handleRemovePerguntaResposta('es', 'perguntasRespostasEs', index)} style={{ position: 'absolute', top: 6, right: 6 }} />
                      <Text strong style={{ display: 'block' }}>{pr.pergunta}</Text>
                      <Text>{pr.resposta}</Text>
                    </div>
                  ))}
                  <TextArea placeholder="Pregunta (ES)" value={perguntaInput.es} onChange={(e) => setPerguntaInput(prev => ({ ...prev, es: e.target.value }))} rows={2} disabled={loading} />
                  <TextArea placeholder="Respuesta (ES)" value={respostaInput.es} onChange={(e) => setRespostaInput(prev => ({ ...prev, es: e.target.value }))} rows={3} disabled={loading} />
                  <Button onClick={() => handleAddPerguntaResposta('es', 'perguntasRespostasEs')} disabled={loading || !perguntaInput.es.trim() || !respostaInput.es.trim()} type="dashed" block>
                    Agregar P/R ES
                  </Button>
                </Space>
              </Form.Item>
            </TabPane>
          </Tabs>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Duração"
                name="duracao"
                rules={[
                  { required: true, message: 'Por favor, digite a duração!' },
                  { max: 100, message: 'A duração deve ter no máximo 100 caracteres!' }
                ]}
              >
                <Input
                  placeholder="Ex: 4 horas"
                  disabled={loading}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Valor"
                name="valor"
                rules={[
                  { required: true, message: 'Por favor, digite o valor!' },
                  { type: 'number', min: 0.01, message: 'O valor deve ser maior que zero!' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="0.00"
                  min={0.01}
                  step={0.01}
                  formatter={(value) => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(value) => value.replace(/R\$\s?|(,*)/g, '')}
                  disabled={loading}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Itens incluídos agora ficam dentro das abas de idioma */}

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

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Categoria"
                name="categoria"
                rules={[{ required: true, message: 'Por favor, selecione a categoria!' }]}
              >
                <Select
                  disabled={loading}
                >
                  <Option value="AQUATICOS">Aquáticos</Option>
                  <Option value="TERRESTRES">Terrestres</Option>
                  <Option value="EXCLUSIVOS">Exclusivos</Option>
                  <Option value="AVENTURA">Aventura</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Top Ranking (opcional)"
                name="topRanking"
              >
                <Select
                  placeholder="Selecione o ranking"
                  allowClear
                  disabled={loading}
                >
                  <Option value="TOP_1">TOP 1</Option>
                  <Option value="TOP_2">TOP 2</Option>
                  <Option value="TOP_3">TOP 3</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label={`Imagens ${editingPasseio ? '(opcional)' : ''}`}
            name="imagens"
            validateStatus={validationErrors?.imagens ? 'error' : ''}
            help={validationErrors?.imagens}
            rules={!editingPasseio ? [
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
              fileList={asArray(formData.imagens).map((file, index) => ({
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
              fileList={asArray(formData.videos).map((file, index) => ({
                uid: `video-${index}`,
                name: file.name,
                status: 'done',
              })) || []}
              disabled={loading}
            >
              <Button icon={<UploadOutlined />}>Selecionar Vídeos</Button>
            </Upload>
          </Form.Item>

          {/* Perguntas e respostas por idioma ficam nas abas PT/EN/ES */}

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
            {selectedPasseio?.titulo}
          </span>
        }
        open={!!selectedPasseio}
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
        {selectedPasseio && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {selectedPasseio.tag && (
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
                  {selectedPasseio.tag}
                </Tag>
              </div>
            )}
            {asArray(selectedPasseio.tags).length > 0 && (
              <div>
                <Text strong style={{ marginRight: 8 }}>Tags:</Text>
                {asArray(selectedPasseio.tags).map((t, idx) => (
                  <Tag key={`${t}-${idx}`}>{t}</Tag>
                ))}
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
                {selectedPasseio.descricao}
              </p>
            </div>

            <Row gutter={16}>
              <Col span={8}>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f0f7ff', 
                  borderRadius: 6,
                  border: '1px solid #d4edda'
                }}>
                  <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 4 }}>
                    <ClockCircleOutlined /> Duração:
                  </Text>
                  <Text style={{ fontSize: 14, color: '#262626' }}>
                    {formatDuracao(selectedPasseio.duracao)}
                  </Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f0f7ff', 
                  borderRadius: 6,
                  border: '1px solid #d4edda'
                }}>
                  <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 4 }}>
                    <DollarOutlined /> Valor:
                  </Text>
                  <Text style={{ fontSize: 14, color: '#262626' }}>
                    {formatCurrency(selectedPasseio.valor)}
                  </Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ 
                  padding: '12px 16px', 
                  background: '#f0f7ff', 
                  borderRadius: 6,
                  border: '1px solid #d4edda'
                }}>
                  <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 4 }}>
                    Categoria:
                  </Text>
                  <Tag>{selectedPasseio.categoriaDescricao || selectedPasseio.categoria}</Tag>
                </div>
              </Col>
            </Row>

            {selectedPasseio.topRanking && (
              <div style={{ 
                padding: '12px 16px', 
                background: '#fff7e6', 
                borderRadius: 6,
                border: '1px solid #ffe58f'
              }}>
                <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 4 }}>
                  Ranking:
                </Text>
                <Tag color="gold">{formatTopRanking(selectedPasseio.topRanking)}</Tag>
              </div>
            )}

            {asArray(selectedPasseio.itensIncluidos).length > 0 && (
              <div>
                <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 8 }}>
                  Itens Incluídos:
                </Text>
                <div>
                  {asArray(selectedPasseio.itensIncluidos).map((item, index) => (
                    <Tag key={index} style={{ marginBottom: 8 }}>
                      {item}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {asArray(selectedPasseio.perguntasRespostas).length > 0 && (
              <div>
                <Text strong style={{ fontSize: 16, color: '#262626', display: 'block', marginBottom: 16 }}>
                  Perguntas Frequentes:
                </Text>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {asArray(selectedPasseio.perguntasRespostas).map((pr, index) => (
                    <div
                      key={`pr-${index}`}
                      style={{
                        padding: '16px',
                        background: '#fafafa',
                        borderRadius: 6,
                        border: '1px solid #e8e8e8'
                      }}
                    >
                      <Text strong style={{ 
                        fontSize: 15, 
                        color: '#262626', 
                        display: 'block', 
                        marginBottom: 8 
                      }}>
                        {pr.pergunta}
                      </Text>
                      <Text style={{ 
                        color: '#595959', 
                        fontSize: 14,
                        lineHeight: 1.6
                      }}>
                        {pr.resposta}
                      </Text>
                    </div>
                  ))}
                </Space>
              </div>
            )}

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
                href={`https://wa.me/${selectedPasseio.numeroWhatsapp || selectedPasseio.linkWhatsapp}`} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  color: '#1890ff',
                  fontSize: 14,
                  textDecoration: 'none'
                }}
              >
                {selectedPasseio.numeroWhatsapp || selectedPasseio.linkWhatsapp}
              </a>
            </div>

            <div>
              <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 12 }}>
                Imagens:
              </Text>
              <Row gutter={[16, 16]}>
                {asArray(selectedPasseio.linkImagens).length > 0 ? (
                  asArray(selectedPasseio.linkImagens).map((imagemUrl, index) => (
                    <Col key={index} span={12}>
                      <div style={{ 
                        borderRadius: 8, 
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <ImageWithAuth
                          key={`img-${selectedPasseio.id}-${index}`}
                          src={imagemUrl}
                          alt={`${selectedPasseio.titulo} - Imagem ${index + 1}`}
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
            {asArray(selectedPasseio.linkVideos).length > 0 && (
              <div>
                <Text strong style={{ fontSize: 14, color: '#595959', display: 'block', marginBottom: 12 }}>
                  Vídeos:
                </Text>
                <Row gutter={[16, 16]}>
                  {asArray(selectedPasseio.linkVideos).map((videoUrl, index) => (
                    <Col key={index} span={12}>
                      <div style={{ 
                        borderRadius: 8, 
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }}>
                        <VideoWithAuth
                          key={`video-${selectedPasseio.id}-${index}`}
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

      {loading && !showForm && !selectedPasseio && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      )}

      {!loading && listaPasseios.length === 0 && (
        <Empty description="Nenhum passeio cadastrado ainda." />
      )}

      <Row gutter={[24, 24]}>
        {listaPasseios.map((passeio) => (
          <Col key={passeio.id} xs={24} sm={12} lg={8} xl={6}>
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
                    {passeio.linkImagens && passeio.linkImagens.length > 0 ? (
                      <ImageWithAuth
                        key={`${passeio.id}-${imageRefreshKey}`}
                        src={passeio.linkImagens[0]}
                        alt={passeio.titulo}
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
                  <div style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    textAlign: 'right',
                    alignItems: 'flex-end',
                    flexDirection: 'column',
                    gap: 8
                  }}>
                    {passeio.topRanking && (
                      <Tag 
                        color="gold"
                        style={{ 
                          margin: 0,
                          width: '40px',
                          fontWeight: 600,
                          fontSize: 9,
                          padding: '2px 6px',
                          borderRadius: 8,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          lineHeight: 1.2                        
                        }}
                      >
                        {formatTopRanking(passeio.topRanking)}
                      </Tag>
                    )}
                    {passeio.tag && (
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
                        {passeio.tag}
                      </Tag>
                    )}
                  </div>
                </div>
              }
              actions={[
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => onViewDetails(passeio.id)}
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
                  onClick={() => onEdit(passeio)}
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
                  title="Excluir passeio"
                  description="Tem certeza que deseja excluir este passeio?"
                  onConfirm={() => onDelete(passeio)}
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
                      {passeio.titulo}
                    </span>
                    <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                      <Tag>{passeio.categoriaDescricao || passeio.categoria}</Tag>
                      <Text style={{ fontSize: 12, color: '#8c8c8c' }}>
                        <ClockCircleOutlined /> {formatDuracao(passeio.duracao)}
                      </Text>
                    </div>
                  </div>
                }
                description={
                  <div>
                    <Text 
                      style={{ 
                        display: 'block', 
                        color: '#8c8c8c', 
                        fontSize: 14,
                        lineHeight: 1.6,
                        marginTop: 8,
                        marginBottom: 8
                      }}
                    >
                      {passeio.descricao}
                    </Text>
                    {asArray(passeio.itensIncluidos).length > 0 && (
                      <div style={{ 
                        marginTop: 12,
                        marginBottom: 8
                      }}>
                        <Text strong style={{ 
                          fontSize: 12, 
                          color: '#595959',
                          display: 'block',
                          marginBottom: 6
                        }}>
                          Itens Incluídos:
                        </Text>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {asArray(passeio.itensIncluidos).slice(0, 3).map((item, index) => (
                            <Tag 
                              key={index}
                              style={{ 
                                fontSize: 11,
                                margin: 0,
                                padding: '2px 8px',
                                borderRadius: 4
                              }}
                            >
                              {item}
                            </Tag>
                          ))}
                          {asArray(passeio.itensIncluidos).length > 3 && (
                            <Tag 
                              style={{ 
                                fontSize: 11,
                                margin: 0,
                                padding: '2px 8px',
                                borderRadius: 4,
                                color: '#8c8c8c'
                              }}
                            >
                              +{asArray(passeio.itensIncluidos).length - 3} mais
                            </Tag>
                          )}
                        </div>
                      </div>
                    )}
                    <div style={{ 
                      padding: '8px 12px', 
                      background: '#f0f7ff', 
                      borderRadius: 4,
                      marginTop: 8
                    }}>
                      <Text strong style={{ fontSize: 16, color: '#1890ff' }}>
                        {formatCurrency(passeio.valor)}
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

export default Passeio;

