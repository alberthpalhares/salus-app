import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Botao } from '../componentes/ui/Botao';
import { EstadoVazio } from '../componentes/ui/EstadoVazio';
import { Carregando } from '../componentes/ui/Carregando';
import { Plus, Inbox, HardDriveUpload, Activity, Stethoscope } from 'lucide-react';
import { Membro } from '../types/dominio';
import { formatarDataExtenso } from '../lib/datas';
import { CardAlertasPainel } from './Painel/CardAlertasPainel';
import { CardMedicamentosPainel } from './Painel/CardMedicamentosPainel';
import { GridIntegrantesPainel } from './Painel/GridIntegrantesPainel';
import { ModalNovoMembro } from './Painel/ModalNovoMembro';
import { ModalEditarMembro } from './Painel/ModalEditarMembro';
import { DashboardKpiBanner } from './Painel/DashboardKpiBanner';
import { GraficoResumoSaude } from './Painel/GraficoResumoSaude';
import { usePainelData } from './Painel/usePainelData';

export const PainelTela: React.FC = () => {
  const navigate = useNavigate();
  const [modalMembroAberto, setModalMembroAberto] = useState<boolean>(false);
  const [membroEditando, setMembroEditando] = useState<Membro | null>(null);

  const {
    carregando, membros, dataHojeISO,
    alertas, gruposAlertas, temAlerta30Dias,
    medicamentosEmUso, medicamentosPrescritos,
    membrosComCondicoes, totalCondicoesCount,
    precisaBackup, estaTotalmenteVazio,
    handleSalvarMembro, handleEditarMembro, handleExcluirMembro,
  } = usePainelData();

  if (carregando) {
    return <Carregando mensagem="Carregando resumo de saúde da família..." />;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
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
          <Botao variante="secundario" tamanho="sm" icone={<Stethoscope className="w-4 h-4 text-teal-600" />} onClick={() => navigate('/profissionais')}>
            Médicos &amp; Vets
          </Botao>
          <Botao variante="secundario" tamanho="sm" icone={<Inbox className="w-4 h-4" />} onClick={() => navigate('/caixa-de-entrada')}>
            Caixa de Entrada
          </Botao>
          <Botao variante="primario" tamanho="sm" icone={<Plus className="w-4 h-4" />} onClick={() => setModalMembroAberto(true)}>
            Adicionar Membro
          </Botao>
        </div>
      </div>

      {/* KPI Banner */}
      {!estaTotalmenteVazio && (
        <DashboardKpiBanner
          membros={membros}
          medicamentosEmUso={medicamentosEmUso}
          alertasCount={alertas.length}
          condicoesCount={totalCondicoesCount}
        />
      )}

      {/* Backup reminder */}
      {precisaBackup && (
        <div className="p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-xl flex items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <HardDriveUpload className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Lembrete de Segurança:</strong> Faça um backup dos seus dados para manter sua cópia offline atualizada.
            </span>
          </div>
          <button type="button" onClick={() => navigate('/ajustes')} className="text-xs font-bold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer">
            Ir para Ajustes
          </button>
        </div>
      )}

      {/* Main content */}
      {estaTotalmenteVazio ? (
        <EstadoVazio
          titulo="Nenhum integrante cadastrado"
          descricao="Sua família ainda não possui integrantes registrados. Adicione pessoas ou pets para começar a gerenciar sua saúde."
          icone={<Activity className="w-6 h-6" />}
          acao={
            <Botao variante="primario" icone={<Plus className="w-4 h-4" />} onClick={() => setModalMembroAberto(true)}>
              Cadastrar Primeiro Integrante
            </Botao>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CardAlertasPainel gruposAlertas={gruposAlertas} temAlerta30Dias={temAlerta30Dias} />
              <CardMedicamentosPainel medicamentosEmUso={medicamentosEmUso} medicamentosPrescritos={medicamentosPrescritos} membros={membros} />
            </div>
            <div>
              <GraficoResumoSaude membros={membros} medicamentosEmUso={medicamentosEmUso} alertasCount={alertas.length} />
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

      <ModalNovoMembro modalAberto={modalMembroAberto} onFechar={() => setModalMembroAberto(false)} onSalvarMembro={handleSalvarMembro} />
      <ModalEditarMembro membro={membroEditando} onFechar={() => setMembroEditando(null)} onSalvar={handleEditarMembro} onExcluir={handleExcluirMembro} />
    </div>
  );
};
