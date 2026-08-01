import React, { useState, useEffect } from 'react';
import { ProfissionalSaude, Membro } from '../../types/dominio';
import { Botao } from '../../componentes/ui/Botao';
import { Campo } from '../../componentes/ui/Campo';
import { X, Stethoscope, Phone, MapPin, Mail, UserCheck } from 'lucide-react';

interface ModalEditarProfissionalProps {
  modalAberto: boolean;
  profissional: ProfissionalSaude | null;
  membros: Membro[];
  onFechar: () => void;
  onSalvar: (prof: ProfissionalSaude) => Promise<void>;
}

export const ModalEditarProfissional: React.FC<ModalEditarProfissionalProps> = ({
  modalAberto,
  profissional,
  membros,
  onFechar,
  onSalvar,
}) => {
  const [salvando, setSalvando] = useState(false);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<ProfissionalSaude['tipo']>('medico');
  const [especialidade, setEspecialidade] = useState('');
  const [registro, setRegistro] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [membrosVinculados, setMembrosVinculados] = useState<string[]>([]);

  useEffect(() => {
    if (profissional) {
      setNome(profissional.nome || '');
      setTipo(profissional.tipo || 'medico');
      setEspecialidade(profissional.especialidade || '');
      setRegistro(profissional.crm_crmv_cnpj || '');
      setTelefone(profissional.telefone || '');
      setWhatsapp(profissional.whatsapp || '');
      setEmail(profissional.email || '');
      setEndereco(profissional.endereco || '');
      setObservacoes(profissional.observacoes || '');
      setMembrosVinculados(profissional.membros_vinculados || []);
    } else {
      setNome('');
      setTipo('medico');
      setEspecialidade('');
      setRegistro('');
      setTelefone('');
      setWhatsapp('');
      setEmail('');
      setEndereco('');
      setObservacoes('');
      setMembrosVinculados([]);
    }
  }, [profissional, modalAberto]);

  if (!modalAberto) return null;

  const toggleMembroVinculado = (id: string) => {
    setMembrosVinculados((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !especialidade.trim()) return;
    setSalvando(true);
    try {
      const payload: ProfissionalSaude = {
        id: profissional?.id || `prof_${Date.now()}`,
        nome: nome.trim(),
        tipo,
        especialidade: especialidade.trim(),
        crm_crmv_cnpj: registro.trim() || undefined,
        telefone: telefone.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        email: email.trim() || undefined,
        endereco: endereco.trim() || undefined,
        observacoes: observacoes.trim() || undefined,
        membros_vinculados: membrosVinculados,
      };
      await onSalvar(payload);
    } catch (err) {
      console.error('Erro ao salvar profissional:', err);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onFechar} />
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            {profissional ? 'Editar Especialista / Clínica' : 'Cadastrar Especialista / Clínica'}
          </h3>
          <button type="button" onClick={onFechar} className="p-1 rounded-xl text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSalvar} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Campo
                rotulo="Nome do Profissional / Clínica *"
                placeholder="Ex: Dra. Paula Lima, VetCare..."
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tipo *</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as ProfissionalSaude['tipo'])}
                className="w-full h-10 px-3 text-xs bg-white border border-slate-200 rounded-xl focus:ring-1 focus:ring-teal-500 font-medium"
              >
                <option value="medico">Médico (Humano)</option>
                <option value="veterinario">Veterinário (Pet)</option>
                <option value="clinica">Clínica</option>
                <option value="hospital">Hospital</option>
                <option value="laboratorio">Laboratório</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Campo
              rotulo="Especialidade *"
              placeholder="Ex: Pediatria, Cardiologia, Oncologia Vet..."
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              required
            />
            <Campo
              rotulo="CRM / CRMV / CNPJ (Opcional)"
              placeholder="Ex: CRM 123456/SP"
              value={registro}
              onChange={(e) => setRegistro(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Campo
              rotulo="Telefone"
              placeholder="(11) 99999-0000"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
            <Campo
              rotulo="WhatsApp"
              placeholder="(11) 99999-0000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
            <Campo
              rotulo="E-mail"
              placeholder="contato@clinica.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Campo
            rotulo="Endereço da Clínica / Consultório"
            placeholder="Rua das Flores, 123 - Sala 45, São Paulo"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" /> Integrantes da Família Atendidos
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200">
              {membros.map((m) => {
                const isSelected = membrosVinculados.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggleMembroVinculado(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-teal-700 text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {m.nome}
                  </button>
                );
              })}
            </div>
          </div>

          <Campo
            rotulo="Observações e Anotações"
            placeholder="Ex: Atende convênio Bradesco, plantão 24h..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <Botao type="button" variante="secundario" onClick={onFechar}>
              Cancelar
            </Botao>
            <Botao type="submit" carregando={salvando} disabled={!nome.trim() || !especialidade.trim()}>
              Salvar Especialista
            </Botao>
          </div>
        </form>
      </div>
    </div>
  );
};
