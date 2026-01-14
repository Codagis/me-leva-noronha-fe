import { useState, useEffect, useRef } from 'react';
import { Alert, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import API_BASE_URL from '../config/api';

const VideoWithAuth = ({ src, ...props }) => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [downloading, setDownloading] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!src) {
      setError(true);
      setVideoSrc(null);
      setErrorMessage('URL do vídeo não fornecida');
      return;
    }

    setError(false);
    setErrorMessage('');

    const prepareVideoUrl = () => {
      try {
        // Se a URL já é completa, usar o endpoint proxy
        if (src.startsWith('http://') || src.startsWith('https://')) {
          // Usar endpoint proxy do backend
          const encodedUrl = encodeURIComponent(src);
          const proxyUrl = `${API_BASE_URL}/api/public/video?url=${encodedUrl}`;
          setVideoSrc(proxyUrl);
          return;
        }
        
        // Para URLs relativas, usar a API com autenticação (se necessário no futuro)
        if (!API_BASE_URL) {
          throw new Error('API_BASE_URL não está configurada.');
        }

        const proxyUrl = `${API_BASE_URL}${src.startsWith('/') ? src : '/' + src}`;
        setVideoSrc(proxyUrl);
      } catch (err) {
        console.error('Erro ao preparar URL do vídeo:', err);
        setError(true);
        setVideoSrc(null);
        setErrorMessage(err.message || 'Erro ao carregar vídeo');
      }
    };

    prepareVideoUrl();
  }, [src]);

  useEffect(() => {
    if (videoRef.current && videoSrc && !error) {
      // Forçar reload do vídeo quando a source mudar
      try {
        videoRef.current.load();
      } catch (err) {
        console.error('Erro ao carregar vídeo:', err);
      }
    }
  }, [videoSrc, error]);

  const handleDownload = async () => {
    if (!src) return;

    setDownloading(true);
    try {
      // Usar o endpoint proxy para download também
      const encodedUrl = encodeURIComponent(src);
      const downloadUrl = `${API_BASE_URL}/api/public/video?url=${encodedUrl}`;
      
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error(`Erro ao baixar vídeo: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Extrair nome do arquivo do URL
      const downloadFileName = src.includes('/') 
        ? src.split('/').pop().split('?')[0] 
        : 'video.mp4';
      
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Erro ao baixar vídeo:', err);
      setErrorMessage(err.message || 'Erro ao baixar vídeo');
    } finally {
      setDownloading(false);
    }
  };

  // Determinar o tipo MIME baseado na extensão do arquivo
  const getVideoType = (url) => {
    if (!url) return '';
    const urlLower = url.toLowerCase();
    if (urlLower.includes('.wmv')) {
      return 'video/x-ms-wmv';
    }
    if (urlLower.includes('.mp4')) {
      return 'video/mp4';
    }
    if (urlLower.includes('.webm')) {
      return 'video/webm';
    }
    if (urlLower.includes('.avi')) {
      return 'video/x-msvideo';
    }
    if (urlLower.includes('.mov')) {
      return 'video/quicktime';
    }
    if (urlLower.includes('.mkv')) {
      return 'video/x-matroska';
    }
    if (urlLower.includes('.flv')) {
      return 'video/x-flv';
    }
    return '';
  };

  const videoType = getVideoType(src);
  const isWMV = videoType.includes('wmv');

  if (error && !videoSrc) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        color: '#999',
        fontSize: '12px',
        minHeight: '100px',
        padding: '16px',
        ...props.style
      }}>
        <div>Erro ao carregar vídeo</div>
        {errorMessage && <div style={{ fontSize: '10px', marginTop: '8px', color: '#ff4d4f' }}>{errorMessage}</div>}
        {src && <div style={{ fontSize: '10px', marginTop: '4px', wordBreak: 'break-all' }}>URL: {src}</div>}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', ...props.style }}>
      {isWMV && (
        <Alert
          message="Aviso sobre formato WMV"
          description="O formato WMV pode não ser suportado por alguns navegadores. Se o vídeo não reproduzir, use o botão abaixo para baixar."
          type="info"
          showIcon
          closable
          style={{ marginBottom: '12px' }}
        />
      )}
      <video
        ref={videoRef}
        controls
        preload="metadata"
        playsInline
        style={{ 
          width: '100%', 
          display: 'block', 
          maxHeight: '500px',
          backgroundColor: '#000',
          borderRadius: '4px'
        }}
        onError={(e) => {
          const video = e.target;
          const error = video.error;
          let errorMsg = 'Erro ao reproduzir vídeo';
          
          if (error) {
            switch (error.code) {
              case error.MEDIA_ERR_ABORTED:
                errorMsg = 'Reprodução abortada';
                break;
              case error.MEDIA_ERR_NETWORK:
                errorMsg = 'Erro de rede ao carregar vídeo. Verifique sua conexão.';
                break;
              case error.MEDIA_ERR_DECODE:
                errorMsg = 'Formato de vídeo não suportado pelo navegador (possível problema com codec)';
                break;
              case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                errorMsg = 'Formato de vídeo não suportado';
                break;
              default:
                errorMsg = `Erro ${error.code}: Formato pode não ser suportado`;
            }
          }
          
          console.error('Erro ao reproduzir vídeo:', {
            code: error?.code,
            message: errorMsg,
            videoSrc,
            videoType
          });
          
          setError(true);
          setErrorMessage(errorMsg);
        }}
        onLoadedMetadata={() => {
          setError(false);
          setErrorMessage('');
        }}
        onCanPlay={() => {
          setError(false);
          setErrorMessage('');
        }}
        {...props}
      >
        {videoSrc && (
          <source src={videoSrc} type={videoType || undefined} />
        )}
        Seu navegador não suporta o elemento de vídeo.
      </video>
      {(isWMV || error) && (
        <div style={{ marginTop: '12px' }}>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            loading={downloading}
            block
          >
            {downloading ? 'Baixando...' : 'Baixar Vídeo'}
          </Button>
        </div>
      )}
      {errorMessage && error && (
        <Alert
          message="Erro ao reproduzir vídeo"
          description={errorMessage}
          type="error"
          showIcon
          style={{ marginTop: '12px' }}
        />
      )}
    </div>
  );
};

export default VideoWithAuth;
