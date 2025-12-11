import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

const ImageWithAuth = ({ src, alt, className, ...props }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }

    setError(false);
    let objectUrl = null;

    const loadImage = async () => {
      try {
        if (!API_BASE_URL) {
          throw new Error('API_BASE_URL não está configurada.');
        }

        const token = localStorage.getItem('accessToken');
        
        let imageUrl = src;
        if (!src.startsWith('http')) {
          imageUrl = `${API_BASE_URL}${src}`;
        }

        const separator = imageUrl.includes('?') ? '&' : '?';
        const cacheBuster = `_t=${Date.now()}`;
        imageUrl = `${imageUrl}${separator}${cacheBuster}`;

        const response = await fetch(imageUrl, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            'Cache-Control': 'no-cache',
          },
        });

        if (!response.ok) {
          throw new Error('Erro ao carregar imagem');
        }

        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } catch (err) {
        setError(true);
        setImageSrc(null);
      }
    };

    loadImage();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [src]);

  if (error || !imageSrc) {
    return (
      <div className={className} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        color: '#999',
        fontSize: '12px'
      }}>
        Sem imagem
      </div>
    );
  }

  return <img src={imageSrc} alt={alt} className={className} {...props} />;
};

export default ImageWithAuth;

