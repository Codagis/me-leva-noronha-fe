import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import Aeroporto from './index';

const AeroportoContainer = () => {
  const { showError, showSuccess } = useToast();
  const [aeroportos, setAeroportos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedAeroporto, setSelectedAeroporto] = useState(null);
  const [editingAeroporto, setEditingAeroporto] = useState(null);
  
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
    } catch (err) {
      showError(err.message || 'Erro ao carregar aeroportos');
    } finally {
      setLoading(false);
    }
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
    setEditingAeroporto(aeroporto);
    setFormData({
      cidade: aeroporto.cidade || '',
      nomeAeroporto: aeroporto.nomeAeroporto || '',
      codigoIATA: aeroporto.codigoIATA || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (aeroporto) => {
    if (!aeroporto) return;
    
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
        aeroportos={aeroportos}
        loading={loading}
        showForm={showForm}
        selectedAeroporto={selectedAeroporto}
        editingAeroporto={editingAeroporto}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onShowForm={handleShowForm}
        onCloseForm={handleCloseForm}
        onViewDetails={handleViewDetails}
        onCloseDetails={handleCloseDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={carregarAeroportos}
      />
    </Layout>
  );
};

export default AeroportoContainer;


