import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
  Tag,
  Popconfirm,
  Table,
  Tooltip,
  Switch,
  Divider,
} from 'antd';
import {
  ReloadOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClearOutlined,
  PlusOutlined,
  EditOutlined,
  WhatsAppOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Link } = Typography;
const { TextArea } = Input;

const TIPOS = [
  { value: 'VEICULO_FECHADO', label: 'Veículo Fechado', color: 'blue' },
  { value: 'BICICLETA_ELETRICA', label: 'Bicicleta Elétrica', color: 'green' },
  { value: 'MOTO', label: 'Moto', color: 'orange' },
  { value: 'BUGGY', label: 'Buggy', color: 'volcano' },
];

const GRUPOS = [
  { value: 'INTERMEDIARIO', label: 'Grupo Intermediário', pix: 700, cartao: 780 },
  { value: 'ESPECIAL', label: 'Grupo Especial', pix: 850, cartao: 945 },
  { value: 'EXECUTIVO', label: 'Grupo Executivo', pix: 980, cartao: 1090 },
];

const tipoConfig = (tipo) => TIPOS.find(t => t.value === tipo) || { label: tipo, color: 'default' };

const formatarMoeda = (valor) => {
  if (valor == null) return '—';
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const AluguelVeiculos = ({
  veiculos,
  todosVeiculos,
  loading,
  showForm,
  editingVeiculo,
  tipoFiltro,
  searchTerm,
  onTipoFiltro,
  onSearch,
  onClearFilter,
  onSubmit,
  onShowForm,
  onCloseForm,
  onEdit,
  onToggleAtivo,
  onExcluir,
  onRefresh,
}) => {
  const [form] = Form.useForm();
  const [tipoSelecionado, setTipoSelecionado] = useState(null);

  const ehVeiculoFechado = tipoSelecionado === 'VEICULO_FECHADO';

  // Pré-preenche o form ao abrir edição
  useEffect(() => {
    if (showForm && editingVeiculo) {
      setTipoSelecionado(editingVeiculo.tipo);
      form.setFieldsValue({
        tipo: editingVeiculo.tipo,
        grupo: editingVeiculo.grupo || undefined,
        modelo: editingVeiculo.modelo || '',
        modelosReferencia: editingVeiculo.modelosReferencia || '',
        valorDiariaPix: editingVeiculo.valorDiariaPix != null ? Number(editingVeiculo.valorDiariaPix) : undefined,
        valorDiariaCartao: editingVeiculo.valorDiariaCartao != null ? Number(editingVeiculo.valorDiariaCartao) : undefined,
        parcelasCartao: editingVeiculo.parcelasCartao || undefined,
        linkWhatsapp: editingVeiculo.linkWhatsapp || '',
        descricao: editingVeiculo.descricao || '',
      });
    } else if (showForm && !editingVeiculo) {
      form.resetFields();
      setTipoSelecionado(null);
    }
  }, [showForm, editingVeiculo, form]);

  const handleTipoChange = (tipo) => {
    setTipoSelecionado(tipo);
    form.resetFields(['grupo', 'modelo', 'valorDiariaPix', 'valorDiariaCartao', 'parcelasCartao']);
  };

  const handleGrupoChange = (grupo) => {
    const g = GRUPOS.find(g => g.value === grupo);
    if (g) {
      form.setFieldsValue({
        modelo: g.label,
        valorDiariaPix: g.pix,
        valorDiariaCartao: g.cartao,
        parcelasCartao: 3,
      });
    }
  };

  const handleFormFinish = (values) => {
    onSubmit(values);
  };

  const handleCloseModal = () => {
    form.resetFields();
    setTipoSelecionado(null);
    onCloseForm();
  };

  // Estatísticas
  const total = todosVeiculos.length;
  const ativos = todosVeiculos.filter(v => v.ativo).length;
  const inativos = total - ativos;
  const contagemPorTipo = TIPOS.map(t => ({
    ...t,
    count: todosVeiculos.filter(v => v.tipo === t.value).length,
  }));

  const columns = [
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      width: 175,
      render: (tipo, record) => {
        const cfg = tipoConfig(tipo);
        return (
          <Space direction="vertical" size={2}>
            <Tag color={cfg.color} style={{ margin: 0 }}>{cfg.label}</Tag>
            {!record.ativo && <Tag color="default" style={{ margin: 0, fontSize: 11 }}>Inativo</Tag>}
          </Space>
        );
      },
    },
    {
      title: 'Modelo / Grupo',
      key: 'modelo',
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Text strong={record.ativo} style={{ fontSize: 14 }}>{record.modelo}</Text>
          {record.grupoDescricao && record.grupoDescricao !== record.modelo && (
            <Text type="secondary" style={{ fontSize: 12 }}>{record.grupoDescricao}</Text>
          )}
          {record.modelosReferencia && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              Ex: {record.modelosReferencia}
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Diária PIX',
      dataIndex: 'valorDiariaPix',
      key: 'valorDiariaPix',
      width: 130,
      align: 'right',
      render: (v) => (
        <Text strong style={{ color: '#389e0d' }}>{formatarMoeda(v)}</Text>
      ),
      sorter: (a, b) => Number(a.valorDiariaPix) - Number(b.valorDiariaPix),
    },
    {
      title: 'Diária Cartão',
      key: 'cartao',
      width: 155,
      align: 'right',
      render: (_, record) => (
        <Space direction="vertical" size={0} style={{ alignItems: 'flex-end' }}>
          <Text strong>{formatarMoeda(record.valorDiariaCartao)}</Text>
          {record.parcelasCartao && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              {record.parcelasCartao}x sem juros
            </Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Contato',
      key: 'contato',
      width: 80,
      align: 'center',
      render: (_, record) =>
        record.linkWhatsapp ? (
          <Tooltip title={record.linkWhatsapp}>
            <Link href={record.linkWhatsapp} target="_blank" rel="noopener noreferrer">
              <Button
                type="text"
                icon={<WhatsAppOutlined style={{ color: '#25D366', fontSize: 18 }} />}
              />
            </Link>
          </Tooltip>
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: 'Obs.',
      key: 'descricao',
      width: 55,
      align: 'center',
      render: (_, record) =>
        record.descricao ? (
          <Tooltip title={record.descricao}>
            <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
          </Tooltip>
        ) : null,
    },
    {
      title: 'Status',
      dataIndex: 'ativo',
      key: 'ativo',
      width: 95,
      align: 'center',
      render: (ativo, record) => (
        <Tooltip title={ativo ? 'Clique para desativar' : 'Clique para ativar'}>
          <Switch
            checked={ativo}
            onChange={() => onToggleAtivo(record)}
            loading={loading}
            checkedChildren="Ativo"
            unCheckedChildren="Inativo"
            size="small"
          />
        </Tooltip>
      ),
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 90,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              style={{ color: '#1890ff' }}
            />
          </Tooltip>
          <Popconfirm
            title="Excluir veículo"
            description={`Tem certeza que deseja excluir "${record.modelo}"?`}
            onConfirm={() => onExcluir(record)}
            okText="Sim"
            cancelText="Não"
          >
            <Tooltip title="Excluir">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const tabOptions = [
    { key: 'TODOS', label: `Todos (${total})` },
    ...contagemPorTipo.map(t => ({ key: t.value, label: `${t.label} (${t.count})` })),
  ];

  return (
    <div>
      {/* Cabeçalho */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 400, color: '#262626' }}>
              Aluguel de Veículos
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Gerencie os veículos disponíveis para aluguel em Fernando de Noronha
            </Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
              Atualizar
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={onShowForm}>
              Novo Veículo
            </Button>
          </Space>
        </div>

        {/* Filtros */}
        <Space style={{ flexWrap: 'wrap', marginBottom: 12 }}>
          <Input
            placeholder="Buscar por modelo, grupo ou tipo..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            allowClear
            style={{ width: 320 }}
          />
          {searchTerm && (
            <Button icon={<ClearOutlined />} onClick={onClearFilter}>
              Limpar
            </Button>
          )}
        </Space>

        {/* Tabs de tipo */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tabOptions.map(tab => (
            <Button
              key={tab.key}
              type={tipoFiltro === tab.key ? 'primary' : 'default'}
              size="small"
              onClick={() => onTipoFiltro(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Estatísticas */}
      {total > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Card size="small" style={{ minWidth: 110 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Total</Text>
              <div><Text strong style={{ fontSize: 20 }}>{total}</Text></div>
            </Card>
          </Col>
          <Col>
            <Card size="small" style={{ minWidth: 110 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Ativos</Text>
              <div><Text strong style={{ fontSize: 20, color: '#389e0d' }}>{ativos}</Text></div>
            </Card>
          </Col>
          <Col>
            <Card size="small" style={{ minWidth: 110 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Inativos</Text>
              <div><Text strong style={{ fontSize: 20, color: '#8c8c8c' }}>{inativos}</Text></div>
            </Card>
          </Col>
          {contagemPorTipo.filter(t => t.count > 0).map(t => (
            <Col key={t.value}>
              <Card size="small" style={{ minWidth: 130 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>{t.label}</Text>
                <div>
                  <Tag color={t.color} style={{ fontSize: 14, padding: '2px 8px' }}>{t.count}</Tag>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Tabela */}
      {loading && veiculos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={veiculos}
          columns={columns}
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: searchTerm
              ? <Empty description={`Nenhum veículo encontrado para "${searchTerm}"`} />
              : <Empty description="Nenhum veículo cadastrado ainda." />,
          }}
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
            hideOnSinglePage: true,
          }}
          rowClassName={(record) => !record.ativo ? 'row-inativo' : ''}
          style={{ background: '#fff' }}
        />
      )}

      {/* Aviso de tarifa */}
      {todosVeiculos.some(v => v.avisoTarifa) && (
        <div style={{ marginTop: 12 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            * {todosVeiculos.find(v => v.avisoTarifa)?.avisoTarifa}
          </Text>
        </div>
      )}

      {/* Modal de Cadastro / Edição */}
      <Modal
        title={
          <span style={{ fontSize: 20, fontWeight: 500, color: '#262626' }}>
            {editingVeiculo ? 'Editar Veículo' : 'Novo Veículo de Aluguel'}
          </span>
        }
        open={showForm}
        onCancel={handleCloseModal}
        footer={null}
        width={620}
        style={{ top: 40 }}
        styles={{ body: { padding: '32px' } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormFinish}
          key={editingVeiculo ? `edit-${editingVeiculo.id}` : 'new'}
        >
          {/* Tipo */}
          <Form.Item
            label="Tipo de Veículo"
            name="tipo"
            rules={[{ required: true, message: 'Selecione o tipo de veículo!' }]}
          >
            <Select
              placeholder="Selecione o tipo..."
              onChange={handleTipoChange}
              disabled={!!editingVeiculo}
              options={TIPOS.map(t => ({ value: t.value, label: t.label }))}
            />
          </Form.Item>

          {tipoSelecionado && (
            <>
              {ehVeiculoFechado ? (
                <>
                  <Form.Item
                    label="Grupo Tarifário"
                    name="grupo"
                    rules={[{ required: true, message: 'Selecione o grupo!' }]}
                  >
                    <Select
                      placeholder="Selecione o grupo..."
                      onChange={handleGrupoChange}
                      options={GRUPOS.map(g => ({
                        value: g.value,
                        label: `${g.label} — PIX R$ ${g.pix} | Cartão R$ ${g.cartao}`,
                      }))}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Nome / Descrição do grupo"
                    name="modelo"
                    rules={[
                      { required: true, message: 'Informe o nome!' },
                      { min: 2, max: 100, message: 'Entre 2 e 100 caracteres.' },
                    ]}
                    tooltip="Auto-preenchido ao selecionar o grupo. Pode ser personalizado."
                  >
                    <Input placeholder="Ex: Grupo Intermediário" maxLength={100} />
                  </Form.Item>

                  <Form.Item
                    label="Modelos de Referência"
                    name="modelosReferencia"
                    tooltip="Exemplos de modelos disponíveis neste grupo (exibido no app)"
                  >
                    <Input
                      placeholder="Ex: Hyundai Creta, Renault Duster, Jimmy"
                      maxLength={500}
                    />
                  </Form.Item>
                </>
              ) : (
                <Form.Item
                  label="Modelo"
                  name="modelo"
                  rules={[
                    { required: true, message: 'Informe o modelo!' },
                    { min: 2, max: 100, message: 'Modelo deve ter entre 2 e 100 caracteres.' },
                  ]}
                >
                  <Input placeholder="Ex: Honda CG 160" maxLength={100} />
                </Form.Item>
              )}

              <Divider style={{ margin: '12px 0' }} />

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Diária PIX (R$)"
                    name="valorDiariaPix"
                    rules={
                      ehVeiculoFechado
                        ? []
                        : [{ required: true, message: 'Informe o valor PIX!' }]
                    }
                    tooltip={ehVeiculoFechado ? 'Opcional — usa o padrão do grupo se vazio' : undefined}
                  >
                    <InputNumber
                      placeholder={ehVeiculoFechado ? 'Padrão do grupo' : 'Ex: 200.00'}
                      min={0.01}
                      precision={2}
                      style={{ width: '100%' }}
                      prefix="R$"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Diária Cartão (R$)"
                    name="valorDiariaCartao"
                    rules={
                      ehVeiculoFechado
                        ? []
                        : [{ required: true, message: 'Informe o valor cartão!' }]
                    }
                    tooltip={ehVeiculoFechado ? 'Opcional — usa o padrão do grupo se vazio' : undefined}
                  >
                    <InputNumber
                      placeholder={ehVeiculoFechado ? 'Padrão do grupo' : 'Ex: 220.00'}
                      min={0.01}
                      precision={2}
                      style={{ width: '100%' }}
                      prefix="R$"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label="Parcelas Cartão"
                    name="parcelasCartao"
                    rules={
                      ehVeiculoFechado
                        ? []
                        : [{ required: true, message: 'Informe as parcelas!' }]
                    }
                  >
                    <InputNumber
                      placeholder="Ex: 3"
                      min={1}
                      max={12}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item
                    label="Link WhatsApp"
                    name="linkWhatsapp"
                    rules={[{ type: 'url', message: 'Informe uma URL válida.' }]}
                  >
                    <Input placeholder="https://wa.me/5584999999999" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Descrição / Observação" name="descricao">
                <TextArea
                  placeholder="Ex: Inclui capacete e cadeado"
                  maxLength={500}
                  rows={2}
                  showCount
                />
              </Form.Item>
            </>
          )}

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCloseModal} disabled={loading} style={{ minWidth: 100 }}>
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ minWidth: 120 }}
                disabled={!tipoSelecionado}
              >
                {loading ? 'Salvando...' : editingVeiculo ? 'Salvar Alterações' : 'Cadastrar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .row-inativo td {
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
};

export default AluguelVeiculos;
