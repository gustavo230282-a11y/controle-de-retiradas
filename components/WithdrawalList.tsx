import React, { useState, useEffect } from 'react';
import { Search, Eye, X, FileText, Calendar, User as UserIcon, MapPin, Share2 } from 'lucide-react';
import Header from '../components/Header';
import { Withdrawal, UserLevel } from '../types';
import { WithdrawalService } from '../services/db';

interface Props {
  onBack: () => void;
}

const WithdrawalList: React.FC<Props> = ({ onBack }) => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const loadWithdrawals = async () => {
    const data = await WithdrawalService.getAll();
    setWithdrawals(data);
  };

  const filtered = withdrawals.filter(w =>
    w.nfNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.recipientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openMap = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const shareOnWhatsApp = (item: Withdrawal) => {
    const date = new Date(item.timestamp).toLocaleString('pt-BR');

    let message = `*REGISTRO DE COLETA - GPS SYSTEM*\n\n`;
    message += `📄 *NF:* ${item.nfNumber}\n`;
    message += `👤 *Responsável:* ${item.recipientName}\n`;
    message += `📅 *Data/Hora:* ${date}\n`;
    message += `👮 *Operador:* ${item.userName}\n`;

    if (item.latitude && item.longitude) {
      message += `📍 *Localização:* https://maps.google.com/?q=${item.latitude},${item.longitude}\n`;
    }

    message += `\n_O comprovante digital está salvo no sistema._`;

    // Detect if mobile to use api.whatsapp or web.whatsapp
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';

    const url = `${baseUrl}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <Header variant="page" title="Consultar" onBack={onBack} />

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar por NF ou Nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Nenhuma retirada encontrada.
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="border border-gray-100 rounded-lg p-4 shadow-sm bg-gray-50 hover:bg-white transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-2">
                  <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <FileText size={18} className="text-primary" />
                    NF: {item.nfNumber}
                  </h3>
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <UserIcon size={16} />
                    Retirado por: <span className="font-semibold">{item.recipientName}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(item.timestamp).toLocaleString('pt-BR')} por {item.userName}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSelectedImage(item.imageUrl)}
                    className="bg-primary text-white p-2 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                    aria-label="Ver Canhoto"
                    title="Ver Foto"
                  >
                    <Eye size={20} />
                  </button>

                  <button
                    onClick={() => shareOnWhatsApp(item)}
                    className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                    aria-label="Compartilhar WhatsApp"
                    title="Enviar no WhatsApp"
                  >
                    <Share2 size={20} />
                  </button>

                  {item.latitude && item.longitude && (
                    <button
                      onClick={() => openMap(item.latitude!, item.longitude!)}
                      className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition-colors shadow-sm"
                      aria-label="Ver Mapa"
                      title="Ver Mapa"
                    >
                      <MapPin size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-lg w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white p-2"
            >
              <X size={32} />
            </button>
            <img
              src={selectedImage}
              alt="Comprovante"
              className="w-full rounded-lg shadow-2xl border-2 border-white"
            />
            <p className="text-white text-center mt-2 text-sm opacity-80">
              Pressione a imagem para salvar se desejar enviar manualmente.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalList;