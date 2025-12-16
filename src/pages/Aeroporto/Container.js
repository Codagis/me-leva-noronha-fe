import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import Aeroporto from './index';

const AeroportoContainer = () => {
  const { showError, showSuccess } = useToast();
  const [aeroportos, setAeroportos] = useState([]);
  const [aeroportosFiltrados, setAeroportosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedAeroporto, setSelectedAeroporto] = useState(null);
  const [editingAeroporto, setEditingAeroporto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    cidade: '',
    nomeAeroporto: '',
    codigoIATA: '',
  });

  useEffect(() => {
    carregarAeroportos();
  }, []);

  const carregarAeroportos = async () => {
    setLoading(true);
    try {
      const response = await api.listarAeroportos();
      setAeroportos(response);
      aplicarFiltro(response, searchTerm);
    } catch (err) {
      showError(err.message || 'Erro ao carregar aeroportos');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltro = (lista, termo) => {
    if (!termo || termo.trim() === '') {
      setAeroportosFiltrados(lista);
      return;
    }

    const termoLower = termo.toLowerCase().trim();
    const filtrados = lista.filter(aeroporto => {
      const cidade = (aeroporto.cidade || '').toLowerCase();
      const nomeAeroporto = (aeroporto.nomeAeroporto || '').toLowerCase();
      const codigoIATA = (aeroporto.codigoIATA || '').toLowerCase();
      
      return cidade.includes(termoLower) || 
             nomeAeroporto.includes(termoLower) || 
             codigoIATA.includes(termoLower);
    });
    
    setAeroportosFiltrados(filtrados);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    aplicarFiltro(aeroportos, value);
  };

  const handleClearFilter = () => {
    setSearchTerm('');
    setAeroportosFiltrados(aeroportos);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFormData = () => {
    setFormData({
      cidade: '',
      nomeAeroporto: '',
      codigoIATA: '',
    });
  };

  const handleSubmit = async (e, formValues = null) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalValues = formValues ? {
        cidade: formValues.cidade,
        nomeAeroporto: formValues.nomeAeroporto,
        codigoIATA: formValues.codigoIATA,
      } : formData;

      if (editingAeroporto) {
        if (!editingAeroporto.id) {
          showError('ID do aeroporto não encontrado');
          return;
        }
        await api.atualizarAeroporto(editingAeroporto.id, finalValues);
        showSuccess('Aeroporto atualizado com sucesso!');
      } else {
        await api.cadastrarAeroporto(finalValues);
        showSuccess('Aeroporto cadastrado com sucesso!');
      }

      resetFormData();
      setShowForm(false);
      setEditingAeroporto(null);
      setSelectedAeroporto(null);
      await carregarAeroportos();
    } catch (err) {
      showError(err.message || 'Erro ao salvar aeroporto');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (aeroporto) => {
    setSelectedAeroporto(aeroporto);
  };

  const handleCloseDetails = () => {
    setSelectedAeroporto(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setTimeout(() => {
      setEditingAeroporto(null);
      resetFormData();
    }, 0);
  };

  const handleShowForm = () => {
    if (showForm) {
      setShowForm(false);
    }
    setEditingAeroporto(null);
    resetFormData();
    setTimeout(() => {
      setShowForm(true);
    }, 0);
  };

  const handleEdit = (aeroporto) => {
    if (!aeroporto || !aeroporto.id) {
      showError('Aeroporto inválido para edição');
      return;
    }
    setEditingAeroporto(aeroporto);
    setFormData({
      cidade: aeroporto.cidade || '',
      nomeAeroporto: aeroporto.nomeAeroporto || '',
      codigoIATA: aeroporto.codigoIATA || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (aeroporto) => {
    if (!aeroporto || !aeroporto.id) {
      showError('Aeroporto inválido para exclusão');
      return;
    }
    
    setLoading(true);
    try {
      await api.excluirAeroporto(aeroporto.id);
      showSuccess('Aeroporto excluído com sucesso!');
      await carregarAeroportos();
    } catch (err) {
      showError(err.message || 'Erro ao excluir aeroporto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Aeroporto
        aeroportos={aeroportosFiltrados}
        loading={loading}
        showForm={showForm}
        selectedAeroporto={selectedAeroporto}
        editingAeroporto={editingAeroporto}
        formData={formData}
        searchTerm={searchTerm}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onShowForm={handleShowForm}
        onCloseForm={handleCloseForm}
        onViewDetails={handleViewDetails}
        onCloseDetails={handleCloseDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={carregarAeroportos}
        onSearch={handleSearch}
        onClearFilter={handleClearFilter}
      />
    </Layout>
  );
};

export default AeroportoContainer;



