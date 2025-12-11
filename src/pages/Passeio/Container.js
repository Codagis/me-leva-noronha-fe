import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import Passeio from './index';

const PasseioContainer = () => {
  const { showError, showSuccess } = useToast();
  const [passeios, setPasseios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedPasseio, setSelectedPasseio] = useState(null);
  const [editingPasseio, setEditingPasseio] = useState(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    tag: '',
    titulo: '',
    descricao: '',
    duracao: '',
    valor: '',
    itensIncluidos: [],
    linkWhatsapp: '',
    categoria: 'AQUATICOS',
    topRanking: null,
    imagem: null,
  });

  useEffect(() => {
    carregarPasseios();
  }, []);

  const carregarPasseios = async () => {
    setLoading(true);
    try {
      const response = await api.listarPasseios();
      setPasseios(response);
    } catch (err) {
      showError(err.message || 'Erro ao carregar passeios');
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

  const handleItensIncluidosChange = (itens) => {
    setFormData(prev => ({
      ...prev,
      itensIncluidos: itens,
    }));
  };

  const handleSubmit = async (e, formValues = null) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalValues = formValues ? {
        tag: formValues.tag,
        titulo: formValues.titulo,
        descricao: formValues.descricao,
        duracao: formValues.duracao,
        valor: formValues.valor,
        numeroWhatsapp: formValues.numeroWhatsapp,
        categoria: formValues.categoria,
        topRanking: formValues.topRanking,
        itensIncluidos: formValues.itensIncluidos || [],
      } : formData;
      
      if (finalValues.topRanking) {
        const passeioComMesmoRanking = passeios.find(p => 
          p.topRanking === finalValues.topRanking && 
          (!editingPasseio || p.id !== editingPasseio.id)
        );
        
        if (passeioComMesmoRanking) {
          const rankingFormatado = finalValues.topRanking.replace('_', ' ');
          showError(`Já existe um passeio com o ranking ${rankingFormatado}. Cada ranking só pode ser atribuído a um passeio.`);
          setLoading(false);
          return;
        }
      }

      const formDataToSend = new FormData();
      
      if (finalValues.tag) {
        formDataToSend.append('tag', finalValues.tag);
      }
      formDataToSend.append('titulo', finalValues.titulo);
      formDataToSend.append('descricao', finalValues.descricao);
      formDataToSend.append('duracao', finalValues.duracao);
      formDataToSend.append('valor', finalValues.valor);
      formDataToSend.append('numeroWhatsapp', finalValues.numeroWhatsapp);
      formDataToSend.append('categoria', finalValues.categoria);
      
      if (finalValues.topRanking) {
        formDataToSend.append('topRanking', finalValues.topRanking);
      }
      
      (finalValues.itensIncluidos || []).forEach((item) => {
        formDataToSend.append('itensIncluidos', item);
      });
      
      if (editingPasseio) {
        if (formData.imagem) {
          formDataToSend.append('imagem', formData.imagem);
        }
        await api.atualizarPasseio(editingPasseio.id, formDataToSend);
        showSuccess('Passeio atualizado com sucesso!');
      } else {
        formDataToSend.append('imagem', formData.imagem);
        await api.cadastrarPasseio(formDataToSend);
        showSuccess('Passeio cadastrado com sucesso!');
      }

      setFormData({
        tag: '',
        titulo: '',
        descricao: '',
        duracao: '',
        valor: '',
        itensIncluidos: [],
        numeroWhatsapp: '',
        categoria: 'AQUATICOS',
        topRanking: null,
        imagem: null,
      });
      setShowForm(false);
      setEditingPasseio(null);
      setSelectedPasseio(null);
      setImageRefreshKey(prev => prev + 1);
      resetFormData();
      setValidationErrors({});
      await carregarPasseios();
    } catch (err) {
      if (err.errors) {
        setValidationErrors(err.errors);
        if (err.errors.numeroWhatsapp) {
          const whatsappError = err.errors.numeroWhatsapp;
          showError(`Erro no WhatsApp: ${whatsappError}`);
        } else if (err.errors.itensIncluidos) {
          showError(`Erro nos Itens Incluídos: ${err.errors.itensIncluidos}`);
        } else {
          showError('Por favor, corrija os erros no formulário');
        }
        setLoading(false);
        return;
      }
      if (err.message && err.message.toLowerCase().includes('whatsapp')) {
        showError(err.message);
      } else {
        showError(err.message || 'Erro ao salvar passeio');
      }
      setValidationErrors({});
      setLoading(false);
    }
  };

  const handleViewDetails = async (id) => {
    setLoading(true);
    try {
      const passeio = await api.buscarPasseioPorId(id);
      setSelectedPasseio(passeio);
    } catch (err) {
      showError(err.message || 'Erro ao buscar detalhes do passeio');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDetails = () => {
    setSelectedPasseio(null);
  };

  const resetFormData = () => {
    setFormData({
      tag: '',
      titulo: '',
      descricao: '',
      duracao: '',
      valor: '',
      itensIncluidos: [],
      numeroWhatsapp: '',
      categoria: 'AQUATICOS',
      topRanking: null,
      imagem: null,
    });
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setValidationErrors({});
    setTimeout(() => {
      setEditingPasseio(null);
      resetFormData();
    }, 0);
  };

  const handleShowForm = () => {
    if (showForm) {
      setShowForm(false);
    }
    setEditingPasseio(null);
    setValidationErrors({});
    resetFormData();
    setTimeout(() => {
      setShowForm(true);
    }, 0);
  };

  const handleEdit = (passeio) => {
    setEditingPasseio(passeio);
    setFormData({
      tag: passeio.tag,
      titulo: passeio.titulo,
      descricao: passeio.descricao,
      duracao: passeio.duracao,
      valor: passeio.valor?.toString() || '',
      itensIncluidos: passeio.itensIncluidos || [],
      numeroWhatsapp: passeio.linkWhatsapp,
      categoria: passeio.categoria || 'AQUATICOS',
      topRanking: passeio.topRanking || null,
      imagem: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (passeio) => {
    if (!passeio) return;
    
    setLoading(true);
    try {
      await api.excluirPasseio(passeio.id);
      showSuccess('Passeio excluído com sucesso!');
      await carregarPasseios();
    } catch (err) {
      showError(err.message || 'Erro ao excluir passeio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Passeio
        passeios={passeios}
        loading={loading}
        showForm={showForm}
        selectedPasseio={selectedPasseio}
        editingPasseio={editingPasseio}
        formData={formData}
        imageRefreshKey={imageRefreshKey}
        validationErrors={validationErrors}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onItensIncluidosChange={handleItensIncluidosChange}
        onSubmit={handleSubmit}
        onShowForm={handleShowForm}
        onCloseForm={handleCloseForm}
        onViewDetails={handleViewDetails}
        onCloseDetails={handleCloseDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={carregarPasseios}
      />
    </Layout>
  );
};

export default PasseioContainer;

