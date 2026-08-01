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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../componentes/ui/Tabs';
import { CabecalhoMembro } from './PerfilMembro/CabecalhoMembro';
import { AbaFicha } from './PerfilMembro/AbaFicha';
import { AbaMedicamentos } from './PerfilMembro/AbaMedicamentos';
import { AbaExames } from './PerfilMembro/AbaExames';
import { AbaEvolucao } from './PerfilMembro/AbaEvolucao';
import { AbaHistorico } from './PerfilMembro/AbaHistorico';
import { AbaDocumentos } from './PerfilMembro/AbaDocumentos';
import { UserCheck, Pill, Activity, TrendingUp, Clock, Folder, ArrowLeft, AlertCircle } from 'lucide-react';

export type AbaPerfil = 'ficha' | 'medicamentos' | 'exames' | 'evolucao' | 'historico' | 'documentos';

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

      {/* 2. Barra de Abas de Navegação Animadas */}
      <Tabs defaultValue="ficha" value={abaAtiva} onValueChange={(v) => setAbaAtiva(v as AbaPerfil)}>
        <TabsList>
          <TabsTrigger value="ficha" icone={<UserCheck className="w-4 h-4" />}>
            Ficha
          </TabsTrigger>
          <TabsTrigger value="medicamentos" icone={<Pill className="w-4 h-4" />}>
            Medicamentos
          </TabsTrigger>
          <TabsTrigger value="exames" icone={<Activity className="w-4 h-4" />}>
            Exames
          </TabsTrigger>
          <TabsTrigger value="evolucao" icone={<TrendingUp className="w-4 h-4" />}>
            Evolução
          </TabsTrigger>
          <TabsTrigger value="historico" icone={<Clock className="w-4 h-4" />}>
            Histórico
          </TabsTrigger>
          <TabsTrigger value="documentos" icone={<Folder className="w-4 h-4" />}>
            Documentos
          </TabsTrigger>
        </TabsList>

        {/* 3. Conteúdo das Abas */}
        <div className="pt-2">
          <TabsContent value="ficha">
            <AbaFicha membro={membro} onSalvarMembro={handleSalvarMembro} />
          </TabsContent>

          <TabsContent value="medicamentos">
            <AbaMedicamentos
              medicamentos={medicamentos}
              onSalvarMedicamento={handleSalvarMedicamento}
            />
          </TabsContent>

          <TabsContent value="exames">
            <AbaExames exames={exames} onSalvarExame={handleSalvarExame} />
          </TabsContent>

          <TabsContent value="evolucao">
            <AbaEvolucao membroId={membro.id} membroNome={membro.nome} />
          </TabsContent>

          <TabsContent value="historico">
            <AbaHistorico eventos={eventos} onSalvarEvento={handleSalvarEvento} />
          </TabsContent>

          <TabsContent value="documentos">
            <AbaDocumentos
              documentos={documentos}
              onSalvarDocumento={handleSalvarDocumento}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
