import React, { useState } from 'react';
import { Calendar, Search, Eye, X, FileBarChart, Download, FileText, MapPin } from 'lucide-react';
import Header from '../components/Header';
import { Withdrawal } from '../types';
import { WithdrawalService } from '../services/db';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  onBack: () => void;
}

const WithdrawalReport: React.FC<Props> = ({ onBack }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<Withdrawal[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      alert('Por favor, selecione as datas inicial e final.');
      return;
    }

    const allData = await WithdrawalService.getAll();

    // Create Date objects for comparison
    // Set start date to 00:00:00
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    // Set end date to 23:59:59
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = allData.filter((item) => {
      const itemDate = new Date(item.timestamp);
      return itemDate >= start && itemDate <= end;
    });

    setReportData(filtered);
    setHasSearched(true);
  };

  const handleExportPDF = () => {
    if (reportData.length === 0) return;

    const doc = new jsPDF();

    // Cabeçalho do PDF
    doc.setFontSize(18);
    doc.text("Relatório de Retiradas", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Período: ${new Date(startDate).toLocaleDateString('pt-BR')} a ${new Date(endDate).toLocaleDateString('pt-BR')}`, 14, 28);
    doc.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, 14, 34);

    // Preparar dados para a tabela
    const tableColumn = ["Data/Hora", "Responsável", "NF", "Localização (Lat/Lng)"];
    const tableRows = reportData.map(item => [
      new Date(item.timestamp).toLocaleString('pt-BR'),
      item.recipientName,
      item.nfNumber,
      item.latitude && item.longitude ? `${item.latitude.toFixed(5)}, ${item.longitude.toFixed(5)}` : 'N/A'
    ]);

    // Gerar tabela
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [13, 110, 253] }, // Primary Blue Color
    });

    // Salvar arquivo
    doc.save(`relatorio_retiradas_${startDate}_${endDate}.pdf`);
  };

  const openMap = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col animate-fade-in">
      {/* Header */}
      <Header
        variant="page"
        title="Relatório"
        onBack={onBack}
        icon={<FileBarChart className="text-primary" />}
      />

      {/* Filter Form */}
      <form onSubmit={handleGenerateReport} className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-2 rounded-lg font-bold shadow-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Gerar
          </button>

          {hasSearched && reportData.length > 0 && (
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold shadow-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <Download size={18} />
              PDF
            </button>
          )}
        </div>
      </form>

      {/* Results Table */}
      <div className="flex-1 overflow-x-auto overflow-y-auto border rounded-lg border-gray-200 relative">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Data/Hora</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">Responsável</th>
              <th scope="col" className="px-4 py-3 whitespace-nowrap">NF</th>
              <th scope="col" className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {!hasSearched ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  Selecione o período para visualizar os dados.
                </td>
              </tr>
            ) : reportData.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  Nenhuma retirada encontrada neste período.
                </td>
              </tr>
            ) : (
              reportData.map((item) => (
                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(item.timestamp).toLocaleDateString('pt-BR')} <br />
                    <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleTimeString('pt-BR')}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                    {item.recipientName}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.nfNumber}
                  </td>
                  <td className="px-4 py-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => setSelectedImage(item.imageUrl)}
                      className="text-primary hover:text-blue-800 transition-colors"
                      title="Ver Comprovante"
                    >
                      <Eye size={20} />
                    </button>
                    {item.latitude && item.longitude && (
                      <button
                        onClick={() => openMap(item.latitude!, item.longitude!)}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Ver Mapa"
                      >
                        <MapPin size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalReport;