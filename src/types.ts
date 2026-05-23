export interface Alimento {
  nome: string;
  quantidade: string;
  proteina?: number; // g
  carboidrato?: number; // g
  gordura?: number; // g
}

export interface Refeicao {
  id: string;
  nome: string;
  horario: string;
  alimentos: Alimento[];
  concluida: boolean;
  fotoUrl?: string;
  enviadoAs?: string;
}

export interface Dieta {
  id: string;
  alunoId: string;
  caloriasAlvo: number;
  macrosAlvo: {
    carboidrato: number; // g
    proteina: number; // g
    gordura: number; // g
  };
  refeicoes: Refeicao[];
}

export interface Exercicio {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
  carga: string;
  descanso: string;
  concluido: boolean;
}

export interface Treino {
  id: string;
  alunoId: string;
  nomeDivisao: string; // Ex: "Treino A - Peito e Tríceps"
  exercicios: Exercicio[];
  concluidoHoje: boolean;
}

export interface Cardio {
  id: string;
  alunoId: string;
  tipo: string; // Ex: "Esteira", "Bike", "Elíptico"
  duracaoAlvo: number; // minutos
  duracaoRealizada: number; // minutos
  frequenciaSemanal: number;
  frequenciaRealizada: number;
  intensidade: "baixa" | "moderada" | "alta";
  concluido: boolean;
}

export interface Suplemento {
  id: string;
  alunoId: string;
  nome: string;
  dosagem: string;
  horario: string;
  concluidoHoje: boolean;
  categoria?: "suplemento" | "farmaco" | "hormonio";
}

export interface CheckIn {
  id: string;
  alunoId: string;
  data: string;
  respondido: boolean;
  peso?: number;
  rendimentoTreino?: number; // 1-5
  qualidadeSono?: number; // 1-5
  disposicao?: number; // 1-5
  estresse?: number; // 1-5
  fome?: number; // 1-5
  comentarios?: string;
  dataResposta?: string;
}

export interface MedidaHistorico {
  id: string;
  alunoId: string;
  data: string;
  peso: number;
  bf: number;
  peitoral?: number;
  bracoD?: number;
  bracoE?: number;
  cintura?: number;
  quadril?: number;
  coxaD?: number;
  coxaE?: number;
}

export interface FotoEvolucao {
  id: string;
  alunoId: string;
  data: string;
  fase: string; // Ex: "Início", "Mês 1", "Mês 2", "Atual"
  frenteUrl: string; // Contains image url or objectUrl or base64
  costasUrl?: string;
  perfilUrl?: string;
  tipo?: "imagem" | "video" | "documento" | "outro";
  nomeArquivo?: string;
  tamanhoArquivo?: string;
  extensao?: string;
}

export interface Mensagem {
  id: string;
  alunoId: string;
  remetente: "personal" | "aluno";
  texto: string;
  data: string;
  arquivoUrl?: string;
  tipoArquivo?: "imagem" | "video";
  nomeArquivo?: string;
}

export interface Alerta {
  id: string;
  alunoId: string;
  alunoNome: string;
  tipo: "baixa_adesao" | "sem_registro" | "checkin_pendente" | "cardio_incompleto" | "financeiro";
  mensagem: string;
  gravidade: "info" | "alerta" | "perigo";
  data: string;
}

export interface PlanoFinanceiro {
  id: string;
  nome: string;
  descricao: string;
  valor: number;
  periodo: "mensal" | "trimestral" | "semestral" | "anual";
}

export interface Pagamento {
  id: string;
  alunoId: string;
  alunoNome: string;
  valor: number;
  status: "pago" | "pendente" | "atrasado";
  vencimento: string;
  dataPagamento?: string;
  planoId?: string; // associado opcionalmente a um plano
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  avatar: string;
  objetivo: string;
  dataInicio: string;
  pesoInicial: number;
  pesoAtual: number;
  altura: number; // cm
  bfAtual: number;
  status: "ativo" | "inativo" | "alerta";
  scoreAdesao: number; // 0-100
  telefone: string;
}
