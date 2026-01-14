import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import Restaurante from './index';

const RestauranteContainer = () => {
  const { showError, showSuccess } = useToast();
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedRestaurante, setSelectedRestaurante] = useState(null);
  const [editingRestaurante, setEditingRestaurante] = useState(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  const [categoriaFiltro, setCategoriaFiltro] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    numeroWhatsapp: '',
    categoria: 'ECONOMICO',
    imagens: [],
    videos: [],
    cardapio: null,
    tipoAcao: null,
  });

  useEffect(() => {
    carregarRestaurantes();
  }, [categoriaFiltro]);

  const carregarRestaurantes = async () => {
    setLoading(true);
    try {
      const response = await api.listarRestaurantes(categoriaFiltro);
      setRestaurantes(response);
    } catch (err) {
      showError(err.message || 'Erro ao carregar restaurantes');
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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'imagens' || name === 'videos') {
      // Para múltiplas imagens/vídeos, manter todas as selecionadas
      const fileArray = Array.from(files || []);
      setFormData(prev => ({
        ...prev,
        [name]: fileArray,
      }));
    } else {
      // Para cardápio, manter apenas um arquivo
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null,
      }));
    }
  };

  const handleCategoriaFiltroChange = (value) => {
    setCategoriaFiltro(value || null);
  };

  const resetFormData = () => {
    setFormData({
      nome: '',
      descricao: '',
      numeroWhatsapp: '',
      categoria: 'ECONOMICO',
      imagens: [],
      videos: [],
      cardapio: null,
      tipoAcao: null,
    });
  };

  const handleSubmit = async (e, formValues = null) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalValues = formValues ? {
        nome: formValues.nome,
        descricao: formValues.descricao,
        numeroWhatsapp: formValues.numeroWhatsapp,
        categoria: formValues.categoria,
        tipoAcao: formValues.tipoAcao,
      } : formData;

      const formDataToSend = new FormData();
      formDataToSend.append('nome', finalValues.nome);
      formDataToSend.append('descricao', finalValues.descricao);
      formDataToSend.append('numeroWhatsapp', finalValues.numeroWhatsapp);
      formDataToSend.append('categoria', finalValues.categoria);
      formDataToSend.append('tipoAcao', finalValues.tipoAcao || '');
      
      // Adicionar múltiplas imagens
      if (formData.imagens && formData.imagens.length > 0) {
        formData.imagens.forEach((imagem) => {
          formDataToSend.append('imagens', imagem);
        });
      }
      
      // Adicionar múltiplos vídeos
      if (formData.videos && formData.videos.length > 0) {
        formData.videos.forEach((video) => {
          formDataToSend.append('videos', video);
        });
      }
      
      if (formData.cardapio) {
        formDataToSend.append('cardapio', formData.cardapio);
      }
      
      if (editingRestaurante) {
        await api.atualizarRestaurante(editingRestaurante.id, formDataToSend);
        showSuccess('Restaurante atualizado com sucesso!');
      } else {
        await api.cadastrarRestaurante(formDataToSend);
        showSuccess('Restaurante cadastrado com sucesso!');
      }

      resetFormData();
      setShowForm(false);
      setEditingRestaurante(null);
      setSelectedRestaurante(null);
      setImageRefreshKey(prev => prev + 1);
      setValidationErrors({});
      await carregarRestaurantes();
    } catch (err) {
      if (err.errors) {
        setValidationErrors(err.errors);
        if (err.errors.numeroWhatsapp) {
          showError(`Erro no WhatsApp: ${err.errors.numeroWhatsapp}`);
        } else {
          showError('Por favor, corrija os erros no formulário');
        }
        return;
      }
      if (err.message && err.message.toLowerCase().includes('whatsapp')) {
        showError(err.message);
      } else {
        showError(err.message || 'Erro ao salvar restaurante');
      }
      setValidationErrors({});
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    setLoading(true);
    try {
      const restaurante = await api.buscarRestaurantePorId(id);
      setSelectedRestaurante(restaurante);
    } catch (err) {
      showError(err.message || 'Erro ao buscar detalhes do restaurante');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedRestaurante(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setValidationErrors({});
    setTimeout(() => {
      setEditingRestaurante(null);
      resetFormData();
    }, 0);
  };

  const handleShowForm = () => {
    if (showForm) {
      setShowForm(false);
    }
    setEditingRestaurante(null);
    setValidationErrors({});
    resetFormData();
    setTimeout(() => {
      setShowForm(true);
    }, 0);
  };

  const handleEdit = (restaurante) => {
    setEditingRestaurante(restaurante);
    setFormData({
      nome: restaurante.nome || '',
      descricao: restaurante.descricao || '',
      numeroWhatsapp: restaurante.numeroWhatsapp || '',
      categoria: restaurante.categoria || 'ECONOMICO',
      imagens: [],
      videos: [],
      cardapio: null,
      tipoAcao: restaurante.tipoAcao || null,
    });
    setShowForm(true);
  };

  const handleDelete = async (restaurante) => {
    if (!restaurante) return;
    
    setLoading(true);
    try {
      await api.excluirRestaurante(restaurante.id);
      showSuccess('Restaurante excluído com sucesso!');
      await carregarRestaurantes();
    } catch (err) {
      showError(err.message || 'Erro ao excluir restaurante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Restaurante
        restaurantes={restaurantes}
        loading={loading}
        showForm={showForm}
        selectedRestaurante={selectedRestaurante}
        editingRestaurante={editingRestaurante}
        formData={formData}
        imageRefreshKey={imageRefreshKey}
        categoriaFiltro={categoriaFiltro}
        validationErrors={validationErrors}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onCategoriaFiltroChange={handleCategoriaFiltroChange}
        onSubmit={handleSubmit}
        onShowForm={handleShowForm}
        onCloseForm={handleCloseForm}
        onViewDetails={handleViewDetails}
        onCloseDetails={handleCloseDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={carregarRestaurantes}
      />
    </Layout>
  );
};

export default RestauranteContainer;

