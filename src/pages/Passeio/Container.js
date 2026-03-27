import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useToast } from '../../contexts/ToastContext';
import api from '../../services/api';
import Passeio from './index';

const PasseioContainer = () => {
  const { showError, showSuccess } = useToast();
  const [passeios, setPasseios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState('pt');
  const [showForm, setShowForm] = useState(false);
  const [selectedPasseio, setSelectedPasseio] = useState(null);
  const [editingPasseio, setEditingPasseio] = useState(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  
  const [formData, setFormData] = useState({
    tituloPt: '',
    descricaoPt: '',
    tagPt: '',
    tagsPt: [],
    tituloEn: '',
    descricaoEn: '',
    tagEn: '',
    tagsEn: [],
    tituloEs: '',
    descricaoEs: '',
    tagEs: '',
    tagsEs: [],
    duracao: '',
    valor: '',
    itensIncluidosPt: [],
    itensIncluidosEn: [],
    itensIncluidosEs: [],
    numeroWhatsapp: '',
    categoria: 'AQUATICOS',
    topRanking: null,
    imagens: [],
    videos: [],
    perguntasRespostasPt: [],
    perguntasRespostasEn: [],
    perguntasRespostasEs: [],
  });

  useEffect(() => {
    carregarPasseios();
  }, [lang]);

  const carregarPasseios = async () => {
    setLoading(true);
    try {
      const response = await api.listarPasseios(lang);
      setPasseios(Array.isArray(response) ? response : []);
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
    if (name === 'imagens' || name === 'videos') {
      // Para múltiplas imagens/vídeos, manter todas as selecionadas
      const fileArray = Array.from(files || []);
      setFormData(prev => ({
        ...prev,
        [name]: fileArray,
      }));
    }
  };

  const handleSubmit = async (e, formValues = null) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalValues = formValues ? {
        tituloPt: formValues.tituloPt,
        descricaoPt: formValues.descricaoPt,
        tagPt: formValues.tagPt,
        tagsPt: formValues.tagsPt || [],
        tituloEn: formValues.tituloEn,
        descricaoEn: formValues.descricaoEn,
        tagEn: formValues.tagEn,
        tagsEn: formValues.tagsEn || [],
        tituloEs: formValues.tituloEs,
        descricaoEs: formValues.descricaoEs,
        tagEs: formValues.tagEs,
        tagsEs: formValues.tagsEs || [],
        duracao: formValues.duracao,
        valor: formValues.valor,
        numeroWhatsapp: formValues.numeroWhatsapp,
        categoria: formValues.categoria,
        topRanking: formValues.topRanking,
        itensIncluidosPt: formValues.itensIncluidosPt || [],
        itensIncluidosEn: formValues.itensIncluidosEn || [],
        itensIncluidosEs: formValues.itensIncluidosEs || [],
        perguntasRespostasPt: formValues.perguntasRespostasPt || [],
        perguntasRespostasEn: formValues.perguntasRespostasEn || [],
        perguntasRespostasEs: formValues.perguntasRespostasEs || [],
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
      
      formDataToSend.append('tituloPt', finalValues.tituloPt);
      formDataToSend.append('descricaoPt', finalValues.descricaoPt);
      if (finalValues.tagPt) formDataToSend.append('tagPt', finalValues.tagPt);
      (finalValues.tagsPt || []).forEach((t) => formDataToSend.append('tagsPt', t));

      if (finalValues.tituloEn) formDataToSend.append('tituloEn', finalValues.tituloEn);
      if (finalValues.descricaoEn) formDataToSend.append('descricaoEn', finalValues.descricaoEn);
      if (finalValues.tagEn) formDataToSend.append('tagEn', finalValues.tagEn);
      (finalValues.tagsEn || []).forEach((t) => formDataToSend.append('tagsEn', t));

      if (finalValues.tituloEs) formDataToSend.append('tituloEs', finalValues.tituloEs);
      if (finalValues.descricaoEs) formDataToSend.append('descricaoEs', finalValues.descricaoEs);
      if (finalValues.tagEs) formDataToSend.append('tagEs', finalValues.tagEs);
      (finalValues.tagsEs || []).forEach((t) => formDataToSend.append('tagsEs', t));

      formDataToSend.append('duracao', finalValues.duracao);
      formDataToSend.append('valor', finalValues.valor);
      formDataToSend.append('numeroWhatsapp', finalValues.numeroWhatsapp);
      formDataToSend.append('categoria', finalValues.categoria);
      
      if (finalValues.topRanking) {
        formDataToSend.append('topRanking', finalValues.topRanking);
      }
      
      (finalValues.itensIncluidosPt || []).forEach((item) => formDataToSend.append('itensIncluidosPt', item));
      (finalValues.itensIncluidosEn || []).forEach((item) => formDataToSend.append('itensIncluidosEn', item));
      (finalValues.itensIncluidosEs || []).forEach((item) => formDataToSend.append('itensIncluidosEs', item));
      
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
      
      // Adicionar perguntas e respostas
      if (finalValues.perguntasRespostasPt && finalValues.perguntasRespostasPt.length > 0) {
        finalValues.perguntasRespostasPt.forEach((pr, index) => {
          if (pr.pergunta && pr.resposta) {
            formDataToSend.append(`perguntasRespostasPt[${index}].pergunta`, pr.pergunta);
            formDataToSend.append(`perguntasRespostasPt[${index}].resposta`, pr.resposta);
          }
        });
      }
      if (finalValues.perguntasRespostasEn && finalValues.perguntasRespostasEn.length > 0) {
        finalValues.perguntasRespostasEn.forEach((pr, index) => {
          if (pr.pergunta && pr.resposta) {
            formDataToSend.append(`perguntasRespostasEn[${index}].pergunta`, pr.pergunta);
            formDataToSend.append(`perguntasRespostasEn[${index}].resposta`, pr.resposta);
          }
        });
      }
      if (finalValues.perguntasRespostasEs && finalValues.perguntasRespostasEs.length > 0) {
        finalValues.perguntasRespostasEs.forEach((pr, index) => {
          if (pr.pergunta && pr.resposta) {
            formDataToSend.append(`perguntasRespostasEs[${index}].pergunta`, pr.pergunta);
            formDataToSend.append(`perguntasRespostasEs[${index}].resposta`, pr.resposta);
          }
        });
      }
      
      if (editingPasseio) {
        await api.atualizarPasseio(editingPasseio.id, formDataToSend);
        showSuccess('Passeio atualizado com sucesso!');
      } else {
        await api.cadastrarPasseio(formDataToSend);
        showSuccess('Passeio cadastrado com sucesso!');
      }

      setFormData({
        tituloPt: '',
        descricaoPt: '',
        tagPt: '',
        tagsPt: [],
        tituloEn: '',
        descricaoEn: '',
        tagEn: '',
        tagsEn: [],
        tituloEs: '',
        descricaoEs: '',
        tagEs: '',
        tagsEs: [],
        duracao: '',
        valor: '',
        itensIncluidosPt: [],
        itensIncluidosEn: [],
        itensIncluidosEs: [],
        numeroWhatsapp: '',
        categoria: 'AQUATICOS',
        topRanking: null,
        imagens: [],
        videos: [],
        perguntasRespostasPt: [],
        perguntasRespostasEn: [],
        perguntasRespostasEs: [],
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
      const passeio = await api.buscarPasseioPorId(id, lang);
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
      tituloPt: '',
      descricaoPt: '',
      tagPt: '',
      tagsPt: [],
      tituloEn: '',
      descricaoEn: '',
      tagEn: '',
      tagsEn: [],
      tituloEs: '',
      descricaoEs: '',
      tagEs: '',
      tagsEs: [],
      duracao: '',
      valor: '',
      itensIncluidosPt: [],
      itensIncluidosEn: [],
      itensIncluidosEs: [],
      numeroWhatsapp: '',
      categoria: 'AQUATICOS',
      topRanking: null,
      imagens: [],
      perguntasRespostasPt: [],
      perguntasRespostasEn: [],
      perguntasRespostasEs: [],
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
    const i18n = passeio?.i18n || {};
    setFormData({
      tituloPt: i18n.pt?.titulo || passeio.titulo || '',
      descricaoPt: i18n.pt?.descricao || passeio.descricao || '',
      tagPt: i18n.pt?.tag || passeio.tag || '',
      tagsPt: i18n.pt?.tags || passeio.tags || [],
      tituloEn: i18n.en?.titulo || '',
      descricaoEn: i18n.en?.descricao || '',
      tagEn: i18n.en?.tag || '',
      tagsEn: i18n.en?.tags || [],
      tituloEs: i18n.es?.titulo || '',
      descricaoEs: i18n.es?.descricao || '',
      tagEs: i18n.es?.tag || '',
      tagsEs: i18n.es?.tags || [],
      duracao: passeio.duracao,
      valor: passeio.valor?.toString() || '',
      itensIncluidosPt: i18n.pt?.itensIncluidos || [],
      itensIncluidosEn: i18n.en?.itensIncluidos || [],
      itensIncluidosEs: i18n.es?.itensIncluidos || [],
      numeroWhatsapp: passeio.numeroWhatsapp || passeio.linkWhatsapp || '',
      categoria: passeio.categoria || 'AQUATICOS',
      topRanking: passeio.topRanking || null,
      imagens: [],
      videos: [],
      perguntasRespostasPt: i18n.pt?.perguntasRespostas || passeio.perguntasRespostas || [],
      perguntasRespostasEn: i18n.en?.perguntasRespostas || [],
      perguntasRespostasEs: i18n.es?.perguntasRespostas || [],
    });
    setShowForm(true);
  };

  const handlePerguntasRespostasChange = (idioma, perguntasRespostas) => {
    setFormData(prev => ({
      ...prev,
      [idioma]: perguntasRespostas,
    }));
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
        lang={lang}
        onLangChange={setLang}
        showForm={showForm}
        selectedPasseio={selectedPasseio}
        editingPasseio={editingPasseio}
        formData={formData}
        imageRefreshKey={imageRefreshKey}
        validationErrors={validationErrors}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onPerguntasRespostasChange={handlePerguntasRespostasChange}
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

