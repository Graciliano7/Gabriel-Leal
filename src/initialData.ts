import { Aluno, Dieta, Treino, Cardio, Suplemento, CheckIn, MedidaHistorico, FotoEvolucao, Mensagem, Pagamento, Alerta } from "./types";

export const INITIAL_ALUNOS: Aluno[] = [
  {
    id: "aluno_1",
    nome: "Pedro Santos Vital",
    email: "pedro.vital@email.com",
    avatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200",
    objetivo: "Hipertrofia Limpa & Definição",
    dataInicio: "2026-03-01",
    pesoInicial: 76.5,
    pesoAtual: 81.2,
    altura: 178,
    bfAtual: 11.4,
    status: "ativo",
    scoreAdesao: 94,
    telefone: "(11) 98765-4321"
  },
  {
    id: "aluno_2",
    nome: "Mariana Costa Silva",
    email: "mariana.silva@email.com",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    objetivo: "Emagrecimento & Tonificação",
    dataInicio: "2026-04-10",
    pesoInicial: 68.2,
    pesoAtual: 64.5,
    altura: 163,
    bfAtual: 22.1,
    status: "alerta",
    scoreAdesao: 68,
    telefone: "(21) 99888-7766"
  },
  {
    id: "aluno_3",
    nome: "Lucas Oliveira Nogueira",
    email: "lucas.nogueira@email.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    objetivo: "Recondicionamento & Perda de Gordura",
    dataInicio: "2026-02-15",
    pesoInicial: 98.0,
    pesoAtual: 93.8,
    altura: 184,
    bfAtual: 26.5,
    status: "alerta",
    scoreAdesao: 42,
    telefone: "(31) 97777-8888"
  }
];

export const INITIAL_DIETAS: Dieta[] = [
  {
    id: "dieta_1",
    alunoId: "aluno_1",
    caloriasAlvo: 2800,
    macrosAlvo: { carboidrato: 320, proteina: 180, gordura: 70 },
    refeicoes: [
      {
        id: "ref_1_1",
        nome: "Refeição 1 - Café da Manhã",
        horario: "07:30",
        concluida: true,
        enviadoAs: "07:42",
        fotoUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400",
        alimentos: [
          { nome: "Ovo Inteiro", quantidade: "3 unidades", proteina: 18, carboidrato: 1.5, gordura: 15 },
          { nome: "Pão de Forma Integral", quantidade: "2 fatias", proteina: 6, carboidrato: 24, gordura: 1.5 },
          { nome: "Mamão Papaia", quantidade: "150g", proteina: 1, carboidrato: 15, gordura: 0 }
        ]
      },
      {
        id: "ref_1_2",
        nome: "Refeição 2 - Almoço",
        horario: "12:30",
        concluida: true,
        enviadoAs: "12:35",
        fotoUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
        alimentos: [
          { nome: "Peito de Frango Grelhado", quantidade: "150g (pesado cozido)", proteina: 45, carboidrato: 0, gordura: 4 },
          { nome: "Arroz Branco Cozido", quantidade: "200g", proteina: 4, carboidrato: 56, gordura: 0.5 },
          { nome: "Feijão Carioca Cozido", quantidade: "100g", proteina: 5, carboidrato: 14, gordura: 0.5 },
          { nome: "Legumes Variados (Brócolis, Cenoura)", quantidade: "100g", proteina: 2, carboidrato: 8, gordura: 0 }
        ]
      },
      {
        id: "ref_1_3",
        nome: "Refeição 3 - Lanche da Tarde",
        horario: "16:00",
        concluida: false,
        alimentos: [
          { nome: "Iogurte Natural Desnatado", quantidade: "200g", proteina: 7, carboidrato: 10, gordura: 0 },
          { nome: "Whey Protein Concentrado", quantidade: "30g", proteina: 24, carboidrato: 3, gordura: 2 },
          { nome: "Aveia em Flocos", quantidade: "40g", proteina: 6, carboidrato: 26, gordura: 3 }
        ]
      },
      {
        id: "ref_1_4",
        nome: "Refeição 4 - Jantar",
        horario: "20:00",
        concluida: false,
        alimentos: [
          { nome: "Patinho Moído Grelhado", quantidade: "150g", proteina: 45, carboidrato: 0, gordura: 7 },
          { nome: "Batata Doce Cozida", quantidade: "250g", proteina: 3, carboidrato: 60, gordura: 0.5 },
          { nome: "Salada de Folhas Verdes", quantidade: "À vontade", proteina: 0, carboidrato: 2, gordura: 0 }
        ]
      }
    ]
  },
  {
    id: "dieta_2",
    alunoId: "aluno_2",
    caloriasAlvo: 1550,
    macrosAlvo: { carboidrato: 140, proteina: 120, gordura: 50 },
    refeicoes: [
      {
        id: "ref_2_1",
        nome: "Refeição 1 - Desjejum",
        horario: "08:00",
        concluida: true,
        enviadoAs: "08:15",
        fotoUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=400",
        alimentos: [
          { nome: "Ovo Mexido", quantidade: "2 unidades", proteina: 12, carboidrato: 1, gordura: 10 },
          { nome: "Morangos Frescos", quantidade: "120g", proteina: 1, carboidrato: 9, gordura: 0 }
        ]
      },
      {
        id: "ref_2_2",
        nome: "Refeição 2 - Almoço",
        horario: "13:00",
        concluida: false,
        alimentos: [
          { nome: "Filet de Tilápia Grelhado", quantidade: "120g", proteina: 26, carboidrato: 0, gordura: 2 },
          { nome: "Arroz Integral Cozido", quantidade: "90g", proteina: 2.5, carboidrato: 23, gordura: 0.8 },
          { nome: "Mix de Folhas + Tomate", quantidade: "Prato cheio (azeite 1 col. chá)", proteina: 1, carboidrato: 5, gordura: 5 }
        ]
      },
      {
        id: "ref_2_3",
        nome: "Refeição 3 - Lanche / Shake",
        horario: "17:00",
        concluida: false,
        alimentos: [
          { nome: "Whey Protein Isolado", quantidade: "25g", proteina: 22, carboidrato: 1, gordura: 0.5 },
          { nome: "Banana Prata", quantidade: "1 unidade", proteina: 1, carboidrato: 22, gordura: 0 }
        ]
      },
      {
        id: "ref_2_4",
        nome: "Refeição 4 - Jantar",
        horario: "20:30",
        concluida: false,
        alimentos: [
          { nome: "Peito de Frango Grelhado", quantidade: "100g", proteina: 30, carboidrato: 0, gordura: 2.5 },
          { nome: "Purê de Abóbora Cabotiá", quantidade: "150g", proteina: 2, carboidrato: 16, gordura: 1 }
        ]
      }
    ]
  },
  {
    id: "dieta_3",
    alunoId: "aluno_3",
    caloriasAlvo: 2100,
    macrosAlvo: { carboidrato: 210, proteina: 165, gordura: 65 },
    refeicoes: [
      {
        id: "ref_3_1",
        nome: "Refeição 1 - Café da Manhã",
        horario: "08:00",
        concluida: false,
        alimentos: [
          { nome: "Ovos Inteiros", quantidade: "3 unidades", proteina: 18, carboidrato: 1.5, gordura: 15 },
          { nome: "Banana Prata com Canela", quantidade: "2 unidades", proteina: 2, carboidrato: 44, gordura: 0.5 }
        ]
      },
      {
        id: "ref_3_2",
        nome: "Refeição 2 - Almoço",
        horario: "12:30",
        concluida: false,
        alimentos: [
          { nome: "Patinho Moído", quantidade: "150g", proteina: 45, carboidrato: 0, gordura: 7 },
          { nome: "Arroz Branco Cozido", quantidade: "150g", proteina: 3, carboidrato: 42, gordura: 0.4 },
          { nome: "Feijão Preto Cozido", quantidade: "80g", proteina: 4, carboidrato: 11, gordura: 0.4 }
        ]
      },
      {
        id: "ref_3_3",
        nome: "Refeição 3 - Lanche",
        horario: "16:30",
        concluida: false,
        alimentos: [
          { nome: "Pão Integral", quantidade: "2 fatias", proteina: 6, carboidrato: 24, gordura: 1.5 },
          { nome: "Atum Ralado ao Natural", quantidade: "1 lata (120g)", proteina: 24, carboidrato: 0, gordura: 1 }
        ]
      },
      {
        id: "ref_3_4",
        nome: "Refeição 4 - Jantar",
        horario: "21:00",
        concluida: false,
        alimentos: [
          { nome: "Peito de Frango Desfiado", quantidade: "140g", proteina: 42, carboidrato: 0, gordura: 3.5 },
          { nome: "Batata Doce Cozida", quantidade: "160g", proteina: 2, carboidrato: 38, gordura: 0.3 }
        ]
      }
    ]
  }
];

export const INITIAL_TREINOS: Treino[] = [
  {
    id: "treino_1_A",
    alunoId: "aluno_1",
    nomeDivisao: "Treino A - Peitorais & Tríceps (Foco Espessura)",
    concluidoHoje: true,
    exercicios: [
      { id: "ex_1_1", nome: "Supino Reto com Barra", series: 4, repeticoes: "8 a 10", carga: "90kg", descanso: "90s", concluido: true },
      { id: "ex_1_2", nome: "Supino Inclinado com Halteres", series: 4, repeticoes: "10 a 12", carga: "34kg / halter", descanso: "90s", concluido: true },
      { id: "ex_1_3", nome: "Crossover Polia Média-Alta", series: 3, repeticoes: "12 a 15", carga: "30kg cada lado", descanso: "60s", concluido: true },
      { id: "ex_1_4", nome: "Tríceps Testa com Barra W", series: 4, repeticoes: "10 a 12", carga: "32kg", descanso: "90s", concluido: true },
      { id: "ex_1_5", nome: "Tríceps Corda na Polia", series: 3, repeticoes: "12 a 15 (Drop na última)", carga: "45kg", descanso: "60s", concluido: true }
    ]
  },
  {
    id: "treino_1_B",
    alunoId: "aluno_1",
    nomeDivisao: "Treino B - Dorsais, Bíceps & Posterior Ombro",
    concluidoHoje: false,
    exercicios: [
      { id: "ex_1_6", nome: "Puxada Aberta no Pulley", series: 4, repeticoes: "10 a 12", carga: "75kg", descanso: "90s", concluido: false },
      { id: "ex_1_7", nome: "Remada Curvada Pronada", series: 4, repeticoes: "8 a 10", carga: "80kg", descanso: "90s", concluido: false },
      { id: "ex_1_8", nome: "Remada Baixa Neutra", series: 3, repeticoes: "12", carga: "65kg", descanso: "60s", concluido: false },
      { id: "ex_1_9", nome: "Rosca Direta com Barra W", series: 4, repeticoes: "10", carga: "36kg", descanso: "90s", concluido: false },
      { id: "ex_1_10", nome: "Rosca Martelo Alternada", series: 3, repeticoes: "12 cada braço", carga: "18kg / halter", descanso: "60s", concluido: false }
    ]
  },
  {
    id: "treino_2_A",
    alunoId: "aluno_2",
    nomeDivisao: "Treino A - Quadríceps & Ombros",
    concluidoHoje: false,
    exercicios: [
      { id: "ex_2_1", nome: "Cadeira Extensora (Aquecimento + Séries)", series: 4, repeticoes: "12 a 15 (Ponto zero)", carga: "30kg", descanso: "60s", concluido: false },
      { id: "ex_2_2", nome: "Agachamento Búlgaro", series: 3, repeticoes: "10 cada perna", carga: "10kg / halter", descanso: "90s", concluido: false },
      { id: "ex_2_3", nome: "Leg Press 45 Clássico", series: 4, repeticoes: "12 (Concentrado)", carga: "140kg", descanso: "90s", concluido: false },
      { id: "ex_2_4", nome: "Desenvolvimento com Halteres", series: 3, repeticoes: "12", carga: "10kg / halter", descanso: "60s", concluido: false },
      { id: "ex_2_5", nome: "Elevação Lateral Inclinada", series: 4, repeticoes: "15", carga: "6kg / halter", descanso: "60s", concluido: false }
    ]
  },
  {
    id: "treino_2_B",
    alunoId: "aluno_2",
    nomeDivisao: "Treino B - Glúteos & Isquiotibiais",
    concluidoHoje: false,
    exercicios: [
      { id: "ex_2_6", nome: "Elevação Pélvica com Barra", series: 4, repeticoes: "10 a 12 (Isometria 2s)", carga: "60kg", descanso: "90s", concluido: false },
      { id: "ex_2_7", nome: "Stiff com Halteres", series: 4, repeticoes: "12", carga: "16kg / halter", descanso: "75s", concluido: false },
      { id: "ex_2_8", nome: "Cadeira Flexora", series: 3, repeticoes: "15 (Drop set na última)", carga: "25kg", descanso: "60s", concluido: false }
    ]
  },
  {
    id: "treino_3_A",
    alunoId: "aluno_3",
    nomeDivisao: "Treino Integrado FullBody A",
    concluidoHoje: false,
    exercicios: [
      { id: "ex_3_1", nome: "Puxada Aberta no Pulley", series: 3, repeticoes: "12 a 15", carga: "40kg", descanso: "60s", concluido: false },
      { id: "ex_3_2", nome: "Supino Máquina", series: 3, repeticoes: "12", carga: "35kg", descanso: "60s", concluido: false },
      { id: "ex_3_3", nome: "Leg Press Horizontal", series: 4, repeticoes: "15", carga: "80kg", descanso: "75s", concluido: false },
      { id: "ex_3_4", nome: "Mesa Flexora", series: 3, repeticoes: "12", carga: "20kg", descanso: "60s", concluido: false },
      { id: "ex_3_5", nome: "Abnominal Remador no Colchonete", series: 3, repeticoes: "20", carga: "Corporal", descanso: "45s", concluido: false }
    ]
  }
];

export const INITIAL_CARDIOS: Cardio[] = [
  {
    id: "cardio_1",
    alunoId: "aluno_1",
    tipo: "Caminhada Rápida / Corrida leve na Esteira",
    duracaoAlvo: 40,
    duracaoRealizada: 40,
    frequenciaSemanal: 4,
    frequenciaRealizada: 4,
    intensidade: "moderada",
    concluido: true
  },
  {
    id: "cardio_2",
    alunoId: "aluno_2",
    tipo: "Bicicleta Ergométrica (Spinning)",
    duracaoAlvo: 45,
    duracaoRealizada: 15, // Pendente / Incompleto
    frequenciaSemanal: 5,
    frequenciaRealizada: 2,
    intensidade: "alta",
    concluido: false
  },
  {
    id: "cardio_3",
    alunoId: "aluno_3",
    tipo: "Caminhada na Esteira",
    duracaoAlvo: 50,
    duracaoRealizada: 0, // Não fez nada
    frequenciaSemanal: 6,
    frequenciaRealizada: 1,
    intensidade: "baixa",
    concluido: false
  }
];

export const INITIAL_SUPLEMENTOS: Suplemento[] = [
  { id: "sup_1_1", alunoId: "aluno_1", nome: "Creatina Monoidratada", dosagem: "6g", horario: "Pós-treino", concluidoHoje: true, categoria: "suplemento" },
  { id: "sup_1_2", alunoId: "aluno_1", nome: "Beta-Alanina", dosagem: "3g", horario: "Pré-treino", concluidoHoje: true, categoria: "suplemento" },
  { id: "sup_1_3", alunoId: "aluno_1", nome: "Multivitamínico Ultra", dosagem: "1 cap", horario: "No almoço", concluidoHoje: true, categoria: "suplemento" },
  { id: "sup_1_4", alunoId: "aluno_1", nome: "Testosterona Enantato (TRT)", dosagem: "100mg", horario: "Quarta-feira (Manhã)", concluidoHoje: true, categoria: "hormonio" },
  { id: "sup_1_5", alunoId: "aluno_1", nome: "Anastrozol (Prevenção)", dosagem: "0.5mg", horario: "Segunda e Quinta-feira", concluidoHoje: true, categoria: "farmaco" },
  
  { id: "sup_2_1", alunoId: "aluno_2", nome: "Whey Protein Isolado", dosagem: "25g", horario: "17h", concluidoHoje: false, categoria: "suplemento" },
  { id: "sup_2_2", alunoId: "aluno_2", nome: "Picolinato de Cromo", dosagem: "200mcg", horario: "No almoço", concluidoHoje: true, categoria: "suplemento" },
  { id: "sup_2_3", alunoId: "aluno_2", nome: "Oxandrolona (Performance)", dosagem: "10mg", horario: "12/12 horas", concluidoHoje: false, categoria: "hormonio" },
  { id: "sup_2_4", alunoId: "aluno_2", nome: "Melatonina", dosagem: "2mg", horario: "30 min antes de dormir", concluidoHoje: false, categoria: "suplemento" },
  { id: "sup_2_5", alunoId: "aluno_2", nome: "Silimarina (Protetor Hepático)", dosagem: "200mg", horario: "Junto ao almoço", concluidoHoje: true, categoria: "farmaco" },

  { id: "sup_3_1", alunoId: "aluno_3", nome: "Multivitamínico", dosagem: "1 cap", horario: "Café da manhã", concluidoHoje: false, categoria: "suplemento" },
  { id: "sup_3_2", alunoId: "aluno_3", nome: "Creatina", dosagem: "5g", horario: "Qualquer horário", concluidoHoje: false, categoria: "suplemento" }
];

export const INITIAL_MEDIDAS: MedidaHistorico[] = [
  // Pedro
  { id: "med_1_1", alunoId: "aluno_1", data: "2026-03-01", peso: 76.5, bf: 13.5, peitoral: 102, bracoD: 36.5, bracoE: 36.2, cintura: 82, quadril: 98, coxaD: 56, coxaE: 55.5 },
  { id: "med_1_2", alunoId: "aluno_1", data: "2026-04-01", peso: 78.8, bf: 12.2, peitoral: 104.5, bracoD: 37.8, bracoE: 37.6, cintura: 80.5, quadril: 99, coxaD: 57.5, coxaE: 57.2 },
  { id: "med_1_3", alunoId: "aluno_1", data: "2026-05-01", peso: 81.2, bf: 11.4, peitoral: 107, bracoD: 39.1, bracoE: 38.9, cintura: 79.0, quadril: 100, coxaD: 59.2, coxaE: 59.0 },
  
  // Mariana
  { id: "med_2_1", alunoId: "aluno_2", data: "2026-04-10", peso: 68.2, bf: 25.4, peitoral: 91, bracoD: 29.5, bracoE: 29.5, cintura: 78, quadril: 104, coxaD: 58.5, coxaE: 58.0 },
  { id: "med_2_2", alunoId: "aluno_2", data: "2026-05-10", peso: 64.5, bf: 22.1, peitoral: 89, bracoD: 28.1, bracoE: 28.0, cintura: 72.5, quadril: 101, coxaD: 56.2, coxaE: 56.0 },
  
  // Lucas
  { id: "med_3_1", alunoId: "aluno_3", data: "2026-02-15", peso: 98.0, bf: 31.2, peitoral: 112, bracoD: 35.0, bracoE: 35.0, cintura: 106, quadril: 114, coxaD: 62.0, coxaE: 62.0 },
  { id: "med_3_2", alunoId: "aluno_3", data: "2026-04-15", peso: 93.8, bf: 26.5, peitoral: 109, bracoD: 36.5, bracoE: 36.4, cintura: 96.0, quadril: 109, coxaD: 60.5, coxaE: 60.5 }
];

export const INITIAL_FOTOS: FotoEvolucao[] = [
  {
    id: "foto_1_1",
    alunoId: "aluno_1",
    data: "2026-03-01",
    fase: "Início",
    frenteUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "foto_1_2",
    alunoId: "aluno_1",
    data: "2026-05-01",
    fase: "Atual",
    frenteUrl: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "foto_2_1",
    alunoId: "aluno_2",
    data: "2026-04-10",
    fase: "Início",
    frenteUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400"
  },
  {
    id: "foto_2_2",
    alunoId: "aluno_2",
    data: "2026-05-10",
    fase: "Atual",
    frenteUrl: "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?auto=format&fit=crop&q=80&w=400"
  }
];

export const INITIAL_CHECKINS: CheckIn[] = [
  // Pedro
  {
    id: "chk_1_1",
    alunoId: "aluno_1",
    data: "2026-05-18",
    respondido: true,
    peso: 81.2,
    rendimentoTreino: 5,
    qualidadeSono: 4,
    disposicao: 5,
    estresse: 2,
    fome: 3,
    comentarios: "Semana fantástica! Treinos com cargas brutas, força subindo a cada dia. Senti que a vascularização e densidade melhoraram muito. Dieta seguida 100%.",
    dataResposta: "2026-05-18T10:15:00Z"
  },
  // Mariana (pendente)
  {
    id: "chk_2_1",
    alunoId: "aluno_2",
    data: "2026-05-20",
    respondido: false
  },
  // Lucas (atrasado)
  {
    id: "chk_3_1",
    alunoId: "aluno_3",
    data: "2026-05-15",
    respondido: false
  }
];

export const INITIAL_MENSAGENS: Mensagem[] = [
  { id: "msg_1_1", alunoId: "aluno_1", remetente: "personal", texto: "Fala Pedro! Como estão se sentindo as cargas no supino?", data: "2026-05-22T10:00:00Z" },
  { id: "msg_1_2", alunoId: "aluno_1", remetente: "aluno", texto: "Mestre, subi pra 90kg totais ontem! Executado muito bem, amplitude total. Sentindo o tríceps acompanhar bem também.", data: "2026-05-22T11:15:00Z" },
  { id: "msg_1_3", alunoId: "aluno_1", remetente: "personal", texto: "Excelente evolução meu caro, consistência brutal. Mantém a técnica, próxima semana avaliamos se aumentamos macros do pós-treino.", data: "2026-05-22T14:30:00Z" },

  { id: "msg_2_1", alunoId: "aluno_2", remetente: "personal", texto: "Oi Mariana, notei que faltou o registro do cardio nos últimos dias. Tudo bem com a rotina?", data: "2026-05-21T09:00:00Z" },
  { id: "msg_2_2", alunoId: "aluno_2", remetente: "aluno", texto: "Oi coach, está uma loucura no trabalho essa semana de fechamento, acabei saindo muito tarde e não consegui ir fazer o cardio de noite. Vou tentar compensar no sábado!", data: "2026-05-21T11:45:00Z" }
];

export const INITIAL_PAGAMENTOS: Pagamento[] = [
  { id: "pay_1", alunoId: "aluno_1", alunoNome: "Pedro Santos Vital", valor: 150.00, status: "pago", vencimento: "2026-05-10", dataPagamento: "2026-05-09" },
  { id: "pay_2", alunoId: "aluno_2", alunoNome: "Mariana Costa Silva", valor: 150.00, status: "pago", vencimento: "2026-05-15", dataPagamento: "2026-05-15" },
  { id: "pay_3", alunoId: "aluno_3", alunoNome: "Lucas Oliveira Nogueira", valor: 150.00, status: "atrasado", vencimento: "2026-05-05" }
];

export const INITIAL_ALERTAS: Alerta[] = [
  {
    id: "alert_1",
    alunoId: "aluno_3",
    alunoNome: "Lucas Oliveira Nogueira",
    tipo: "sem_registro",
    mensagem: "Aluno sem registrar nenhuma atividade (alimentação/treino) nos últimos 3 dias.",
    gravidade: "perigo",
    data: "2026-05-23T08:00:00Z"
  },
  {
    id: "alert_2",
    alunoId: "aluno_2",
    alunoNome: "Mariana Costa Silva",
    tipo: "checkin_pendente",
    mensagem: "Check-in Semanal pendente há mais de 3 dias de atraso.",
    gravidade: "alerta",
    data: "2026-05-22T12:00:00Z"
  },
  {
    id: "alert_3",
    alunoId: "aluno_2",
    alunoNome: "Mariana Costa Silva",
    tipo: "cardio_incompleto",
    mensagem: "Adesão de Cardio mensal em 30% da meta semanal (apenas 2 de 5 realizados).",
    gravidade: "info",
    data: "2026-05-23T11:30:00Z"
  },
  {
    id: "alert_4",
    alunoId: "aluno_3",
    alunoNome: "Lucas Oliveira Nogueira",
    tipo: "financeiro",
    mensagem: "Mensalidade do plano com vencimento em 05/05/2026 em aberto (Atrasado).",
    gravidade: "perigo",
    data: "2026-05-06T09:00:00Z"
  }
];
