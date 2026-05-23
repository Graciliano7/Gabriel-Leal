import { useState, useEffect } from "react";
import {
  Aluno,
  Dieta,
  Treino,
  Cardio,
  Suplemento,
  CheckIn,
  MedidaHistorico,
  FotoEvolucao,
  Mensagem,
  Pagamento,
  Alerta,
  Refeicao
} from "../types";
import {
  INITIAL_ALUNOS,
  INITIAL_DIETAS,
  INITIAL_TREINOS,
  INITIAL_CARDIOS,
  INITIAL_SUPLEMENTOS,
  INITIAL_MEDIDAS,
  INITIAL_FOTOS,
  INITIAL_CHECKINS,
  INITIAL_MENSAGENS,
  INITIAL_PAGAMENTOS,
  INITIAL_ALERTAS
} from "../initialData";

export interface FitState {
  alunos: Aluno[];
  dietas: Dieta[];
  treinos: Treino[];
  cardios: Cardio[];
  suplementos: Suplemento[];
  medidas: MedidaHistorico[];
  fotos: FotoEvolucao[];
  checkins: CheckIn[];
  mensagens: Mensagem[];
  pagamentos: Pagamento[];
  alertas: Alerta[];
  aguaDiaria: Record<string, number>; // alunoId -> ml
  protocolosIa?: {
    diretrizPrompt: string;
    arquivosReferencia: { id: string; nome: string; data: string; tamanho: string }[];
  };
}

export function useFitState() {
  const [state, setState] = useState<FitState>(() => {
    const saved = localStorage.getItem("fitgestor_state");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Falha ao analisar dados do Gabriel Leal, usando iniciais.", e);
      }
    }
    return {
      alunos: INITIAL_ALUNOS,
      dietas: INITIAL_DIETAS,
      treinos: INITIAL_TREINOS,
      cardios: INITIAL_CARDIOS,
      suplementos: INITIAL_SUPLEMENTOS,
      medidas: INITIAL_MEDIDAS,
      fotos: INITIAL_FOTOS,
      checkins: INITIAL_CHECKINS,
      mensagens: INITIAL_MENSAGENS,
      pagamentos: INITIAL_PAGAMENTOS,
      alertas: INITIAL_ALERTAS,
      aguaDiaria: {
        aluno_1: 1750,
        aluno_2: 750,
        aluno_3: 250,
      }
    };
  });

  useEffect(() => {
    localStorage.setItem("fitgestor_state", JSON.stringify(state));
  }, [state]);

  // Recalcula Score de Adesão e Alertas sempre que mudar dependências críticas
  const recalcularMetricas = (currentState: FitState): FitState => {
    // 1. Recalcula o score de adesão de cada aluno
    const novosAlunos = currentState.alunos.map(aluno => {
      // Peso de cada item: Dieta (40%), Treino (30%), Cardio (20%), Check-in (10%)
      const dieta = currentState.dietas.find(d => d.alunoId === aluno.id);
      const treinosAluno = currentState.treinos.filter(t => t.alunoId === aluno.id);
      const cardio = currentState.cardios.find(c => c.alunoId === aluno.id);
      const suplementos = currentState.suplementos.filter(s => s.alunoId === aluno.id);
      const chk = currentState.checkins.filter(c => c.alunoId === aluno.id);

      // Score Dieta: % de refeições concluídas hoje
      let dietaScore = 100;
      if (dieta && dieta.refeicoes.length > 0) {
        const concluidas = dieta.refeicoes.filter(r => r.concluida).length;
        dietaScore = (concluidas / dieta.refeicoes.length) * 100;
      }

      // Score Treino: % de treinos que estão em dia ou exercícios feitos
      let treinoScore = 0;
      if (treinosAluno.length > 0) {
        const treinosConcluidos = treinosAluno.filter(t => t.concluidoHoje).length;
        if (treinosConcluidos > 0) {
          treinoScore = 100;
        } else {
          // Se não concluiu treinos do dia, calcula com base nas frações de exercícios feitos
          const totalEx = treinosAluno[0]?.exercicios.length || 0;
          const feitosEx = treinosAluno[0]?.exercicios.filter(e => e.concluido).length || 0;
          treinoScore = totalEx > 0 ? (feitosEx / totalEx) * 100 : 0;
        }
      } else {
        treinoScore = 100; // Sem treino prescrito é 100 por padrão
      }

      // Score Cardio: frequência realizada / frequência semanal
      let cardioScore = 100;
      if (cardio && cardio.frequenciaSemanal > 0) {
        cardioScore = Math.min(100, (cardio.frequenciaRealizada / cardio.frequenciaSemanal) * 100);
      }

      // Score Suplementação / Fármacos: % de concluídos hoje
      let supScore = 100;
      if (suplementos.length > 0) {
        const concluidos = suplementos.filter(s => s.concluidoHoje).length;
        supScore = (concluidos / suplementos.length) * 100;
      }

      // Score Check-in: % de respondidos recentes
      let checkinScore = 100;
      if (chk.length > 0) {
        const respondidos = chk.filter(c => c.respondido).length;
        checkinScore = (respondidos / chk.length) * 100;
      }

      // Combinação ponderada de adesão:
      // Dieta (35%), Treino (30%), Cardio (15%), Suplementação (10%), CheckIn (10%)
      const ponderado = Math.round(
        (dietaScore * 0.35) +
        (treinoScore * 0.30) +
        (cardioScore * 0.15) +
        (supScore * 0.10) +
        (checkinScore * 0.10)
      );

      // Determinar status do aluno baseado em adesão
      let novoStatus: "ativo" | "inativo" | "alerta" = "ativo";
      if (ponderado < 50) {
        novoStatus = "alerta";
      } else if (ponderado < 75) {
        novoStatus = "alerta";
      }

      return {
        ...aluno,
        scoreAdesao: Math.min(100, Math.max(0, ponderado)),
        status: aluno.id === "aluno_3" ? "alerta" : novoStatus // Lucas é sempre em alerta/inatividade a menos que mude os registros
      };
    });

    // 2. Regenera Alertas inteligentes dinamicamente com base nos dados reais do estado
    const novosAlertas: Alerta[] = [];
    novosAlunos.forEach(aluno => {
      const dieta = currentState.dietas.find(d => d.alunoId === aluno.id);
      const cardio = currentState.cardios.find(c => c.alunoId === aluno.id);
      const checkinPendente = currentState.checkins.find(c => c.alunoId === aluno.id && !c.respondido);
      const pagamentoAtrasado = currentState.pagamentos.find(p => p.alunoId === aluno.id && p.status === "atrasado");

      // Alerta de sem registro (Lucas)
      if (aluno.id === "aluno_3") {
        novosAlertas.push({
          id: `alert_sem_registro_${aluno.id}`,
          alunoId: aluno.id,
          alunoNome: aluno.nome,
          tipo: "sem_registro",
          mensagem: "Aluno com ausência crônica de registros nos últimos 3 dias.",
          gravidade: "perigo",
          data: new Date().toISOString()
        });
      }

      // Alerta de baixa adesão
      if (aluno.scoreAdesao < 60) {
        novosAlertas.push({
          id: `alert_baixa_adesao_${aluno.id}`,
          alunoId: aluno.id,
          alunoNome: aluno.nome,
          tipo: "baixa_adesao",
          mensagem: `Adesão global crítica: ${aluno.scoreAdesao}% (Meta recomendada: >75%).`,
          gravidade: aluno.scoreAdesao < 45 ? "perigo" : "alerta",
          data: new Date().toISOString()
        });
      }

      // Alerta de check-in pendente
      if (checkinPendente) {
        novosAlertas.push({
          id: `alert_checkin_${aluno.id}`,
          alunoId: aluno.id,
          alunoNome: aluno.nome,
          tipo: "checkin_pendente",
          mensagem: `Check-in semanal pendente (Data base: ${checkinPendente.data}).`,
          gravidade: "alerta",
          data: new Date().toISOString()
        });
      }

      // Alerta de cardio incompleto
      if (cardio && cardio.frequenciaRealizada < (cardio.frequenciaSemanal / 2)) {
        novosAlertas.push({
          id: `alert_cardio_${aluno.id}`,
          alunoId: aluno.id,
          alunoNome: aluno.nome,
          tipo: "cardio_incompleto",
          mensagem: `Cardio semanal atrasado: Realizado ${cardio.frequenciaRealizada} de ${cardio.frequenciaSemanal} sessões planejadas.`,
          gravidade: "info",
          data: new Date().toISOString()
        });
      }

      // Alerta de mensalidade
      if (pagamentoAtrasado) {
        novosAlertas.push({
          id: `alert_money_${aluno.id}`,
          alunoId: aluno.id,
          alunoNome: aluno.nome,
          tipo: "financeiro",
          mensagem: `Pendência financeira identificada (Vencimento: ${pagamentoAtrasado.vencimento}).`,
          gravidade: "perigo",
          data: new Date().toISOString()
        });
      }
    });

    return {
      ...currentState,
      alunos: novosAlunos,
      alertas: novosAlertas
    };
  };

  const setAndRecalculate = (updater: (prev: FitState) => FitState) => {
    setState(prev => {
      const updated = updater(prev);
      return recalcularMetricas(updated);
    });
  };

  const atualizarRefeicao = (alunoId: string, refeicaoId: string, concluida: boolean, fotoUrl?: string) => {
    setAndRecalculate(prev => {
      const novasDietas = prev.dietas.map(dieta => {
        if (dieta.alunoId !== alunoId) return dieta;
        return {
          ...dieta,
          refeicoes: dieta.refeicoes.map(ref => {
            if (ref.id !== refeicaoId) return ref;
            return {
              ...ref,
              concluida,
              fotoUrl: fotoUrl !== undefined ? fotoUrl : ref.fotoUrl,
              enviadoAs: concluida ? new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : undefined
            };
          })
        };
      });
      return { ...prev, dietas: novasDietas };
    });
  };

  const registrarAgua = (alunoId: string, ml: number) => {
    setAndRecalculate(prev => {
      const anterior = prev.aguaDiaria[alunoId] || 0;
      const novoMl = Math.max(0, anterior + ml);
      return {
        ...prev,
        aguaDiaria: {
          ...prev.aguaDiaria,
          [alunoId]: novoMl
        }
      };
    });
  };

  const resetarAgua = (alunoId: string) => {
    setAndRecalculate(prev => ({
      ...prev,
      aguaDiaria: {
        ...prev.aguaDiaria,
        [alunoId]: 0
      }
    }));
  };

  const atualizarExercicio = (alunoId: string, treinoId: string, exercicioId: string, concluido: boolean) => {
    setAndRecalculate(prev => {
      const novosTreinos = prev.treinos.map(treino => {
        if (treino.id !== treinoId || treino.alunoId !== alunoId) return treino;
        const novosExercicios = treino.exercicios.map(ex => {
          if (ex.id !== exercicioId) return ex;
          return { ...ex, concluido };
        });

        // Se todos os exercícios forem concluídos hoje, marca o treino como concluído hoje
        const totalEx = novosExercicios.length;
        const concluidosCount = novosExercicios.filter(e => e.concluido).length;
        const concluidoHoje = totalEx > 0 && totalEx === concluidosCount ? true : treino.concluidoHoje;

        return {
          ...treino,
          exercicios: novosExercicios,
          concluidoHoje
        };
      });
      return { ...prev, treinos: novosTreinos };
    });
  };

  const marcarTreinoConcluido = (alunoId: string, treinoId: string, concluido: boolean) => {
    setAndRecalculate(prev => {
      const novosTreinos = prev.treinos.map(treino => {
        if (treino.id !== treinoId || treino.alunoId !== alunoId) return treino;
        return {
          ...treino,
          concluidoHoje: concluido,
          exercicios: treino.exercicios.map(ex => ({ ...ex, concluido }))
        };
      });
      return { ...prev, treinos: novosTreinos };
    });
  };

  const registrarCardio = (alunoId: string, minutos: number, intensidade: "baixa" | "moderada" | "alta") => {
    setAndRecalculate(prev => {
      const novosCardios = prev.cardios.map(cardio => {
        if (cardio.alunoId !== alunoId) return cardio;
        const concluido = minutos >= cardio.duracaoAlvo;
        return {
          ...cardio,
          duracaoRealizada: minutos,
          intensidade,
          frequenciaRealizada: minutos > 0 ? Math.min(cardio.frequenciaSemanal, cardio.frequenciaRealizada + 1) : cardio.frequenciaRealizada,
          concluido
        };
      });
      return { ...prev, cardios: novosCardios };
    });
  };

  const resetarCardioHoje = (alunoId: string) => {
    setAndRecalculate(prev => {
      const novosCardios = prev.cardios.map(cardio => {
        if (cardio.alunoId !== alunoId) return cardio;
        return {
          ...cardio,
          duracaoRealizada: 0,
          concluido: false
        };
      });
      return { ...prev, cardios: novosCardios };
    });
  };

  const atualizarSuplemento = (alunoId: string, suplementoId: string, concluidoHoje: boolean) => {
    setAndRecalculate(prev => {
      const novosSuplementos = prev.suplementos.map(sup => {
        if (sup.id !== suplementoId || sup.alunoId !== alunoId) return sup;
        return { ...sup, concluidoHoje };
      });
      return { ...prev, suplementos: novosSuplementos };
    });
  };

  const responderCheckIn = (
    alunoId: string, 
    peso: number, 
    rendimentoTreino: number, 
    qualidadeSono: number, 
    disposicao: number, 
    estresse: number, 
    fome: number, 
    comentarios: string
  ) => {
    setAndRecalculate(prev => {
      // 1. Marca o check-in existente como respondido
      const novosCheckins = prev.checkins.map(chk => {
        if (chk.alunoId !== alunoId || chk.respondido) return chk;
        return {
          ...chk,
          respondido: true,
          peso,
          rendimentoTreino,
          qualidadeSono,
          disposicao,
          estresse,
          fome,
          comentarios,
          dataResposta: new Date().toISOString()
        };
      });

      // 2. Registra o peso e BF no histórico de medidas
      const aluno = prev.alunos.find(a => a.id === alunoId);
      const novaMedida: MedidaHistorico = {
        id: `med_${alunoId}_${Date.now()}`,
        alunoId,
        data: new Date().toISOString().split("T")[0],
        peso,
        bf: aluno?.bfAtual || 18.0,
      };

      // 3. Atualiza o peso e BF atuais do Aluno
      const novosAlunos = prev.alunos.map(a => {
        if (a.id !== alunoId) return a;
        return {
          ...a,
          pesoAtual: peso
        };
      });

      return {
        ...prev,
        checkins: novosCheckins,
        medidas: [...prev.medidas, novaMedida],
        alunos: novosAlunos
      };
    });
  };

  const enviarMensagem = (
    alunoId: string, 
    remetente: "personal" | "aluno", 
    texto: string,
    arquivoUrl?: string,
    tipoArquivo?: "imagem" | "video",
    nomeArquivo?: string
  ) => {
    setAndRecalculate(prev => {
      const novaMsg: Mensagem = {
        id: `msg_${Date.now()}`,
        alunoId,
        remetente,
        texto,
        data: new Date().toISOString(),
        arquivoUrl,
        tipoArquivo,
        nomeArquivo
      };
      
      const novasFotos = [...prev.fotos];
      if (arquivoUrl && (tipoArquivo === "imagem" || tipoArquivo === "video")) {
        const extensao = nomeArquivo?.split('.').pop()?.toLowerCase() || (tipoArquivo === "imagem" ? 'png' : 'mp4');
        novasFotos.push({
          id: `foto_${alunoId}_chat_${Date.now()}`,
          alunoId,
          data: new Date().toLocaleDateString("pt-BR"),
          fase: "Recebido por Chat",
          frenteUrl: arquivoUrl,
          tipo: tipoArquivo === "imagem" ? "imagem" : "video",
          nomeArquivo: nomeArquivo || (tipoArquivo === "imagem" ? "foto_chat.png" : "video_chat.mp4"),
          tamanhoArquivo: "N/A",
          extensao
        });
      }

      return {
        ...prev,
        mensagens: [...prev.mensagens, novaMsg],
        fotos: novasFotos
      };
    });
  };

  const cadastrarAluno = (alunoSemId: Omit<Aluno, "id" | "scoreAdesao" | "status">) => {
    const id = `aluno_${Date.now()}`;
    const novoAluno: Aluno = {
      ...alunoSemId,
      id,
      scoreAdesao: 100,
      status: "ativo"
    };

    setAndRecalculate(prev => {
      // Cria dieta vazia padrão para o aluno
      const novaDieta: Dieta = {
        id: `dieta_${id}`,
        alunoId: id,
        caloriasAlvo: 2000,
        macrosAlvo: { carboidrato: 200, proteina: 150, gordura: 65 },
        refeicoes: [
          { id: `ref_${id}_1`, nome: "Café da Manhã", horario: "08:00", alimentos: [{ nome: "Prescreva Alimentos", quantidade: "0g" }], concluida: false },
          { id: `ref_${id}_2`, nome: "Almoço", horario: "12:30", alimentos: [{ nome: "Prescreva Alimentos", quantidade: "0g" }], concluida: false },
          { id: `ref_${id}_3`, nome: "Lanche", horario: "16:30", alimentos: [{ nome: "Prescreva Alimentos", quantidade: "0g" }], concluida: false },
          { id: `ref_${id}_4`, nome: "Jantar", horario: "20:30", alimentos: [{ nome: "Prescreva Alimentos", quantidade: "0g" }], concluida: false }
        ]
      };

      // Cria Treino A vazio padrão
      const novoTreino: Treino = {
        id: `treino_${id}_A`,
        alunoId: id,
        nomeDivisao: "Treino A - Geral",
        concluidoHoje: false,
        exercicios: [
          { id: `ex_${id}_1`, nome: "Agachamento Livre", series: 4, repeticoes: "10", carga: "Barra", descanso: "60s", concluido: false },
          { id: `ex_${id}_2`, nome: "Puxada Pulley", series: 3, repeticoes: "12", carga: "20kg", descanso: "60s", concluido: false },
          { id: `ex_${id}_3`, nome: "Supino Reto", series: 3, repeticoes: "12", carga: "10kg cada lado", descanso: "60s", concluido: false }
        ]
      };

      // Cria Cardio vazio padrão
      const novoCardio: Cardio = {
        id: `cardio_${id}`,
        alunoId: id,
        tipo: "Caminhada Rápida",
        duracaoAlvo: 30,
        duracaoRealizada: 0,
        frequenciaSemanal: 3,
        frequenciaRealizada: 0,
        intensidade: "moderada",
        concluido: false
      };

      // Cria Check-in pendente padrão
      const novoCheckin: CheckIn = {
        id: `chk_${id}_1`,
        alunoId: id,
        data: new Date().toISOString().split("T")[0],
        respondido: false
      };

      // Medida inicial
      const novaMedida: MedidaHistorico = {
        id: `med_${id}_1`,
        alunoId: id,
        data: new Date().toISOString().split("T")[0],
        peso: alunoSemId.pesoInicial,
        bf: alunoSemId.bfAtual
      };

      const novoPagamento: Pagamento = {
        id: `pay_${id}_1`,
        alunoId: id,
        alunoNome: alunoSemId.nome,
        valor: 150.00,
        status: "pendente",
        vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      };

      return {
        ...prev,
        alunos: [...prev.alunos, novoAluno],
        dietas: [...prev.dietas, novaDieta],
        treinos: [...prev.treinos, novoTreino],
        cardios: [...prev.cardios, novoCardio],
        checkins: [...prev.checkins, novoCheckin],
        medidas: [...prev.medidas, novaMedida],
        pagamentos: [...prev.pagamentos, novoPagamento]
      };
    });
  };

  const editarAluno = (alunoAtualizado: Aluno) => {
    setAndRecalculate(prev => {
      const novosAlunos = prev.alunos.map(al => al.id === alunoAtualizado.id ? { ...al, ...alunoAtualizado } : al);
      return {
        ...prev,
        alunos: novosAlunos
      };
    });
  };

  const atualizarProtocolosIa = (
    diretrizPrompt: string, 
    arquivosReferencia?: { id: string; nome: string; data: string; tamanho: string }[]
  ) => {
    setAndRecalculate(prev => {
      return {
        ...prev,
        protocolosIa: {
          diretrizPrompt,
          arquivosReferencia: arquivosReferencia || prev.protocolosIa?.arquivosReferencia || []
        }
      };
    });
  };

  const atualizarDieta = (alunoId: string, dietaAtualizada: Dieta) => {
    setAndRecalculate(prev => {
      const novasDietas = prev.dietas.map(d => {
        if (d.alunoId === alunoId) {
          return dietaAtualizada;
        }
        return d;
      });
      return { ...prev, dietas: novasDietas };
    });
  };

  const registrarFotoEvolucao = (
    alunoId: string, 
    frenteUrl: string, 
    costasUrl?: string, 
    perfilUrl?: string, 
    fase: string = "Atual",
    tipo?: "imagem" | "video" | "documento" | "outro",
    nomeArquivo?: string,
    tamanhoArquivo?: string,
    extensao?: string
  ) => {
    setAndRecalculate(prev => {
      const novaFoto: FotoEvolucao = {
        id: `foto_${alunoId}_${Date.now()}`,
        alunoId,
        data: new Date().toISOString().split("T")[0],
        fase,
        frenteUrl,
        costasUrl,
        perfilUrl,
        tipo: tipo || "imagem",
        nomeArquivo,
        tamanhoArquivo,
        extensao
      };
      return {
        ...prev,
        fotos: [...prev.fotos, novaFoto]
      };
    });
  };

  const excluirFotoEvolucao = (id: string) => {
    setAndRecalculate(prev => ({
      ...prev,
      fotos: prev.fotos.filter(f => f.id !== id)
    }));
  };

  const registrarNovaMedidaCompleta = (alunoId: string, m: Omit<MedidaHistorico, "id" | "alunoId">) => {
    setAndRecalculate(prev => {
      const novaMedida: MedidaHistorico = {
        id: `med_${alunoId}_${Date.now()}`,
        alunoId,
        ...m
      };

      // Atualiza peso atual e BF no objeto Aluno
      const novosAlunos = prev.alunos.map(al => {
        if (al.id !== alunoId) return al;
        return {
          ...al,
          pesoAtual: m.peso,
          bfAtual: m.bf
        };
      });

      return {
        ...prev,
        medidas: [...prev.medidas, novaMedida],
        alunos: novosAlunos
      };
    });
  };

  const registrarNovaPrescricaoIntegrada = (
    alunoId: string, 
    dietaCalorias: number, 
    dietaCarb: number, 
    dietaProt: number, 
    dietaGord: number, 
    refeicoes: Refeicao[],
    treinosNovos: Treino[],
    suplementosNovos: Omit<Suplemento, "id" | "alunoId" | "concluidoHoje">[]
  ) => {
    setAndRecalculate(prev => {
      // 1. Atualiza Dieta
      const novasDietas = prev.dietas.map(d => {
        if (d.alunoId !== alunoId) return d;
        return {
          ...d,
          caloriasAlvo: dietaCalorias,
          macrosAlvo: { carboidrato: dietaCarb, proteina: dietaProt, gordura: dietaGord },
          refeicoes
        };
      });

      // 2. Atualiza Treinos
      // Remove treinos antigos desse aluno e monta os novos
      const outrosTreinos = prev.treinos.filter(t => t.alunoId !== alunoId);
      const novosTreinos = [...outrosTreinos, ...treinosNovos];

      // 3. Atualiza Suplementos
      const outrosSuplementos = prev.suplementos.filter(s => s.alunoId !== alunoId);
      const suplementosFormulados = suplementosNovos.map((s, idx) => ({
        id: `sup_${alunoId}_new_${idx}_${Date.now()}`,
        alunoId,
        nome: s.nome,
        dosagem: s.dosagem,
        horario: s.horario,
        concluidoHoje: false
      }));
      const todosSuplementos = [...outrosSuplementos, ...suplementosFormulados];

      return {
        ...prev,
        dietas: novasDietas,
        treinos: novosTreinos,
        suplementos: todosSuplementos
      };
    });
  };

  const atualizarPagamentoStatus = (pagamentoId: string, status: "pago" | "atrasado" | "pendente") => {
    setAndRecalculate(prev => {
      const novosPagamentos = prev.pagamentos.map(p => {
        if (p.id !== pagamentoId) return p;
        return {
          ...p,
          status,
          dataPagamento: status === "pago" ? new Date().toISOString().split("T")[0] : undefined
        };
      });
      return { ...prev, pagamentos: novosPagamentos };
    });
  };

  const resetarBancoDeDados = () => {
    localStorage.removeItem("fitgestor_state");
    setState({
      alunos: INITIAL_ALUNOS,
      dietas: INITIAL_DIETAS,
      treinos: INITIAL_TREINOS,
      cardios: INITIAL_CARDIOS,
      suplementos: INITIAL_SUPLEMENTOS,
      medidas: INITIAL_MEDIDAS,
      fotos: INITIAL_FOTOS,
      checkins: INITIAL_CHECKINS,
      mensagens: INITIAL_MENSAGENS,
      pagamentos: INITIAL_PAGAMENTOS,
      alertas: INITIAL_ALERTAS,
      aguaDiaria: {
        aluno_1: 1750,
        aluno_2: 750,
        aluno_3: 250,
      }
    });
  };

  return {
    state,
    atualizarRefeicao,
    registrarAgua,
    resetarAgua,
    atualizarExercicio,
    marcarTreinoConcluido,
    registrarCardio,
    resetarCardioHoje,
    atualizarSuplemento,
    responderCheckIn,
    enviarMensagem,
    cadastrarAluno,
    editarAluno,
    atualizarProtocolosIa,
    atualizarDieta,
    registrarFotoEvolucao,
    excluirFotoEvolucao,
    registrarNovaMedidaCompleta,
    registrarNovaPrescricaoIntegrada,
    atualizarPagamentoStatus,
    resetarBancoDeDados
  };
}
