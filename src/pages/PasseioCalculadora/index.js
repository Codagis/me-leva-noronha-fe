import { useEffect } from 'react';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Typography,
  Row,
  Col,
  Spin,
  Empty,
  Tag,
  Popconfirm,
  Table,
  Switch,
  Tooltip,
} from 'antd';
import {
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ClearOutlined,
  CompassOutlined,
  PlusOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const formatarMoeda = (valor) => {
  if (valor == null) return '—';
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const PasseioCalculadora = ({
  passeios,
  loading,
  showForm,
  editingPasseio,
  formData,
  searchTerm,
  onInputChange,
  onSubmit,
  onShowForm,
  onCloseForm,
  onEdit,
  onToggleAtivo,
  onDelete,
  onRefresh,
  onSearch,
  onClearFilter,
}) => {
  const [form] = Form.useForm();

  // Preenche o form sempre que o modal abre ou o passeio em edição muda.
  // form.resetFields() limpa o store antigo antes de setar os novos valores,
  // garantindo que dados do passeio anterior não vazem para a edição atual.
  useEffect(() => {
    if (!showForm) return;
    form.resetFields();
    if (editingPasseio) {
      form.setFieldsValue({
        nome: editingPasseio.nome || '',
        valorPorPessoa: editingPasseio.valorPorPessoa != null ? Number(editingPasseio.valorPorPessoa) : 0,
      });
    }
  }, [showForm, editingPasseio, form]);

  const handleFormSubmit = (values) => {
    const fakeEvent = { preventDefault: () => {} };
    onSubmit(fakeEvent, {
      nome: values.nome,
      valorPorPessoa: values.valorPorPessoa,
    });
  };

  const columns = [
    {
      title: 'Nome do Passeio',
      dataIndex: 'nome',
      key: 'nome',
      render: (nome, record) => (
        <Space>
          <CompassOutlined style={{ color: '#1890ff' }} />
          <Text strong={record.ativo}>{nome}</Text>
          {!record.ativo && <Tag color="default">Inativo</Tag>}
        </Space>
      ),
    },
    {
      title: 'Valor por Pessoa',
      dataIndex: 'valorPorPessoa',
      key: 'valorPorPessoa',
      width: 160,
      align: 'right',
      render: (v) => (
        <Text strong style={{ color: Number(v) > 0 ? '#389e0d' : '#8c8c8c' }}>
          {formatarMoeda(v)}
        </Text>
      ),
      sorter: (a, b) => Number(a.valorPorPessoa) - Number(b.valorPorPessoa),
    },
    {
      title: 'Status',
      dataIndex: 'ativo',
      key: 'ativo',
      width: 100,
      align: 'center',
      render: (ativo, record) => (
        <Tooltip title={ativo ? 'Clique para desativar' : 'Clique para ativar'}>
          <Switch
            checked={ativo}
            onChange={() => onToggleAtivo(record)}
            loading={loading}
            checkedChildren="Ativo"
            unCheckedChildren="Inativo"
          />
        </Tooltip>
      ),
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 140,
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
            title="Excluir passeio"
            description={`Tem certeza que deseja excluir "${record.nome}"?`}
            onConfirm={() => onDelete(record)}
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
              Passeios da Calculadora
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Gerencie os passeios disponíveis para seleção na calculadora de viagem
            </Text>
          </div>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={onRefresh} loading={loading}>
              Atualizar
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={onShowForm}>
              Novo Passeio
            </Button>
          </Space>
        </div>

        <Space style={{ flexWrap: 'wrap' }}>
          <Input
            placeholder="Buscar por nome do passeio..."
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
      </div>

      {/* Estatísticas */}
      {passeios.length > 0 && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col>
            <Card size="small" style={{ minWidth: 120 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Total</Text>
              <div><Text strong style={{ fontSize: 20 }}>{passeios.length}</Text></div>
            </Card>
          </Col>
          <Col>
            <Card size="small" style={{ minWidth: 120 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Ativos</Text>
              <div>
                <Text strong style={{ fontSize: 20, color: '#389e0d' }}>
                  {passeios.filter(p => p.ativo).length}
                </Text>
              </div>
            </Card>
          </Col>
          <Col>
            <Card size="small" style={{ minWidth: 120 }}>
              <Text type="secondary" style={{ fontSize: 12 }}>Inativos</Text>
              <div>
                <Text strong style={{ fontSize: 20, color: '#8c8c8c' }}>
                  {passeios.filter(p => !p.ativo).length}
                </Text>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Tabela */}
      {loading && passeios.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={passeios}
          columns={columns}
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: searchTerm
              ? <Empty description={`Nenhum passeio encontrado para "${searchTerm}"`} />
              : <Empty description="Nenhum passeio cadastrado ainda." />,
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

      {/* Modal de Formulário */}
      <Modal
        title={
          <span style={{ fontSize: 20, fontWeight: 500, color: '#262626' }}>
            {editingPasseio ? 'Editar Passeio' : 'Novo Passeio da Calculadora'}
          </span>
        }
        open={showForm}
        onCancel={onCloseForm}
        footer={null}
        width={560}
        style={{ top: 40 }}
        styles={{ body: { padding: '32px' } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            label="Nome do Passeio"
            name="nome"
            rules={[
              { required: true, message: 'Por favor, informe o nome do passeio!' },
              { min: 2, max: 150, message: 'O nome deve ter entre 2 e 150 caracteres.' },
            ]}
          >
            <Input
              placeholder="Ex: Canoa Havaiana"
              disabled={loading}
              maxLength={150}
            />
          </Form.Item>

          <Form.Item
            label="Valor por Pessoa (R$)"
            name="valorPorPessoa"
            rules={[
              { required: true, message: 'Por favor, informe o valor por pessoa!' },
              { type: 'number', min: 0, message: 'O valor deve ser maior ou igual a zero.' },
            ]}
          >
            <InputNumber
              placeholder="Ex: 200.00"
              disabled={loading}
              min={0}
              precision={2}
              step={10}
              style={{ width: '100%' }}
              prefix="R$"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={onCloseForm} disabled={loading} style={{ minWidth: 100 }}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} style={{ minWidth: 100 }}>
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .row-inativo td {
          opacity: 0.55;
        }
      `}</style>
    </div>
  );
};

export default PasseioCalculadora;
