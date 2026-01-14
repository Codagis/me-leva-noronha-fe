import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import VidaNoturna from './index';

const VidaNoturnaContainer = () => {
  const { showError, showSuccess } = useToast();
  const [vidaNoturnas, setVidaNoturnas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedVidaNoturna, setSelectedVidaNoturna] = useState(null);
  const [editingVidaNoturna, setEditingVidaNoturna] = useState(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    destaque: '',
    horarioFuncionamento: '',
    numeroWhatsapp: '',
    linkGoogleMaps: '',
    imagens: [],
    videos: [],
  });

  useEffect(() => {
    carregarVidaNoturnas();
  }, []);

  const carregarVidaNoturnas = async () => {
    setLoading(true);
    try {
      const response = await api.listarVidaNoturna();
      setVidaNoturnas(response);
    } catch (err) {
      showError(err.message || 'Erro ao carregar vida noturna');
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
    }
  };

  const resetFormData = () => {
    setFormData({
      titulo: '',
      descricao: '',
      destaque: '',
      horarioFuncionamento: '',
      numeroWhatsapp: '',
      linkGoogleMaps: '',
      imagens: [],
      videos: [],
    });
  };

  const handleSubmit = async (e, formValues = null) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalValues = formValues ? {
        titulo: formValues.titulo,
        descricao: formValues.descricao,
        destaque: formValues.destaque,
        horarioFuncionamento: formValues.horarioFuncionamento,
        numeroWhatsapp: formValues.numeroWhatsapp,
        linkGoogleMaps: formValues.linkGoogleMaps,
      } : formData;

      const formDataToSend = new FormData();
      formDataToSend.append('titulo', finalValues.titulo);
      formDataToSend.append('descricao', finalValues.descricao || '');
      formDataToSend.append('destaque', finalValues.destaque || '');
      formDataToSend.append('horarioFuncionamento', finalValues.horarioFuncionamento);
      formDataToSend.append('numeroWhatsapp', finalValues.numeroWhatsapp);
      formDataToSend.append('linkGoogleMaps', finalValues.linkGoogleMaps);
      
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
      
      if (editingVidaNoturna) {
        await api.atualizarVidaNoturna(editingVidaNoturna.id, formDataToSend);
        showSuccess('Estabelecimento atualizado com sucesso!');
      } else {
        await api.cadastrarVidaNoturna(formDataToSend);
        showSuccess('Estabelecimento cadastrado com sucesso!');
      }

      resetFormData();
      setShowForm(false);
      setEditingVidaNoturna(null);
      setSelectedVidaNoturna(null);
      setImageRefreshKey(prev => prev + 1);
      setValidationErrors({});
      await carregarVidaNoturnas();
    } catch (err) {
      if (err.errors) {
        setValidationErrors(err.errors);
        if (err.errors.numeroWhatsapp) {
          showError(`Erro no WhatsApp: ${err.errors.numeroWhatsapp}`);
        } else {
          showError('Por favor, corrija os erros no formulário');
        }
        setLoading(false);
        return;
      }
      if (err.message && err.message.toLowerCase().includes('whatsapp')) {
        showError(err.message);
      } else {
        showError(err.message || 'Erro ao salvar vida noturna');
      }
      setValidationErrors({});
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    setLoading(true);
    try {
      const vidaNoturna = await api.buscarVidaNoturnaPorId(id);
      setSelectedVidaNoturna(vidaNoturna);
    } catch (err) {
      showError(err.message || 'Erro ao buscar detalhes');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedVidaNoturna(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setValidationErrors({});
    setTimeout(() => {
      setEditingVidaNoturna(null);
      resetFormData();
    }, 0);
  };

  const handleShowForm = () => {
    if (showForm) {
      setShowForm(false);
    }
    setEditingVidaNoturna(null);
    setValidationErrors({});
    resetFormData();
    setTimeout(() => {
      setShowForm(true);
    }, 0);
  };

  const handleEdit = (vidaNoturna) => {
    setEditingVidaNoturna(vidaNoturna);
    setFormData({
      titulo: vidaNoturna.titulo || '',
      descricao: vidaNoturna.descricao || '',
      destaque: vidaNoturna.destaque || '',
      horarioFuncionamento: vidaNoturna.horarioFuncionamento || '',
      numeroWhatsapp: vidaNoturna.numeroWhatsapp || '',
      linkGoogleMaps: vidaNoturna.linkGoogleMaps || '',
      imagens: [],
      videos: [],
    });
    setShowForm(true);
  };

  const handleDelete = async (vidaNoturna) => {
    if (!vidaNoturna) return;
    
    setLoading(true);
    try {
      await api.excluirVidaNoturna(vidaNoturna.id);
      showSuccess('Estabelecimento excluído com sucesso!');
      await carregarVidaNoturnas();
    } catch (err) {
      showError(err.message || 'Erro ao excluir vida noturna');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <VidaNoturna
        vidaNoturnas={vidaNoturnas}
        loading={loading}
        showForm={showForm}
        selectedVidaNoturna={selectedVidaNoturna}
        editingVidaNoturna={editingVidaNoturna}
        formData={formData}
        imageRefreshKey={imageRefreshKey}
        validationErrors={validationErrors}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        onShowForm={handleShowForm}
        onCloseForm={handleCloseForm}
        onViewDetails={handleViewDetails}
        onCloseDetails={handleCloseDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={carregarVidaNoturnas}
      />
    </Layout>
  );
};

export default VidaNoturnaContainer;

