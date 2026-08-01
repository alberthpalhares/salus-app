import { useState } from 'react';
import { Membro, TipoMembro, ContatoEmergencia, EspecialistaReferencia } from '../../../types/dominio';

export function useEdicaoFicha(membro: Membro, onSalvarMembro: (m: Membro) => Promise<void>, onCancelar: () => void) {
  const [salvando, setSalvando] = useState(false);

  const [nome, setNome] = useState(membro.nome || '');
  const [tipo, setTipo] = useState<TipoMembro>(membro.tipo || 'pessoa');
  const [nascimento, setNascimento] = useState(membro.nascimento || membro.data_nascimento || '');
  const [raca, setRaca] = useState(membro.raca || '');
  const [tipoSanguineo, setTipoSanguineo] = useState(membro.tipo_sanguineo || '');
  const [planoSaude, setPlanoSaude] = useState(membro.plano_saude || '');
  const [condicoesAtivas, setCondicoesAtivas] = useState<string[]>(
    membro.condicoes_ativas || membro.condicoes || []
  );
  const [alergias, setAlergias] = useState<string[]>(membro.alergias || []);
  const [contatosEmergencia, setContatosEmergencia] = useState<ContatoEmergencia[]>(
    membro.contatos_emergencia || []
  );
  const [especialistas, setEspecialistas] = useState<EspecialistaReferencia[]>(
    membro.especialistas_referencia || []
  );

  const [novaCondicao, setNovaCondicao] = useState('');
  const [novaAlergia, setNovaAlergia] = useState('');

  const [novoContatoNome, setNovoContatoNome] = useState('');
  const [novoContatoTel, setNovoContatoTel] = useState('');
  const [novoContatoPapel, setNovoContatoPapel] = useState('');

  const [novoEspNome, setNovoEspNome] = useState('');
  const [novoEspEspecialidade, setNovoEspEspecialidade] = useState('');
  const [novoEspContato, setNovoEspContato] = useState('');

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      const membroAtualizado: Membro = {
        ...membro,
        nome: nome.trim(),
        tipo,
        nascimento: nascimento.trim(),
        raca: raca.trim(),
        tipo_sanguineo: tipoSanguineo.trim(),
        plano_saude: planoSaude.trim(),
        condicoes_ativas: condicoesAtivas,
        alergias: alergias,
        contatos_emergencia: contatosEmergencia,
        especialistas_referencia: especialistas,
      };
      await onSalvarMembro(membroAtualizado);
      onCancelar();
    } catch (err) {
      console.error('Erro ao salvar ficha do membro:', err);
    } finally {
      setSalvando(false);
    }
  };

  const adicionarCondicao = () => {
    if (novaCondicao.trim()) {
      setCondicoesAtivas([...condicoesAtivas, novaCondicao.trim()]);
      setNovaCondicao('');
    }
  };

  const removerCondicao = (idx: number) => {
    setCondicoesAtivas(condicoesAtivas.filter((_, i) => i !== idx));
  };

  const adicionarAlergia = () => {
    if (novaAlergia.trim()) {
      setAlergias([...alergias, novaAlergia.trim()]);
      setNovaAlergia('');
    }
  };

  const removerAlergia = (idx: number) => {
    setAlergias(alergias.filter((_, i) => i !== idx));
  };

  const adicionarContato = () => {
    if (novoContatoNome.trim() && novoContatoTel.trim()) {
      setContatosEmergencia([
        ...contatosEmergencia,
        {
          nome: novoContatoNome.trim(),
          telefone: novoContatoTel.trim(),
          papel: novoContatoPapel.trim() || undefined,
        },
      ]);
      setNovoContatoNome('');
      setNovoContatoTel('');
      setNovoContatoPapel('');
    }
  };

  const removerContato = (idx: number) => {
    setContatosEmergencia(contatosEmergencia.filter((_, i) => i !== idx));
  };

  const adicionarEspecialista = () => {
    if (novoEspNome.trim() && novoEspEspecialidade.trim()) {
      setEspecialistas([
        ...especialistas,
        {
          nome: novoEspNome.trim(),
          especialidade: novoEspEspecialidade.trim(),
          contato: novoEspContato.trim() || undefined,
        },
      ]);
      setNovoEspNome('');
      setNovoEspEspecialidade('');
      setNovoEspContato('');
    }
  };

  const removerEspecialista = (idx: number) => {
    setEspecialistas(especialistas.filter((_, i) => i !== idx));
  };

  return {
    salvando,
    nome,
    setNome,
    tipo,
    setTipo,
    nascimento,
    setNascimento,
    raca,
    setRaca,
    tipoSanguineo,
    setTipoSanguineo,
    planoSaude,
    setPlanoSaude,
    condicoesAtivas,
    alergias,
    contatosEmergencia,
    especialistas,
    novaCondicao,
    setNovaCondicao,
    novaAlergia,
    setNovaAlergia,
    novoContatoNome,
    setNovoContatoNome,
    novoContatoTel,
    setNovoContatoTel,
    novoContatoPapel,
    setNovoContatoPapel,
    novoEspNome,
    setNovoEspNome,
    novoEspEspecialidade,
    setNovoEspEspecialidade,
    novoEspContato,
    setNovoEspContato,
    handleSalvar,
    adicionarCondicao,
    removerCondicao,
    adicionarAlergia,
    removerAlergia,
    adicionarContato,
    removerContato,
    adicionarEspecialista,
    removerEspecialista,
  };
}
