import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { Botao } from '../componentes/ui/Botao';
import { EstadoVazio } from '../componentes/ui/EstadoVazio';
import { Carregando } from '../componentes/ui/Carregando';
import { Plus, Inbox, HardDriveUpload, Activity, Stethoscope } from 'lucide-react';
import { Membro, Medicamento, Vacina, Checkup } from '../types/dominio';
import {
  repositoriomembros,
  repositoriomedicamentos,
  repositoriovacinas,
  repositoriocheckups,
  repositorioperfilConfig,
} from '../data/repositorios';
import {
  calcularAlertasComDataHoje,
  agruparAlertasPorGrupo,
} from '../dominio/alertas';
import { obterDataHojeISO, formatarDataExtenso } from '../lib/datas';
import { CardAlertasPainel } from './Painel/CardAlertasPainel';
import { CardMedicamentosPainel } from './Painel/CardMedicamentosPainel';
import { GridIntegrantesPainel } from './Painel/GridIntegrantesPainel';
import { ModalNovoMembro } from './Painel/ModalNovoMembro';
import { ModalEditarMembro } from './Painel/ModalEditarMembro';
import { DashboardKpiBanner } from './Painel/DashboardKpiBanner';
import { GraficoResumoSaude } from './Painel/GraficoResumoSaude';

export const PainelTela: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [carregando, setCarregando] = useState<boolean>(true);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [checkups, setCheckups] = useState<Checkup[]>([]);
  const [ultimoExport, setUltimoExport] = useState<string | undefined>(undefined);
  
  const [modalMembroAberto, setModalMembroAberto] = useState<boolean>(false);
  const [membroEditando, setMembroEditando] = useState<Membro | null>(null);

  const dataHojeISO = obterDataHojeISO();

  const handleSalvarMembro = async (novoMembro: Membro) => {
    if (!user) return;
    await repositoriomembros.salvar(user.uid, novoMembro);
    setMembros((prev) => [...prev, novoMembro]);
  };

  const handleEditarMembro = async (membroAtualizado: Membro) => {
    if (!user) return;
    await repositoriomembros.salvar(user.uid, membroAtualizado);
    setMembros((prev) => prev.map((m) => (m.id === membroAtualizado.id ? membroAtualizado : m)));
  };

  const handleExcluirMembro = async (membroId: string) => {
    if (!user) return;
    await repositoriomembros.remover(user.uid, membroId);
    setMembros((prev) => prev.filter((m) => m.id !== membroId));
  };

  useEffect(() => {
    let montado = true;

    async function carregarDadosLocalmente() {
      if (!user) return;
      try {
        setCarregando(true);
        const [
          membrosRes,
          medsRes,
          vacinasRes,
          checkupsRes,
          configRes,
        ] = await Promise.all([
          repositoriomembros.listar(user.uid),
          repositoriomedicamentos.listar(user.uid),
          repositoriovacinas.listar(user.uid),
          repositoriocheckups.listar(user.uid),
          repositorioperfilConfig.obter(user.uid),
        ]);

        if (montado) {
          setMembros(membrosRes || []);
          setMedicamentos(medsRes || []);
          setVacinas(vacinasRes || []);
          setCheckups(checkupsRes || []);
          setUltimoExport(configRes?.ultimo_export);
        }
      } catch (err) {
        console.error('Erro ao carregar dados no Painel:', err);
      } finally {
        if (montado) {
          setCarregando(false);
        }
      }
    }

    carregarDadosLocalmente();

    return () => {
      montado = false;
    };
  }, [user]);

  if (carregando) {
    return <Carregando mensagem="Carregando resumo de saúde da família..." />;
  }

  const alertas = calcularAlertasComDataHoje(
    { membros, vacinas, medicamentos, checkups },
    dataHojeISO
  );
  const gruposAlertas = agruparAlertasPorGrupo(alertas);

  const temAlerta30Dias =
    gruposAlertas.VENCIDO.length > 0 || gruposAlertas.VENCE_EM_30_DIAS.length > 0;

  const todosMedicamentos: Medicamento[] = [...medicamentos];
  membros.forEach((m) => {
    if (m.medicamentos_em_uso) {
      m.medicamentos_em_uso.forEach((med, idx) => {
        if (!todosMedicamentos.some((x) => x.membro_id === m.id && x.nome === med.nome)) {
          todosMedicamentos.push({
            id: `emb-med-${m.id}-${idx}`,
            membro_id: m.id,
            nome: med.nome,
            dose: med.dose || med.posologia || '',
            frequencia: med.frequencia || '',
            status: 'em_uso',
            desde: med.inicio,
            renova_em: med.renova_em,
          });
        }
      });
    }
  });

  const medicamentosEmUso = todosMedicamentos.filter((m) => m.status === 'em_uso');
  const medicamentosPrescritos = todosMedicamentos.filter((m) => m.status === 'prescrito');

  const membrosComCondicoes = membros.filter((m) => {
    const conds = m.condicoes_ativas || m.condicoes || [];
    return conds.length > 0;
  });

  const totalCondicoesCount = membros.reduce((acc, m) => {
    const conds = m.condicoes_ativas || m.condicoes || [];
    return acc + conds.length;
  }, 0);

  let precisaBackup = false;
  if (!ultimoExport) {
    precisaBackup = true;
  }

  const estaTotalmenteVazio = membros.length === 0;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Painel de Saúde da Família
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {formatarDataExtenso(dataHojeISO)} — Visão unificada da casa (Pessoas &amp; Pets)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Botao
            variante="secundario"
            tamanho="sm"
            icone={<Stethoscope className="w-4 h-4 text-teal-600" />}
            onClick={() => navigate('/profissionais')}
          >
            Médicos &amp; Vets
          </Botao>
          <Botao
            variante="secundario"
            tamanho="sm"
            icone={<Inbox className="w-4 h-4" />}
            onClick={() => navigate('/caixa-de-entrada')}
          >
            Caixa de Entrada
          </Botao>
          <Botao
            variante="primario"
            tamanho="sm"
            icone={<Plus className="w-4 h-4" />}
            onClick={() => setModalMembroAberto(true)}
          >
            Adicionar Membro
          </Botao>
        </div>
      </div>

      {/* KPI Banner Superior */}
      {!estaTotalmenteVazio && (
        <DashboardKpiBanner
          membros={membros}
          medicamentosEmUso={medicamentosEmUso}
          alertasCount={alertas.length}
          condicoesCount={totalCondicoesCount}
        />
      )}

      {precisaBackup && (
        <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <HardDriveUpload className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Lembrete de Segurança:</strong> Faça um backup dos seus dados para manter sua cópia offline atualizada.
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/ajustes')}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
          >
            Ir para Ajustes
          </button>
        </div>
      )}

      {estaTotalmenteVazio ? (
        <EstadoVazio
          titulo="Nenhum integrante cadastrado"
          descricao="Sua família ainda não possui integrantes registrados. Adicione pessoas ou pets para começar a gerenciar sua saúde."
          icone={<Activity className="w-6 h-6" />}
          acao={
            <div className="flex flex-col sm:flex-row gap-3">
              <Botao
                variante="primario"
                icone={<Plus className="w-4 h-4" />}
                onClick={() => setModalMembroAberto(true)}
              >
                Cadastrar Primeiro Integrante
              </Botao>
            </div>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CardAlertasPainel
                gruposAlertas={gruposAlertas}
                temAlerta30Dias={temAlerta30Dias}
              />
              <CardMedicamentosPainel
                medicamentosEmUso={medicamentosEmUso}
                medicamentosPrescritos={medicamentosPrescritos}
                membros={membros}
              />
            </div>
            <div>
              <GraficoResumoSaude
                membros={membros}
                medicamentosEmUso={medicamentosEmUso}
                alertasCount={alertas.length}
              />
            </div>
          </div>

          <GridIntegrantesPainel
            membros={membros}
            membrosComCondicoes={membrosComCondicoes}
            onAdicionarMembro={() => setModalMembroAberto(true)}
            onEditarMembro={(membro) => setMembroEditando(membro)}
          />
        </>
      )}

      <ModalNovoMembro
        modalAberto={modalMembroAberto}
        onFechar={() => setModalMembroAberto(false)}
        onSalvarMembro={handleSalvarMembro}
      />

      <ModalEditarMembro
        membro={membroEditando}
        onFechar={() => setMembroEditando(null)}
        onSalvar={handleEditarMembro}
        onExcluir={handleExcluirMembro}
      />
    </div>
  );
};

