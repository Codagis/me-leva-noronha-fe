import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import Dica from './index';

const DicaContainer = () => {
  const { showError, showSuccess } = useToast();
  const [dicas, setDicas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedDica, setSelectedDica] = useState(null);
  const [editingDica, setEditingDica] = useState(null);
  const [dicaToDelete, setDicaToDelete] = useState(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    tag: '',
    titulo: '',
    descricao: '',
    linkWhatsapp: '',
    imagem: null,
    icone: null,
  });

  useEffect(() => {
    carregarDicas();
  }, []);

  const carregarDicas = async () => {
    setLoading(true);
    try {
      const response = await api.listarDicas();
      setDicas(response);
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
    setFormData(prev => ({
      ...prev,
      [name]: files[0] || null,
    }));
  };

  const resetFormData = () => {
    setFormData({
      tag: '',
      titulo: '',
      descricao: '',
      numeroWhatsapp: '',
      imagem: null,
      icone: null,
    });
  };

  const handleSubmit = async (e, formValues = null) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalValues = formValues ? {
        tag: formValues.tag,
        titulo: formValues.titulo,
        descricao: formValues.descricao,
        numeroWhatsapp: formValues.numeroWhatsapp,
      } : formData;

      const formDataToSend = new FormData();
      if (finalValues.tag) {
        formDataToSend.append('tag', finalValues.tag);
      }
      formDataToSend.append('titulo', finalValues.titulo);
      formDataToSend.append('descricao', finalValues.descricao || '');
      formDataToSend.append('numeroWhatsapp', finalValues.numeroWhatsapp);
      
      if (editingDica) {
        if (formData.imagem) {
          formDataToSend.append('imagem', formData.imagem);
        }
        if (formData.icone) {
          formDataToSend.append('icone', formData.icone);
        }
        await api.atualizarDica(editingDica.id, formDataToSend);
        showSuccess('Dica atualizada com sucesso!');
      } else {
        formDataToSend.append('imagem', formData.imagem);
        formDataToSend.append('icone', formData.icone);
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
      const dica = await api.buscarDicaPorId(id);
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
    setFormData({
      tag: dica.tag || '',
      titulo: dica.titulo || '',
      descricao: dica.descricao || '',
      numeroWhatsapp: dica.linkWhatsapp || '',
      imagem: null,
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

