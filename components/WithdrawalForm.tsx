import React, { useState, useRef, useEffect } from 'react';
import { Camera, Save, MapPin, X } from 'lucide-react';
import Header from '../components/Header';
import { User, Withdrawal } from '../types';
import { WithdrawalService } from '../services/db';

interface Props {
  currentUser: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const WithdrawalForm: React.FC<Props> = ({ currentUser, onSuccess, onCancel }) => {
  const [recipientName, setRecipientName] = useState('');
  const [nfNumber, setNfNumber] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationStatus('success');
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
          setLocationStatus('error');
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationStatus('error');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !nfNumber || !imagePreview) {
      alert('Por favor, preencha todos os campos e anexe a foto do canhoto.');
      return;
    }

    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      const newWithdrawal: Withdrawal = {
        id: crypto.randomUUID(),
        userId: currentUser.id,
        userName: currentUser.name,
        recipientName,
        nfNumber,
        imageUrl: imagePreview,
        timestamp: new Date().toISOString(),
        latitude: location?.lat,
        longitude: location?.lng
      };

      WithdrawalService.save(newWithdrawal);
      setLoading(false);
      alert('Retirada registrada com sucesso!');
      onSuccess();
    }, 800);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <Header variant="page" title="Nova Retirada" onBack={onCancel} />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quem Retirou</label>
          <input
            type="text"
            required
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="Nome completo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número da NF</label>
          <input
            type="text"
            required
            value={nfNumber}
            onChange={(e) => setNfNumber(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            placeholder="000.000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Foto do Canhoto</label>

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {!imagePreview ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Camera size={32} className="mb-2" />
              <span>Tirar Foto / Upload</span>
            </button>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => setImagePreview(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Geolocation Status Indicator */}
        <div className="flex items-center gap-2 text-sm mt-2">
          {locationStatus === 'success' ? (
            <div className="text-green-600 flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
              <MapPin size={16} />
              <span>Localização capturada</span>
            </div>
          ) : locationStatus === 'pending' ? (
            <div className="text-yellow-600 flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
              <MapPin size={16} className="animate-pulse" />
              <span>Obtendo localização...</span>
            </div>
          ) : (
            <div className="text-gray-400 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
              <MapPin size={16} />
              <span>Sem localização</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 mt-4"
        >
          {loading ? (
            <span>Salvando...</span>
          ) : (
            <>
              <Save size={24} />
              <span>Registrar Saída</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default WithdrawalForm;