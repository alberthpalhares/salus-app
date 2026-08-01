import React from 'react';
import { Card } from '../componentes/ui/Card';
import { Botao } from '../componentes/ui/Botao';
import { Badge } from '../componentes/ui/Badge';
import { Carregando } from '../componentes/ui/Carregando';
import { EstadoVazio } from '../componentes/ui/EstadoVazio';
import { Stethoscope, Plus, Search, Phone, MapPin, MessageSquare, Trash2, Edit2 } from 'lucide-react';
import { useProfissionais } from './Profissionais/useProfissionais';
import { ModalEditarProfissional } from './Profissionais/ModalEditarProfissional';
import { AvatarMembro } from '../componentes/ui/AvatarMembro';

export const ProfissionaisTela: React.FC = () => {
  const {
    carregando,
    profissionais,
    membros,
    termoBusca,
    setTermoBusca,
    filtroTipo,
    setFiltroTipo,
    modalAberto,
    setModalAberto,
    profissionalEditando,
    setProfissionalEditando,
    handleSalvarProfissional,
    handleRemoverProfissional,
  } = useProfissionais();

  if (carregando) return <Carregando mensagem="Carregando rede de médicos e clínicas..." />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Stethoscope className="w-7 h-7 text-teal-600" /> Médicos, Vets &amp; Clínicas
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Profissionais de confiança vinculados aos integrantes da família.
          </p>
        </div>

        <Botao
          variante="primario"
          tamanho="sm"
          icone={<Plus className="w-4 h-4" />}
          onClick={() => {
            setProfissionalEditando(null);
            setModalAberto(true);
          }}
        >
          Cadastrar Profissional
        </Botao>
      </div>

      {/* Barra de Filtros */}
      <Card className="p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nome ou especialidade..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['todos', 'medico', 'veterinario', 'clinica', 'hospital'].map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setFiltroTipo(tipo)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filtroTipo === tipo
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tipo === 'medico' ? 'Médicos' : tipo === 'veterinario' ? 'Veterinários' : tipo}
            </button>
          ))}
        </div>
      </Card>

      {/* Lista de Cards */}
      {profissionais.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum profissional cadastrado"
          descricao="Adicione médicos, veterinários ou clínicas de confiança para ter seus contatos sempre à mão."
          icone={<Stethoscope className="w-6 h-6" />}
          acao={
            <Botao variante="primario" icone={<Plus className="w-4 h-4" />} onClick={() => setModalAberto(true)}>
              Cadastrar Primeiro Especialista
            </Botao>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profissionais.map((p) => {
            const atendidos = membros.filter((m) => p.membros_vinculados?.includes(m.id));
            const numWhatsapp = p.whatsapp || p.telefone;
            const whatsappLink = numWhatsapp
              ? `https://wa.me/55${numWhatsapp.replace(/\D/g, '')}`
              : null;

            return (
              <Card key={p.id} className="p-5 space-y-3 relative group hover:border-slate-300 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900">{p.nome}</h3>
                      <Badge variante={p.tipo === 'veterinario' ? 'amber' : 'teal'} tamanho="sm">
                        {p.tipo}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-teal-800 mt-0.5">{p.especialidade}</p>
                    {p.crm_crmv_cnpj && <p className="text-[11px] text-slate-400 font-medium">{p.crm_crmv_cnpj}</p>}
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => {
                        setProfissionalEditando(p);
                        setModalAberto(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-teal-50"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoverProfissional(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contatos */}
                <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                  {p.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{p.telefone}</span>
                    </div>
                  )}
                  {p.endereco && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.endereco}</span>
                    </div>
                  )}
                </div>

                {/* Integrantes atendidos */}
                {atendidos.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Atende:</span>
                    <div className="flex items-center gap-1.5">
                      {atendidos.map((m) => (
                        <div key={m.id} className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-[11px] font-bold text-slate-700">
                          <AvatarMembro membro={m} tamanho="sm" className="w-4 h-4 text-[9px]" />
                          <span>{m.nome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ações */}
                {whatsappLink && (
                  <div className="pt-2">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Falar no WhatsApp
                    </a>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <ModalEditarProfissional
        modalAberto={modalAberto}
        profissional={profissionalEditando}
        membros={membros}
        onFechar={() => {
          setModalAberto(false);
          setProfissionalEditando(null);
        }}
        onSalvar={handleSalvarProfissional}
      />
    </div>
  );
};
