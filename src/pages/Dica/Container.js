import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import Dica from './index';

const DicaContainer = () => {
  const { showError, showSuccess } = useToast();
  const [dicas, setDicas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('pt');
  const [showForm, setShowForm] = useState(false);
  const [selectedDica, setSelectedDica] = useState(null);
  const [editingDica, setEditingDica] = useState(null);
  const [dicaToDelete, setDicaToDelete] = useState(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    tagPt: '',
    tituloPt: '',
    descricaoPt: '',
    tagEn: '',
    tituloEn: '',
    descricaoEn: '',
    tagEs: '',
    tituloEs: '',
    descricaoEs: '',
    numeroWhatsapp: '',
    imagens: [],
    videos: [],
    icone: null,
  });

  useEffect(() => {
    carregarDicas();
  }, [lang]);

  const carregarDicas = async () => {
    setLoading(true);
    try {
      const response = await api.listarDicas(lang);
      setDicas(Array.isArray(response) ? response : []);
    } catch (err) {
      showError(err.message || 'Erro ao carregar dicas');
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
      const fileArray = Array.from(files || []);
      setFormData(prev => ({
        ...prev,
        [name]: fileArray,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: files[0] || null,
      }));
    }
  };

  const resetFormData = () => {
    setFormData({
      tagPt: '',
      tituloPt: '',
      descricaoPt: '',
      tagEn: '',
      tituloEn: '',
      descricaoEn: '',
      tagEs: '',
      tituloEs: '',
      descricaoEs: '',
      numeroWhatsapp: '',
      imagens: [],
      videos: [],
      icone: null,
    });
  };

  const handleSubmit = async (e, formValues = null) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalValues = formValues ? {
        tagPt: formValues.tagPt,
        tituloPt: formValues.tituloPt,
        descricaoPt: formValues.descricaoPt,
        tagEn: formValues.tagEn,
        tituloEn: formValues.tituloEn,
        descricaoEn: formValues.descricaoEn,
        tagEs: formValues.tagEs,
        tituloEs: formValues.tituloEs,
        descricaoEs: formValues.descricaoEs,
        numeroWhatsapp: formValues.numeroWhatsapp,
      } : formData;

      const formDataToSend = new FormData();
      formDataToSend.append('tagPt', finalValues.tagPt || '');
      formDataToSend.append('tituloPt', finalValues.tituloPt);
      formDataToSend.append('descricaoPt', finalValues.descricaoPt || '');
      formDataToSend.append('tagEn', finalValues.tagEn || '');
      formDataToSend.append('tituloEn', finalValues.tituloEn || '');
      formDataToSend.append('descricaoEn', finalValues.descricaoEn || '');
      formDataToSend.append('tagEs', finalValues.tagEs || '');
      formDataToSend.append('tituloEs', finalValues.tituloEs || '');
      formDataToSend.append('descricaoEs', finalValues.descricaoEs || '');
      formDataToSend.append('numeroWhatsapp', finalValues.numeroWhatsapp);
      
      if (formData.imagens && formData.imagens.length > 0) {
        formData.imagens.forEach((imagem) => {
          formDataToSend.append('imagens', imagem);
        });
      }
      
      if (formData.videos && formData.videos.length > 0) {
        formData.videos.forEach((video) => {
          formDataToSend.append('videos', video);
        });
      }
      
      if (formData.icone) {
        formDataToSend.append('icone', formData.icone);
      }
      
      if (editingDica) {
        await api.atualizarDica(editingDica.id, formDataToSend);
        showSuccess('Dica atualizada com sucesso!');
      } else {
        await api.cadastrarDica(formDataToSend);
        showSuccess('Dica cadastrada com sucesso!');
      }

      resetFormData();
      setShowForm(false);
      setEditingDica(null);
      setSelectedDica(null);
      setImageRefreshKey(prev => prev + 1);
      setValidationErrors({});
      await carregarDicas();
    } catch (err) {
      if (err.errors) {
        setValidationErrors(err.errors);
        if (err.errors.numeroWhatsapp) {
          const whatsappError = err.errors.numeroWhatsapp;
          showError(`Erro no WhatsApp: ${whatsappError}`);
        } else {
          showError('Por favor, corrija os erros no formulário');
        }
        setLoading(false);
        return;
      }
      if (err.message && err.message.toLowerCase().includes('whatsapp')) {
        showError(err.message);
      } else {
        showError(err.message || 'Erro ao salvar dica');
      }
      setValidationErrors({});
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    setLoading(true);
    try {
      const dica = await api.buscarDicaPorId(id, lang);
      setSelectedDica(dica);
    } catch (err) {
      showError(err.message || 'Erro ao buscar detalhes da dica');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedDica(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setValidationErrors({});
    setTimeout(() => {
      setEditingDica(null);
      resetFormData();
    }, 0);
  };

  const handleShowForm = () => {
    if (showForm) {
      setShowForm(false);
    }
    setEditingDica(null);
    setValidationErrors({});
    resetFormData();
    setTimeout(() => {
      setShowForm(true);
    }, 0);
  };

  const handleEdit = (dica) => {
    setEditingDica(dica);
    const i18n = dica.i18n || {};
    setFormData({
      tagPt: i18n.pt?.tag || dica.tag || '',
      tituloPt: i18n.pt?.titulo || dica.titulo || '',
      descricaoPt: i18n.pt?.descricao || dica.descricao || '',
      tagEn: i18n.en?.tag || '',
      tituloEn: i18n.en?.titulo || '',
      descricaoEn: i18n.en?.descricao || '',
      tagEs: i18n.es?.tag || '',
      tituloEs: i18n.es?.titulo || '',
      descricaoEs: i18n.es?.descricao || '',
      numeroWhatsapp: dica.numeroWhatsapp || dica.linkWhatsapp || '',
      imagens: [],
      videos: [],
      icone: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (dica) => {
    if (!dica) return;
    
    setLoading(true);
    try {
      await api.excluirDica(dica.id);
      showSuccess('Dica excluída com sucesso!');
      await carregarDicas();
    } catch (err) {
      showError(err.message || 'Erro ao excluir dica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Dica
        dicas={dicas}
        loading={loading}
        lang={lang}
        onLangChange={setLang}
        showForm={showForm}
        selectedDica={selectedDica}
        editingDica={editingDica}
        dicaToDelete={dicaToDelete}
        formData={formData}
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
        onRefresh={carregarDicas}
        imageRefreshKey={imageRefreshKey}
      />
    </Layout>
  );
};

export default DicaContainer;
