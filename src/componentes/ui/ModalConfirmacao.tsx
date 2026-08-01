import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './Dialog';
import { Botao } from './Botao';
import { AlertTriangle } from 'lucide-react';

export interface ModalConfirmacaoProps {
  aberto: boolean;
  onFechar: () => void;
  onConfirmar: () => void | Promise<void>;
  titulo: string;
  descricao: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  variante?: 'perigo' | 'primario' | 'alerta';
  carregando?: boolean;
}

export const ModalConfirmacao: React.FC<ModalConfirmacaoProps> = ({
  aberto,
  onFechar,
  onConfirmar,
  titulo,
  descricao,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'perigo',
  carregando = false,
}) => {
  return (
    <Dialog open={aberto} onOpenChange={(val) => !val && onFechar()}>
      <DialogContent onClose={onFechar}>
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            {variante === 'perigo' && <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
            <DialogTitle>{titulo}</DialogTitle>
          </div>
          <DialogDescription>{descricao}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Botao variante="secundario" onClick={onFechar} disabled={carregando}>
            {textoCancelar}
          </Botao>
          <Botao
            variante={variante === 'perigo' ? 'perigo' : 'primario'}
            onClick={onConfirmar}
            carregando={carregando}
          >
            {textoConfirmar}
          </Botao>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
