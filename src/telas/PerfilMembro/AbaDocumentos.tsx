import React, { useState } from 'react';
import { DocumentoMembro } from '../../types/dominio';
import { Card } from '../../componentes/ui/Card';
import { Botao } from '../../componentes/ui/Botao';
import { Campo } from '../../componentes/ui/Campo';
import { EstadoVazio } from '../../componentes/ui/EstadoVazio';
import { obterDataHojeISO } from '../../lib/datas';
import { Folder, Plus, HardDrive } from 'lucide-react';
import { ItemDocumentoCard } from './Documentos/ItemDocumentoCard';

interface AbaDocumentosProps {
  documentos: DocumentoMembro[];
  onSalvarDocumento: (doc: DocumentoMembro) => Promise<void>;
}

export const AbaDocumentos: React.FC<AbaDocumentosProps> = ({ documentos, onSalvarDocumento }) => {
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [nomeArquivo, setNomeArquivo] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('Laudo de Exame');
  const [dataDoc, setDataDoc] = useState(obterDataHojeISO());
  const [driveFileId, setDriveFileId] = useState('');

  // Group by document type
  const gruposMap: Record<string, DocumentoMembro[]> = {};
  documentos.forEach((d) => {
    const tipo = d.tipo_documento?.trim() || 'Outros Documentos';
    if (!gruposMap[tipo]) gruposMap[tipo] = [];
    gruposMap[tipo].push(d);
  });

  const abrirNovoModal = () => {
    setNomeArquivo('');
    setTipoDocumento('Laudo de Exame');
    setDataDoc(obterDataHojeISO());
    setDriveFileId('');
    setModalNovoAberto(true);
  };

  const handleCriarDocumento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeArquivo.trim()) return;
    setSalvando(true);
    try {
      const novo: DocumentoMembro = {
        id: `doc_${Date.now()}`,
        membro_id: '',
        nome_arquivo: nomeArquivo.trim(),
        tipo_documento: tipoDocumento.trim() || 'Outros Documentos',
        data: dataDoc || obterDataHojeISO(),
        drive_file_id: driveFileId.trim() || `drive_file_${Date.now()}`,
        mime: 'application/pdf',
      };
      await onSalvarDocumento(novo);
      setModalNovoAberto(false);
    } catch (err) {
      console.error('Erro ao adicionar documento:', err);
    } finally {
      setSalvando(false);
    }
  };

  const abrirNoDrive = (driveId?: string) => {
    if (!driveId) { alert('Arquivo ainda não sincronizado com o Google Drive.'); return; }
    window.open(`https://drive.google.com/file/d/${driveId}/view`, '_blank', 'noopener,noreferrer');
  };

  const baixarDoDrive = (driveId?: string) => {
    if (!driveId) { alert('Arquivo ainda não sincronizado com o Google Drive.'); return; }
    window.open(`https://drive.google.com/uc?export=download&id=${driveId}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Folder className="w-5 h-5 text-teal-600" />
            Documentos e Anexos
          </h2>
          <p className="text-xs text-slate-500">Arquivos originais armazenados com segurança no seu Google Drive.</p>
        </div>
        <Botao variante="primario" tamanho="sm" icone={<Plus className="w-4 h-4" />} onClick={abrirNovoModal}>
          Anexar Documento
        </Botao>
      </div>

      {documentos.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum documento anexado"
          descricao="Guarde laudos completos, receitas em PDF e atestados associados ao membro. Todos os arquivos ficam salvos diretamente na sua pasta do Google Drive."
          icone={<HardDrive className="w-8 h-8 text-slate-400" />}
          acao={<Botao variante="primario" tamanho="sm" icone={<Plus className="w-4 h-4" />} onClick={abrirNovoModal}>Anexar Primeiro Documento</Botao>}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(gruposMap).map(([grupoTipo, listaDocs]) => (
            <div key={grupoTipo} className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
                <Folder className="w-4 h-4 text-teal-600" />
                {grupoTipo} ({listaDocs.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {listaDocs.map((doc) => (
                  <ItemDocumentoCard key={doc.id} documento={doc} onAbrirNoDrive={abrirNoDrive} onBaixarDoDrive={baixarDoDrive} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Anexar Documento */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3">Anexar Documento</h3>
            <form onSubmit={handleCriarDocumento} className="space-y-4">
              <Campo rotulo="Nome do Arquivo / Título *" placeholder="Ex: Laudo_Sangue_Junho_2026.pdf" value={nomeArquivo} onChange={(e) => setNomeArquivo(e.target.value)} required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo de Documento</label>
                  <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm">
                    <option value="Laudo de Exame">Laudo de Exame</option>
                    <option value="Receita">Receita / Prescrição</option>
                    <option value="Atestado">Atestado Médico</option>
                    <option value="Comprovante de Vacina">Comprovante de Vacina</option>
                    <option value="Outros">Outros Documentos</option>
                  </select>
                </div>
                <Campo rotulo="Data do Documento *" type="date" value={dataDoc} onChange={(e) => setDataDoc(e.target.value)} required />
              </div>
              <Campo rotulo="ID do arquivo no Google Drive (opcional)" placeholder="Ex: 1a2b3c4d5e6f..." value={driveFileId} onChange={(e) => setDriveFileId(e.target.value)} dica="Deixe em branco para gerar um id de integração automático." />
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200">
                <Botao type="button" variante="secundario" onClick={() => setModalNovoAberto(false)} disabled={salvando}>Cancelar</Botao>
                <Botao type="submit" variante="primario" carregando={salvando}>Anexar Documento</Botao>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
