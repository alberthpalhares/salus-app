import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import {
  repositoriomembros,
  repositoriomedicamentos,
  repositorioexames,
  repositorioeventos,
  repositoriodocumentos,
} from '../data/repositorios';
import { Membro, Medicamento, Exame, Evento, DocumentoMembro } from '../types/dominio';
import { Carregando } from '../componentes/ui/Carregando';
import { Botao } from '../componentes/ui/Botao';
import { Card } from '../componentes/ui/Card';
import { CabecalhoMembro } from './PerfilMembro/CabecalhoMembro';
import { AbaFicha } from './PerfilMembro/AbaFicha';
import { AbaMedicamentos } from './PerfilMembro/AbaMedicamentos';
import { AbaExames } from './PerfilMembro/AbaExames';
import { AbaHistorico } from './PerfilMembro/AbaHistorico';
import { AbaDocumentos } from './PerfilMembro/AbaDocumentos';
import { UserCheck, Pill, Activity, Clock, Folder, ArrowLeft, AlertCircle } from 'lucide-react';

export type AbaPerfil = 'ficha' | 'medicamentos' | 'exames' | 'historico' | 'documentos';

export const PerfilMembroTela: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [abaAtiva, setAbaAtiva] = useState<AbaPerfil>('ficha');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados de dados do membro e suas coleções
  const [membro, setMembro] = useState<Membro | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [exames, setExames] = useState<Exame[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [documentos, setDocumentos] = useState<DocumentoMembro[]>([]);

  // Carregar dados ao montar
  const carregarDados = async () => {
    if (!user?.uid || !id) return;
    setCarregando(true);
    setErro(null);

    try {
      // 1. Obter Membro
      const membroDoc = await repositoriomembros.obterPorId(user.uid, id);
      if (!membroDoc) {
        setErro('Membro não encontrado.');
        setCarregando(false);
        return;
      }
      setMembro(membroDoc);

      // 2. Carregar coleções relacionadas do membro em paralelo
      const [medsList, examesList, eventosList, docsList] = await Promise.all([
        repositoriomedicamentos.listarPorMembro(user.uid, id),
        repositorioexames.listarPorMembro(user.uid, id),
        repositorioeventos.listarPorMembro(user.uid, id),
        repositoriodocumentos.listarPorMembro(user.uid, id),
      ]);

      setMedicamentos(medsList || []);
      setExames(examesList || []);
      setEventos(eventosList || []);
      setDocumentos(docsList || []);
    } catch (err: any) {
      console.error('Erro ao carregar dados do membro:', err);
      setErro(err?.message || 'Erro ao carregar informações do membro.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [user?.uid, id]);

  // Handlers para persistência explícita
  const handleSalvarMembro = async (membroAtualizado: Membro) => {
    if (!user?.uid) return;
    await repositoriomembros.salvar(user.uid, membroAtualizado);
    setMembro(membroAtualizado);
  };

  const handleSalvarMedicamento = async (med: Medicamento) => {
    if (!user?.uid || !id) return;
    const medComMembro: Medicamento = {
      ...med,
      membro_id: id,
    };
    await repositoriomedicamentos.salvar(user.uid, medComMembro);
    // Recarregar lista de medicamentos
    const atualizados = await repositoriomedicamentos.listarPorMembro(user.uid, id);
    setMedicamentos(atualizados || []);
  };

  const handleSalvarExame = async (ex: Exame) => {
    if (!user?.uid || !id) return;
    const exComMembro: Exame = {
      ...ex,
      membro_id: id,
    };
    await repositorioexames.salvar(user.uid, exComMembro);
    const atualizados = await repositorioexames.listarPorMembro(user.uid, id);
    setExames(atualizados || []);
  };

  const handleSalvarEvento = async (ev: Evento) => {
    if (!user?.uid || !id) return;
    const evComMembro: Evento = {
      ...ev,
      membro_id: id,
    };
    await repositorioeventos.salvar(user.uid, evComMembro);
    const atualizados = await repositorioeventos.listarPorMembro(user.uid, id);
    setEventos(atualizados || []);
  };

  const handleSalvarDocumento = async (doc: DocumentoMembro) => {
    if (!user?.uid || !id) return;
    const docComMembro: DocumentoMembro = {
      ...doc,
      membro_id: id,
    };
    await repositoriodocumentos.salvar(user.uid, docComMembro);
    const atualizados = await repositoriodocumentos.listarPorMembro(user.uid, id);
    setDocumentos(atualizados || []);
  };

  if (carregando) {
    return <Carregando mensagem="Carregando perfil do membro..." />;
  }

  if (erro || !membro) {
    return (
      <Card className="text-center py-12 px-6 max-w-lg mx-auto my-8 space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Membro Não Encontrado</h2>
        <p className="text-sm text-slate-500">
          {erro || 'Não foi possível carregar os dados deste membro.'}
        </p>
        <div className="pt-2">
          <Botao
            variante="primario"
            tamanho="sm"
            icone={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/')}
          >
            Voltar ao Painel
          </Botao>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. Cabeçalho do Membro */}
      <CabecalhoMembro membro={membro} onVoltar={() => navigate('/')} />

      {/* 2. Barra de Abas de Navegação */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setAbaAtiva('ficha')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              abaAtiva === 'ficha'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Ficha
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('medicamentos')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              abaAtiva === 'medicamentos'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Pill className="w-4 h-4" />
            Medicamentos
            {medicamentos.filter((m) => m.status === 'prescrito').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('exames')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              abaAtiva === 'exames'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-4 h-4" />
            Exames
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('historico')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              abaAtiva === 'historico'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            Histórico
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('documentos')}
            className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-colors whitespace-nowrap border-b-2 cursor-pointer ${
              abaAtiva === 'documentos'
                ? 'border-teal-600 text-teal-700 bg-teal-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Folder className="w-4 h-4" />
            Documentos
          </button>
        </nav>
      </div>

      {/* 3. Conteúdo da Aba Selecionada */}
      <div className="pt-2">
        {abaAtiva === 'ficha' && (
          <AbaFicha membro={membro} onSalvarMembro={handleSalvarMembro} />
        )}

        {abaAtiva === 'medicamentos' && (
          <AbaMedicamentos
            medicamentos={medicamentos}
            onSalvarMedicamento={handleSalvarMedicamento}
          />
        )}

        {abaAtiva === 'exames' && (
          <AbaExames exames={exames} onSalvarExame={handleSalvarExame} />
        )}

        {abaAtiva === 'historico' && (
          <AbaHistorico eventos={eventos} onSalvarEvento={handleSalvarEvento} />
        )}

        {abaAtiva === 'documentos' && (
          <AbaDocumentos
            documentos={documentos}
            onSalvarDocumento={handleSalvarDocumento}
          />
        )}
      </div>
    </div>
  );
};
