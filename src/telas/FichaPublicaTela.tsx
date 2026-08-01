import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';
import { Botao } from '../componentes/ui/Botao';
import { Carregando } from '../componentes/ui/Carregando';
import { AvatarMembro } from '../componentes/ui/AvatarMembro';
import { Membro, Medicamento, Vacina, CondicaoSaudeEstruturada } from '../types/dominio';
import { repositoriomembros, repositoriomedicamentos, repositoriovacinas, repositoriocondicoes } from '../data/repositorios';
import { Printer, Shield, Activity, Pill, Syringe, Phone, UserCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';

export const FichaPublicaTela: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [carregando, setCarregando] = useState(true);
  const [membro, setMembro] = useState<Membro | null>(null);
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [vacinas, setVacinas] = useState<Vacina[]>([]);
  const [condicoes, setCondicoes] = useState<CondicaoSaudeEstruturada[]>([]);

  const inclIdent = searchParams.get('ident') !== '0';
  const inclEmerg = searchParams.get('emerg') !== '0';
  const inclCond = searchParams.get('cond') !== '0';
  const inclMeds = searchParams.get('meds') !== '0';
  const inclVac = searchParams.get('vac') !== '0';
  const inclAlerg = searchParams.get('alerg') !== '0';

  useEffect(() => {
    async function carregarFicha() {
      if (!user || !id) {
        setCarregando(false);
        return;
      }
      try {
        const [membroRes, medsRes, vacsRes, condsRes] = await Promise.all([
          repositoriomembros.obterPorId(user.uid, id),
          repositoriomedicamentos.listar(user.uid),
          repositoriovacinas.listar(user.uid),
          repositoriocondicoes.listar(user.uid),
        ]);
        setMembro(membroRes);
        setMedicamentos((medsRes || []).filter((m) => m.membro_id === id));
        setVacinas((vacsRes || []).filter((v) => v.membro_id === id));
        setCondicoes((condsRes || []).filter((c) => c.membro_id === id));
      } catch (err) {
        console.error('Erro ao carregar ficha pública:', err);
      } finally {
        setCarregando(false);
      }
    }
    carregarFicha();
  }, [user, id]);

  if (carregando) return <Carregando mensagem="Gerando resumo da ficha médica..." />;

  if (!membro) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Ficha Não Encontrada</h2>
        <p className="text-xs text-slate-500">Este link pode ter expirado ou o integrante não está disponível.</p>
      </div>
    );
  }

  const alergias = membro.alergias || [];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6 print:py-0 print:px-0">
      {/* Barra de Ação */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-600" />
          <span className="text-xs font-bold text-slate-600">SISAFAM — Resumo Clínico de Emergência &amp; Consulta</span>
        </div>
        <Botao variante="primario" tamanho="sm" icone={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
          Imprimir / Gerar PDF
        </Botao>
      </div>

      {/* Cartão Principal da Ficha */}
      <Card className="p-6 sm:p-8 space-y-6 shadow-lg border-slate-200 print:shadow-none print:border-none">
        {/* Cabeçalho do Integrante */}
        {inclIdent && (
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <AvatarMembro membro={membro} tamanho="xl" />
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Ficha Médica Oficial
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{membro.nome}</h1>
              <p className="text-xs text-slate-600">
                {membro.tipo === 'cao' ? 'Cão' : membro.tipo === 'gato' ? 'Gato' : membro.tipo === 'pessoa' ? 'Pessoa' : 'Pet'}
                {membro.nascimento ? ` • Nasc: ${membro.nascimento}` : ''}
                {membro.tipo_sanguineo ? ` • Tipo Sanguíneo: ${membro.tipo_sanguineo}` : ''}
              </p>
            </div>
          </div>
        )}

        {/* Alergias Destaque */}
        {inclAlerg && alergias.length > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
            <h3 className="text-xs font-extrabold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Alergias Registradas
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {alergias.map((a, idx) => (
                <Badge key={idx} variante="rose">
                  {a}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Condições em Acompanhamento */}
        {inclCond && condicoes.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Activity className="w-4 h-4 text-teal-600" /> Condições em Acompanhamento
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {condicoes.map((c) => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-extrabold text-slate-900">{c.nome}</div>
                  <div className="text-slate-500 capitalize">{c.categoria} • Gravidade {c.gravidade}</div>
                  {c.notas && <p className="text-[11px] text-slate-600 italic">"{c.notas}"</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medicamentos em Uso */}
        {inclMeds && medicamentos.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Pill className="w-4 h-4 text-indigo-600" /> Medicamentos em Uso
            </h3>
            <div className="space-y-2">
              {medicamentos.map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900">{m.nome}</span>
                    <span className="text-slate-500 ml-2">({m.dose || 'Dose não inf.'} - {m.frequencia || 'Uso contínuo'})</span>
                  </div>
                  {m.desde && <span className="text-[11px] text-slate-400">Desde {m.desde}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Histórico Vacinal */}
        {inclVac && vacinas.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Syringe className="w-4 h-4 text-amber-600" /> Histórico Vacinal
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {vacinas.map((v) => (
                <div key={v.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-800 truncate">{v.nome}</div>
                  <div className="text-[11px] text-slate-500">Aplicada: {v.aplicada_em}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contatos de Emergência */}
        {inclEmerg && membro.contatos_emergencia && membro.contatos_emergencia.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-rose-600" /> Contatos de Emergência
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {membro.contatos_emergencia.map((c, idx) => (
                <div key={idx} className="p-3 bg-rose-50/60 border border-rose-200/80 rounded-xl text-xs flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900">{c.nome}</span>
                    <span className="text-slate-500 block text-[11px]">{c.papel || 'Emergência'}</span>
                  </div>
                  <span className="font-extrabold text-rose-800">{c.telefone}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
