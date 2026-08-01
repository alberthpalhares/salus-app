import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { ProfissionalSaude, Membro } from '../../types/dominio';
import { repositorioprofissionais, repositoriomembros } from '../../data/repositorios';

export function useProfissionais() {
  const { user } = useAuth();
  const [carregando, setCarregando] = useState(true);
  const [profissionais, setProfissionais] = useState<ProfissionalSaude[]>([]);
  const [membros, setMembros] = useState<Membro[]>([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [modalAberto, setModalAberto] = useState(false);
  const [profissionalEditando, setProfissionalEditando] = useState<ProfissionalSaude | null>(null);

  const carregarDados = async () => {
    if (!user) return;
    setCarregando(true);
    try {
      const [profsRes, membrosRes] = await Promise.all([
        repositorioprofissionais.listar(user.uid),
        repositoriomembros.listar(user.uid),
      ]);
      setProfissionais(profsRes || []);
      setMembros(membrosRes || []);
    } catch (err) {
      console.error('Erro ao carregar profissionais:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [user]);

  const handleSalvarProfissional = async (dado: ProfissionalSaude) => {
    if (!user) return;
    await repositorioprofissionais.salvar(user.uid, dado);
    await carregarDados();
    setModalAberto(false);
    setProfissionalEditando(null);
  };

  const handleRemoverProfissional = async (id: string) => {
    if (!user) return;
    await repositorioprofissionais.remover(user.uid, id);
    await carregarDados();
  };

  const profissionaisFiltrados = profissionais.filter((p) => {
    const combinaBusca =
      p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.especialidade.toLowerCase().includes(termoBusca.toLowerCase());
    const combinaTipo = filtroTipo === 'todos' || p.tipo === filtroTipo;
    return combinaBusca && combinaTipo;
  });

  return {
    carregando,
    profissionais: profissionaisFiltrados,
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
  };
}
