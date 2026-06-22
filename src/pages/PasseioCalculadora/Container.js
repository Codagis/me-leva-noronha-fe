import { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import PasseioCalculadora from './index';

const PasseioCalculadoraContainer = () => {
  const { showError, showSuccess } = useToast();
  const [passeios, setPasseios] = useState([]);
  const [passeiosFiltrados, setPasseiosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPasseio, setEditingPasseio] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Ref garante valor atual mesmo dentro de closures antigas do Ant Design Form
  const editingPasseioRef = useRef(null);

  const [formData, setFormData] = useState({
    nome: '',
    valorPorPessoa: '',
  });

  useEffect(() => {
    carregarPasseios();
  }, []);

  const carregarPasseios = async () => {
    setLoading(true);
    try {
      const response = await api.listarPasseiosCalculadora();
      setPasseios(response);
      aplicarFiltro(response, searchTerm);
    } catch (err) {
      showError(err.message || 'Erro ao carregar passeios da calculadora');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltro = (lista, termo) => {
    if (!termo || termo.trim() === '') {
      setPasseiosFiltrados(lista);
      return;
    }
    const termoLower = termo.toLowerCase().trim();
    setPasseiosFiltrados(lista.filter(p => (p.nome || '').toLowerCase().includes(termoLower)));
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    aplicarFiltro(passeios, value);
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setPasseiosFiltrados(passeios);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetFormData = () => {
    setFormData({ nome: '', valorPorPessoa: '' });
  };

  const handleSubmit = async (e, formValues = null) => {
    e.preventDefault();
    setLoading(true);

    // Lê do ref — garante o valor atual independente de qual closure chamou
    const passeioEmEdicao = editingPasseioRef.current;

    try {
      const raw = formValues || formData;
      const payload = {
        nome: raw.nome,
        valorPorPessoa: parseFloat(raw.valorPorPessoa),
      };

      if (passeioEmEdicao) {
        await api.atualizarPasseioCalculadora(passeioEmEdicao.id, payload);
        showSuccess('Passeio atualizado com sucesso!');
      } else {
        await api.cadastrarPasseioCalculadora(payload);
        showSuccess('Passeio cadastrado com sucesso!');
      }

      editingPasseioRef.current = null;
      setEditingPasseio(null);
      resetFormData();
      setShowForm(false);
      await carregarPasseios();
    } catch (err) {
      showError(err.message || 'Erro ao salvar passeio');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (passeio) => {
    editingPasseioRef.current = passeio;
    setEditingPasseio(passeio);
    setFormData({
      nome: passeio.nome || '',
      valorPorPessoa: passeio.valorPorPessoa != null ? String(passeio.valorPorPessoa) : '',
    });
    setShowForm(true);
  };

  const handleToggleAtivo = async (passeio) => {
    setLoading(true);
    try {
      if (passeio.ativo) {
        await api.desativarPasseioCalculadora(passeio.id);
        showSuccess(`"${passeio.nome}" desativado.`);
      } else {
        await api.ativarPasseioCalculadora(passeio.id);
        showSuccess(`"${passeio.nome}" ativado.`);
      }
      await carregarPasseios();
    } catch (err) {
      showError(err.message || 'Erro ao alterar status do passeio');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (passeio) => {
    setLoading(true);
    try {
      await api.excluirPasseioCalculadora(passeio.id);
      showSuccess('Passeio excluído com sucesso!');
      await carregarPasseios();
    } catch (err) {
      showError(err.message || 'Erro ao excluir passeio');
    } finally {
      setLoading(false);
    }
  };

  const handleShowForm = () => {
    editingPasseioRef.current = null;
    setEditingPasseio(null);
    resetFormData();
    setShowForm(true);
  };

  const handleCloseForm = () => {
    editingPasseioRef.current = null;
    setShowForm(false);
    setEditingPasseio(null);
    resetFormData();
  };

  return (
    <Layout>
      <PasseioCalculadora
        passeios={passeiosFiltrados}
        loading={loading}
        showForm={showForm}
        editingPasseio={editingPasseio}
        formData={formData}
        searchTerm={searchTerm}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onShowForm={handleShowForm}
        onCloseForm={handleCloseForm}
        onEdit={handleEdit}
        onToggleAtivo={handleToggleAtivo}
        onDelete={handleDelete}
        onRefresh={carregarPasseios}
        onSearch={handleSearch}
        onClearFilter={handleClearFilter}
      />
    </Layout>
  );
};

export default PasseioCalculadoraContainer;
