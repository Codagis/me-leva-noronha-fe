import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import PontoInteresse from './index';

const PontoInteresseContainer = () => {
  const { showError, showSuccess } = useToast();
  const [pontosInteresse, setPontosInteresse] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPontoInteresse, setSelectedPontoInteresse] = useState(null);
  const [editingPontoInteresse, setEditingPontoInteresse] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    tag: '',
    linkGoogleMaps: '',
  });

  useEffect(() => {
    carregarPontosInteresse();
  }, []);

  const carregarPontosInteresse = async () => {
    setLoading(true);
    try {
      const response = await api.listarPontosInteresse();
      setPontosInteresse(response);
    } catch (err) {
      showError(err.message || 'Erro ao carregar pontos de interesse');
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
      titulo: '',
      categoria: '',
      tag: '',
      linkGoogleMaps: '',
    });
  };

  const handleSubmit = async (e, formValues = null) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalValues = formValues ? {
        titulo: formValues.titulo,
        categoria: formValues.categoria,
        tag: formValues.tag,
        linkGoogleMaps: formValues.linkGoogleMaps,
      } : formData;

      if (editingPontoInteresse) {
        await api.atualizarPontoInteresse(editingPontoInteresse.id, finalValues);
        showSuccess('Ponto de interesse atualizado com sucesso!');
      } else {
        await api.cadastrarPontoInteresse(finalValues);
        showSuccess('Ponto de interesse cadastrado com sucesso!');
      }

      resetFormData();
      setShowForm(false);
      setEditingPontoInteresse(null);
      setSelectedPontoInteresse(null);
      setValidationErrors({});
      await carregarPontosInteresse();
    } catch (err) {
      if (err.errors) {
        setValidationErrors(err.errors);
        showError('Por favor, corrija os erros no formulário');
        setLoading(false);
        return;
      }
      showError(err.message || 'Erro ao salvar ponto de interesse');
      setValidationErrors({});
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    setLoading(true);
    try {
      const pontoInteresse = await api.buscarPontoInteressePorId(id);
      setSelectedPontoInteresse(pontoInteresse);
    } catch (err) {
      showError(err.message || 'Erro ao buscar detalhes do ponto de interesse');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedPontoInteresse(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setValidationErrors({});
    setTimeout(() => {
      setEditingPontoInteresse(null);
      resetFormData();
    }, 0);
  };

  const handleShowForm = () => {
    if (showForm) {
      setShowForm(false);
    }
    setEditingPontoInteresse(null);
    setValidationErrors({});
    resetFormData();
    setTimeout(() => {
      setShowForm(true);
    }, 0);
  };

  const handleEdit = (pontoInteresse) => {
    setEditingPontoInteresse(pontoInteresse);
    setFormData({
      titulo: pontoInteresse.titulo || '',
      categoria: pontoInteresse.categoria || '',
      tag: pontoInteresse.tag || '',
      linkGoogleMaps: pontoInteresse.linkGoogleMaps || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (pontoInteresse) => {
    if (!pontoInteresse) return;
    
    setLoading(true);
    try {
      await api.excluirPontoInteresse(pontoInteresse.id);
      showSuccess('Ponto de interesse excluído com sucesso!');
      await carregarPontosInteresse();
    } catch (err) {
      showError(err.message || 'Erro ao excluir ponto de interesse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <PontoInteresse
        pontosInteresse={pontosInteresse}
        loading={loading}
        showForm={showForm}
        selectedPontoInteresse={selectedPontoInteresse}
        editingPontoInteresse={editingPontoInteresse}
        formData={formData}
        validationErrors={validationErrors}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onShowForm={handleShowForm}
        onCloseForm={handleCloseForm}
        onViewDetails={handleViewDetails}
        onCloseDetails={handleCloseDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={carregarPontosInteresse}
      />
    </Layout>
  );
};

export default PontoInteresseContainer;

