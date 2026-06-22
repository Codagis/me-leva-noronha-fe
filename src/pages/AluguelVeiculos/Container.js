import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import AluguelVeiculos from './index';

const AluguelVeiculosContainer = () => {
  const { showError, showSuccess } = useToast();
  const [veiculos, setVeiculos] = useState([]);
  const [veiculosFiltrados, setVeiculosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    carregarVeiculos();
  }, []);

  const carregarVeiculos = async () => {
    setLoading(true);
    try {
      const response = await api.listarVeiculosAluguel(false);
      setVeiculos(response);
      aplicarFiltros(response, tipoFiltro, searchTerm);
    } catch (err) {
      showError(err.message || 'Erro ao carregar veículos de aluguel');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = (lista, tipo, termo) => {
    let resultado = lista;
    if (tipo && tipo !== 'TODOS') {
      resultado = resultado.filter(v => v.tipo === tipo);
    }
    if (termo && termo.trim() !== '') {
      const termoLower = termo.toLowerCase().trim();
      resultado = resultado.filter(v =>
        (v.modelo || '').toLowerCase().includes(termoLower) ||
        (v.modelosReferencia || '').toLowerCase().includes(termoLower) ||
        (v.grupoDescricao || '').toLowerCase().includes(termoLower) ||
        (v.tipoDescricao || '').toLowerCase().includes(termoLower)
      );
    }
    setVeiculosFiltrados(resultado);
  };

  const handleTipoFiltro = (tipo) => {
    setTipoFiltro(tipo);
    aplicarFiltros(veiculos, tipo, searchTerm);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    aplicarFiltros(veiculos, tipoFiltro, value);
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    aplicarFiltros(veiculos, tipoFiltro, '');
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        tipo: values.tipo,
        modelo: values.modelo || values.grupo,
        grupo: values.grupo || null,
        modelosReferencia: values.modelosReferencia || null,
        valorDiariaPix: values.valorDiariaPix ? parseFloat(values.valorDiariaPix) : null,
        valorDiariaCartao: values.valorDiariaCartao ? parseFloat(values.valorDiariaCartao) : null,
        parcelasCartao: values.parcelasCartao ? parseInt(values.parcelasCartao, 10) : null,
        linkWhatsapp: values.linkWhatsapp || null,
        descricao: values.descricao || null,
      };

      if (editingVeiculo) {
        await api.atualizarVeiculoAluguel(editingVeiculo.id, payload);
        showSuccess('Veículo atualizado com sucesso!');
      } else {
        await api.cadastrarVeiculoAluguel(payload);
        showSuccess('Veículo cadastrado com sucesso!');
      }

      setShowForm(false);
      setEditingVeiculo(null);
      await carregarVeiculos();
    } catch (err) {
      showError(err.message || 'Erro ao salvar veículo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (veiculo) => {
    setEditingVeiculo(veiculo);
    setShowForm(true);
  };

  const handleToggleAtivo = async (veiculo) => {
    setLoading(true);
    try {
      if (veiculo.ativo) {
        await api.desativarVeiculoAluguel(veiculo.id);
        showSuccess(`"${veiculo.modelo}" desativado.`);
      } else {
        await api.ativarVeiculoAluguel(veiculo.id);
        showSuccess(`"${veiculo.modelo}" ativado.`);
      }
      await carregarVeiculos();
    } catch (err) {
      showError(err.message || 'Erro ao alterar status do veículo');
    } finally {
      setLoading(false);
    }
  };

  const handleExcluir = async (veiculo) => {
    setLoading(true);
    try {
      await api.excluirVeiculoAluguel(veiculo.id);
      showSuccess('Veículo excluído com sucesso!');
      await carregarVeiculos();
    } catch (err) {
      showError(err.message || 'Erro ao excluir veículo');
    } finally {
      setLoading(false);
    }
  };

  const handleShowForm = () => {
    setEditingVeiculo(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setTimeout(() => setEditingVeiculo(null), 0);
  };

  return (
    <Layout>
      <AluguelVeiculos
        veiculos={veiculosFiltrados}
        todosVeiculos={veiculos}
        loading={loading}
        showForm={showForm}
        editingVeiculo={editingVeiculo}
        tipoFiltro={tipoFiltro}
        searchTerm={searchTerm}
        onTipoFiltro={handleTipoFiltro}
        onSearch={handleSearch}
        onClearFilter={handleClearFilter}
        onSubmit={handleSubmit}
        onShowForm={handleShowForm}
        onCloseForm={handleCloseForm}
        onEdit={handleEdit}
        onToggleAtivo={handleToggleAtivo}
        onExcluir={handleExcluir}
        onRefresh={carregarVeiculos}
      />
    </Layout>
  );
};

export default AluguelVeiculosContainer;
