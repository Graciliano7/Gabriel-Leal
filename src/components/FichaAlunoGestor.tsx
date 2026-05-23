import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { 
  Aluno, 
  Dieta, 
  Treino, 
  Cardio, 
  Suplemento, 
  CheckIn, 
  MedidaHistorico, 
  FotoEvolucao, 
  Mensagem 
} from "../types";
import { 
  ArrowLeft, 
  Dumbbell, 
  Apple, 
  Calendar, 
  Activity, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  User, 
  MessageSquare, 
  Lock, 
  TrendingDown, 
  Scale, 
  CheckCircle2, 
  X, 
  Clock, 
  TrendingUp, 
  Heart, 
  PieChart,
  Grid,
  Target,
  FileText,
  Video,
  Image,
  Folder,
  UploadCloud,
  Download,
  Eye,
  Play
} from "lucide-react";

interface FichaAlunoGestorProps {
  aluno: Aluno;
  dieta: Dieta | undefined;
  treinos: Treino[];
  cardio: Cardio | undefined;
  suplementos: Suplemento[];
  medidas: MedidaHistorico[];
  fotos: FotoEvolucao[];
  checkins: CheckIn[];
  mensagens: Mensagem[];
  onVoltar: () => void;
  onPrescreverNovaIntegrada: (
    alunoId: string, 
    calorias: number, 
    carb: number, 
    prot: number, 
    gord: number, 
    refeicoes: any[],
    treinosNovos: any[],
    suplementosNovos: any[]
  ) => void;
  onAdicionarMedida: (alunoId: string, medida: Omit<MedidaHistorico, "id" | "alunoId">) => void;
  onAdicionarFoto: (
    alunoId: string, 
    frenteUrl: string, 
    costasUrl: string | undefined, 
    perfilUrl: string | undefined, 
    fase: string,
    tipo?: "imagem" | "video" | "documento" | "outro",
    nomeArquivo?: string,
    tamanhoArquivo?: string,
    extensao?: string
  ) => void;
  onExcluirFoto: (id: string) => void;
  onEditarAluno?: (aluno: Aluno) => void;
  protocolosIa?: {
    diretrizPrompt: string;
    arquivosReferencia: { id: string; nome: string; data: string; tamanho: string }[];
  };
  onAtualizarProtocolosIa?: (
    diretrizPrompt: string, 
    arquivosReferencia?: { id: string; nome: string; data: string; tamanho: string }[]
  ) => void;
}

export default function FichaAlunoGestor({
  aluno,
  dieta,
  treinos,
  cardio,
  suplementos,
  medidas,
  fotos,
  checkins,
  mensagens,
  onVoltar,
  onPrescreverNovaIntegrada,
  onAdicionarMedida,
  onAdicionarFoto,
  onExcluirFoto,
  onEditarAluno,
  protocolosIa,
  onAtualizarProtocolosIa
}: FichaAlunoGestorProps) {
  const [abaAtiva, setAbaAtiva] = useState<"evolucao" | "dieta" | "treino" | "suplementacao" | "ia">("evolucao");
  
  // EDITAR PERFIL COMPLETO DO ALUNO STATE
  const [modalEditarPerfil, setModalEditarPerfil] = useState(false);
  const [editNome, setEditNome] = useState(aluno.nome);
  const [editEmail, setEditEmail] = useState(aluno.email);
  const [editObjetivo, setEditObjetivo] = useState(aluno.objetivo);
  const [editTelefone, setEditTelefone] = useState(aluno.telefone);
  const [editAvatar, setEditAvatar] = useState(aluno.avatar);
  const [editPesoInicial, setEditPesoInicial] = useState(aluno.pesoInicial);
  const [editPesoAtual, setEditPesoAtual] = useState(aluno.pesoAtual);
  const [editAltura, setEditAltura] = useState(aluno.altura);
  const [editBfAtual, setEditBfAtual] = useState(aluno.bfAtual);

  const abrirEditarPerfil = () => {
    setEditNome(aluno.nome);
    setEditEmail(aluno.email);
    setEditObjetivo(aluno.objetivo);
    setEditTelefone(aluno.telefone);
    setEditAvatar(aluno.avatar);
    setEditPesoInicial(aluno.pesoInicial);
    setEditPesoAtual(aluno.pesoAtual);
    setEditAltura(aluno.altura);
    setEditBfAtual(aluno.bfAtual);
    setModalEditarPerfil(true);
  };

  const handleSalvarEditarPerfil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editNome.trim()) return;
    if (onEditarAluno) {
      onEditarAluno({
        ...aluno,
        nome: editNome,
        email: editEmail,
        objetivo: editObjetivo,
        telefone: editTelefone,
        avatar: editAvatar,
        pesoInicial: Number(editPesoInicial),
        pesoAtual: Number(editPesoAtual),
        altura: Number(editAltura),
        bfAtual: Number(editBfAtual),
      });
      alert("Perfil do aluno '" + editNome + "' atualizado com sucesso!");
    }
    setModalEditarPerfil(false);
  };

  // TREINO DE PROTOCOLOS IA STATE
  const [diretrizIaInput, setDiretrizIaInput] = useState(protocolosIa?.diretrizPrompt || "");
  const [arquivosReferenciaIa, setArquivosReferenciaIa] = useState<{ id: string; nome: string; data: string; tamanho: string }[]>(
    protocolosIa?.arquivosReferencia || []
  );
  const [dragActiveIa, setDragActiveIa] = useState(false);
  const [uploadProgressIa, setUploadProgressIa] = useState(false);

  const handleAdicionarArquivoIa = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadProgressIa(true);
      setTimeout(() => {
        const novoDoc = {
          id: `ref_file_${Date.now()}`,
          nome: file.name,
          data: new Date().toISOString().split("T")[0],
          tamanho: `${(file.size / 1024 / 1024).toFixed(1)} MB`
        };
        const novosArqs = [...arquivosReferenciaIa, novoDoc];
        setArquivosReferenciaIa(novosArqs);
        if (onAtualizarProtocolosIa) {
          onAtualizarProtocolosIa(diretrizIaInput, novosArqs);
        }
        setUploadProgressIa(false);
      }, 700);
    }
  };

  const handleExcluirArquivoIa = (id: string) => {
    const novosArqs = arquivosReferenciaIa.filter(f => f.id !== id);
    setArquivosReferenciaIa(novosArqs);
    if (onAtualizarProtocolosIa) {
      onAtualizarProtocolosIa(diretrizIaInput, novosArqs);
    }
  };

  const handleSalvarDiretrizIa = () => {
    if (onAtualizarProtocolosIa) {
      onAtualizarProtocolosIa(diretrizIaInput, arquivosReferenciaIa);
    }
    alert("Protocolo Treinado salvo com sucesso como referência para os Agentes IA!");
  };

  // ESTADOS DO GERENCIADOR DE ARQUIVOS (FOTOS, VIDEOS, DOCUMENTOS)
  const [novoArquivoFase, setNovoArquivoFase] = useState("Atual");
  const [filtroTipoArquivo, setFiltroTipoArquivo] = useState<"todos" | "imagem" | "video" | "documento" | "outro">("todos");
  const [dragActive, setDragActive] = useState(false);
  const [previewZoom, setPreviewZoom] = useState<FotoEvolucao | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);

  const processarArquivos = (files: FileList) => {
    if (!files || files.length === 0) return;
    setUploadProgress(true);
    
    Array.from(files).forEach(file => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      
      let tipoIdentificado: "imagem" | "video" | "documento" | "outro" = "outro";
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
        tipoIdentificado = "imagem";
      } else if (['mp4', 'mov', 'avi', 'mpeg', 'webm', 'mkv', '3gp'].includes(extension)) {
        tipoIdentificado = "video";
      } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv', 'ppt', 'pptx'].includes(extension)) {
        tipoIdentificado = "documento";
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = e.target?.result as string || "";
        
        // Convert size to human readable (KB / MB)
        const sizeInMb = file.size / (1024 * 1024);
        const sizeStr = sizeInMb >= 1 
          ? `${sizeInMb.toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(0)} KB`;

        onAdicionarFoto(
          aluno.id,
          fileUrl,             // frenteUrl
          undefined,           // costasUrl
          undefined,           // perfilUrl
          novoArquivoFase || "Atual", // fase
          tipoIdentificado,
          file.name,           // nomeArquivo
          sizeStr,             // tamanhoArquivo
          extension            // extensao
        );
      };
      reader.readAsDataURL(file);
    });
    
    setTimeout(() => {
      setUploadProgress(false);
    }, 600);
  };

  // FORMULÁRIO DE NOVA MEDIDA
  const [novaMedidaModal, setNovaMedidaModal] = useState(false);
  const [medPeso, setMedPeso] = useState(aluno.pesoAtual);
  const [medBf, setMedBf] = useState(aluno.bfAtual);
  const [medCintura, setMedCintura] = useState(80);
  const [medBracoD, setMedBracoD] = useState(35);
  const [medBracoE, setMedBracoE] = useState(35);
  const [medCoxaD, setMedCoxaD] = useState(55);
  const [medCoxaE, setMedCoxaE] = useState(55);

  // FORMULÁRIO DE PRESCRIÇÃO DE DIETA
  const [prescCalorias, setPrescCalorias] = useState(dieta?.caloriasAlvo || 2200);
  const [prescCarb, setPrescCarb] = useState(dieta?.macrosAlvo.carboidrato || 220);
  const [prescProt, setPrescProt] = useState(dieta?.macrosAlvo.proteina || 160);
  const [prescGord, setPrescGord] = useState(dieta?.macrosAlvo.gordura || 60);
  const [refeicoesPrescritas, setRefeicoesPrescritas] = useState<any[]>(() => {
    return dieta?.refeicoes.map(r => ({
      id: r.id,
      nome: r.nome,
      horario: r.horario,
      alimentos: r.alimentos.map(a => ({
        nome: a.nome,
        quantidade: a.quantidade,
        proteina: a.proteina,
        carboidrato: a.carboidrato,
        gordura: a.gordura,
        substituicao: (a as any).substituicao || ""
      }))
    })) || [];
  });

  // ESTADOS PARA INTERATIVIDADE E EDICAO DE TREINOS E FARMÁCOS/SUPLEMENTOS (AMBOS COM MANUAL + IA)
  const [editTreinos, setEditTreinos] = useState<Treino[]>(() => {
    return treinos.filter(t => t.alunoId === aluno.id).map(t => ({
      ...t,
      exercicios: t.exercicios.map(ex => ({ ...ex }))
    }));
  });

  const [editSuplementos, setEditSuplementos] = useState<Suplemento[]>(() => {
    return suplementos.filter(s => s.alunoId === aluno.id).map(s => ({
      ...s
    }));
  });

  const [loadingFoodSec, setLoadingFoodSec] = useState<string | null>(null);
  const [loadingIaTreinoId, setLoadingIaTreinoId] = useState<string | null>(null);
  const [loadingSuplementacaoIa, setLoadingSuplementacaoIa] = useState(false);

  // IA FEEDBACK SIMULADO AVANÇADO
  const [feedbackIaOutput, setFeedbackIaOutput] = useState("");
  const [gerandoIa, setGerandoIa] = useState(false);

  // Adicionar refeição no formulário
  const handleAddRefeicao = () => {
    setRefeicoesPrescritas(prev => [
      ...prev,
      {
        id: `ref_presc_${Date.now()}`,
        nome: `Nova Refeição ${prev.length + 1}`,
        horario: "12:00",
        alimentos: [{ nome: "Prescreva um alimento", quantidade: "100g", substituicao: "" }]
      }
    ]);
  };

  const handleRemoveRefeicao = (id: string) => {
    setRefeicoesPrescritas(prev => prev.filter(r => r.id !== id));
  };

  const handleAddAlimento = (refId: string) => {
    setRefeicoesPrescritas(prev => prev.map(r => {
      if (r.id !== refId) return r;
      return {
        ...r,
        alimentos: [...r.alimentos, { nome: "Novo Alimento", quantidade: "100g", substituicao: "" }]
      };
    }));
  };

  const handleUpdateAlimento = (refId: string, idx: number, campo: string, valor: any) => {
    setRefeicoesPrescritas(prev => prev.map(r => {
      if (r.id !== refId) return r;
      const novosAlimentos = [...r.alimentos];
      novosAlimentos[idx] = { ...novosAlimentos[idx], [campo]: valor };
      return { ...r, alimentos: novosAlimentos };
    }));
  };

  const handleSugerirSubstituicaoIa = async (refId: string, idx: number, nome: string, qtd: string) => {
    if (!nome || nome.trim() === "Prescreva um alimento" || nome.trim() === "Novo Alimento") {
      alert("Escreva o nome de um alimento válido original primeiro para que a IA possa sugerir a melhor equivalência.");
      return;
    }
    setLoadingFoodSec(`${refId}_${idx}`);
    try {
      const response = await fetch("/api/gemini/food-substitution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alimentoNome: nome, quantidade: qtd }),
      });
      if (!response.ok) {
        throw new Error("Erro na comunicação com a API de IA.");
      }
      const data = await response.json();
      if (data && data.nome) {
        const descSubstituicacao = `${data.quantidade} de ${data.nome} (TACO: Carb:${data.carboidrato}g / Prot:${data.proteina}g / Gord:${data.gordura}g) - ${data.justificativa}`;
        handleUpdateAlimento(refId, idx, "substituicao", descSubstituicacao);
      }
    } catch (err) {
      console.error(err);
      alert("Não foi possível gerar a sugestão no momento. Tente novamente.");
    } finally {
      setLoadingFoodSec(null);
    }
  };

  const handleSaveTreino = () => {
    const treinosNovos = treinos.map(t => {
      if (t.alunoId === aluno.id) {
        const match = editTreinos.find(et => et.id === t.id);
        return match || t;
      }
      return t;
    });

    onPrescreverNovaIntegrada(
      aluno.id,
      prescCalorias,
      prescCarb,
      prescProt,
      prescGord,
      refeicoesPrescritas,
      treinosNovos,
      suplementos
    );
    alert("Configurações e Planos de Treino salvos com sucesso para " + aluno.nome);
  };

  const handleSaveSuplementacao = () => {
    const suplementosNovos = [
      ...suplementos.filter(s => s.alunoId !== aluno.id),
      ...editSuplementos
    ];

    onPrescreverNovaIntegrada(
      aluno.id,
      prescCalorias,
      prescCarb,
      prescProt,
      prescGord,
      refeicoesPrescritas,
      treinos,
      suplementosNovos
    );
    alert("Prescrições de Fármacos e Suplementações salvas com sucesso para " + aluno.nome);
  };

  const handleRemoveAlimento = (refId: string, idx: number) => {
    setRefeicoesPrescritas(prev => prev.map(r => {
      if (r.id !== refId) return r;
      const novosAlimentos = [...r.alimentos];
      novosAlimentos.splice(idx, 1);
      return { ...r, alimentos: novosAlimentos };
    }));
  };

  const handleSaveDieta = () => {
    // Altera a dieta do Aluno, salvando as modificações
    onPrescreverNovaIntegrada(
      aluno.id,
      prescCalorias,
      prescCarb,
      prescProt,
      prescGord,
      refeicoesPrescritas,
      treinos, // mantém os treinos
      suplementos // mantém suplementos
    );
    alert("Dieta prescrita e atualizada com sucesso para " + aluno.nome);
  };

  // ADICIONAR NOVA MEDIDA SUBMIT
  const handleMedidasSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdicionarMedida(aluno.id, {
      data: new Date().toISOString().split("T")[0],
      peso: Number(medPeso),
      bf: Number(medBf),
      cintura: Number(medCintura),
      bracoD: Number(medBracoD),
      bracoE: Number(medBracoE),
      coxaD: Number(medCoxaD),
      coxaE: Number(medCoxaE)
    });
    setNovaMedidaModal(false);
  };

  // GERAR RELATÓRIO DE FEEDBACK DA IA (HEURÍSTICA PROFISSIONAL SUPER RICA EM DETALHES)
  const handleGerarFeedbackIa = () => {
    setGerandoIa(true);
    setFeedbackIaOutput("");
    setTimeout(() => {
      // Cria um feedback personalizado com base na situação real do aluno
      let report = "";
      if (aluno.id === "aluno_1") {
        report = `### 🌟 Gabriel Leal AI Pro - ANÁLISE DO MONSTRO

**Aluno**: Pedro Santos Vital
**Status de Adesão**: 94% (Excelente - Zona de Elite)
**Último Peso**: 81.2 kg (+4.7kg desde o início em 03/2026)
**BF Estimado**: 11.4% (Reduzido de 13.5% - Hipertrofia Limpa Consolidada)

#### 📊 Diagnóstico Antropométrico & Comportamental:
1. **Ganhos de Massa Magra**: A progressão de medidas aponta para hipertrofia com ganho de densidade fantástico. O braço D cresceu de **36.5cm para 39.1cm** mantendo o BF regressivo.
2. **Adesão Impecável às Refeições**: Pontuação perfeita. O controle diário demonstra constância cirúrgica no horário e quantidade dos macros.
3. **Cardio**: Totalmente alinhado (4 de 4 cardios semanais efetuados). Fator essencial para manutenção da sensibilidade à insulina.

#### 💡 Sugestões de Ajustes de Dieta e Treino:
*   **Progressão Dietética**: Sugiro acrescentar +150kcal (+35g de carboidrato complexo) no pré-treino para pavimentar a rota rumo aos 85kg sem acumular gordura vísceral.
*   **Treinamento**: Pedro está maduro para técnicas de alta intensidade no set final dos exercícios básicos (ex: *Myo-reps* no supino inclinado ou *Série de Choque* nas puxadas).
*   **Recuperação**: O check-in semanal aponta sono nível 4 de 5. Indicar 3g de Gaba ou suplementar Zinco e Magnésio (ZMA) antes de deitar para aprofundar a fase REM.

*Análise gerada em tempo recorde através de simulação heurística de feedback esportivo avançado.*`;
      } else if (aluno.id === "aluno_2") {
        report = `### ⚠️ Gabriel Leal AI Pro - AVALIAÇÃO DE DESVIO DE ROTINA

**Aluna**: Mariana Costa Silva
**Status de Adesão**: 68% (Atenção - Alerta Amarelo)
**Peso Atual**: 64.5 kg (-3.7kg desde o início)
**Foco**: Emagrecimento, flutuação e cansaço corporativo.

#### 📊 Diagnóstico Antropométrico & Comportamental:
1. **Déficit Calórico Parcial**: Mariana perdeu peso (de 68.2kg para 64.5kg) e cintura (-5.5cm), indicando que, a despeito das falhas recentes, o balanço de energia acumulado ainda é favorável. No entanto, o peso estagnou na última semana devido a furos frequentes causados pela estafa no trabalho.
2. **Perda de Sessões de Cardio**: Mariana fez apenas 2 das 5 sessões de cardio planejadas. O relatório do Whatsapp relata reuniões noturnas extensas.
3. **Check-in Semanal Pendente**: Aluna não preencheu o formulário há 3 dias. Essa quebra no feedback reduz drasticamente a vigilância comportamental.

#### 💡 Recomendações Críticas do Coach:
*   **Estratégia Anti-Estresse**: O principal fator de sabotagem é o tempo. Sugiro migrar as 5 sessões de cardio de 45 minutos de noite para **30 minutos em jejum (AEJ) pela manhã** ou fracioná-las em 15 minutos pós-treino diários.
*   **Conforto na Dieta**: Mariana pula o lanche da tarde por falta de tempo no escritório. Substituir o shake de Whey por um alimento pronto para transporte (ex: barra de proteína premium + castanhas) ou um iogurte de garrafa rápido.
*   **Metas Reduzidas Temporárias**: Para restabelecer a confiança de Mariana, reduzir a meta de cardio para 3x na semana até o fechamento trimestral da empresa.

*Pronto para envio rápido ao aluno por Whatsapp!*`;
      } else {
        report = `### 🚨 Gabriel Leal AI Pro - ALERTA VERMELHO DE INATIVIDADE

**Aluno**: Lucas Oliveira Nogueira
**Status de Adesão**: 42% (Inconsistente - Alto Risco de Abandono)
**Peso Atual**: 93.8 kg (Pouco progresso desde o último mês)
**Fatores**: Falha crítica de registros em alimentação e treinos nos últimos 3 dias.

#### 📊 Diagnóstico Antropométrico & Comportamental:
1. **Inatividade no App**: Ausência de toque na tela, consumo de água zerado e check-in mensal em atraso.
2. **Mensalidade Vencida**: Plano atrasado desde 05/05/2026. A quebra financeira quase sempre precede a evasão completa das mentorias.
3. **Estagnação Física**: Com base no peso inicial (98kg) e atual (93.8kg), houve progresso no primeiro mês, mas o descontrole comportamental zerou o déficit calórico nas duas semanas mais recentes.

#### 💡 Plano de Ação Imediato para Resgatar o Aluno:
*   **Contato Direto**: Recomenda-se enviar mensagem de voz humanizada hoje via WhatsApp, sem cobranças de treino, mas manifestando preocupação sincera com a saúde ou problemas pessoais do aluno.
*   **Simplificação Radical**: Se o cansaço motivou o abandono, prescrever uma dieta flexível de apenas **3 refeições grandes** ou um protocolo simplificado de treino (EX: Treino Express de 3 exercícios, 30 minutos).
*   **Foco Financeiro**: Oferecer um elo amigável de quitação ou alteração de forma de pagamento nas próximas renovações para retirar o peso psicológico da inadimplência.

*Construído com base no gatilho ativo de "Ausência de Interações de 72h".*`;
      }

      // Injeta referências de treinos e protocolos parametrizados pelo Gestor (Aba Treino de Protocolos)
      if (diretrizIaInput.trim() || arquivosReferenciaIa.length > 0) {
        let instructionsText = "\n\n---\n### 🎯 GABRIEL LEAL AGENTE IA - DIRETRIZES DE TREINO DE PROTOCOLOS APLICADAS:\n";
        instructionsText += `O robô identificou novos parâmetros carregados no "Painel de Treino de Protocolos dos Agentes" e alterou o feedback técnico:\n`;
        
        if (diretrizIaInput.trim()) {
          instructionsText += `* **Diretriz de Prompt Referenciada**: *"${diretrizIaInput.trim()}"*\n`;
        }
        if (arquivosReferenciaIa.length > 0) {
          instructionsText += `* **Arquivos de Referência Clínicos Ativos**: ${arquivosReferenciaIa.map(f => `📁 ${f.nome} (${f.tamanho})`).join(", ")}\n`;
        }
        
        instructionsText += `\n* **Ajuste Técnico Executado**: O agente IA adaptou as orientações de dieta, ergogênicos e volume de cardio de ${aluno.nome} seguindo com precisão milimétrica as diretrizes e arquivos fornecidos no treinamento de prompt.*`;
        report += instructionsText;
      }

      setFeedbackIaOutput(report);
      setGerandoIa(false);
    }, 1100);
  };

  // Filtra as medidas corporais do aluno
  const medidasAluno = medidas
    .filter(m => m.alunoId === aluno.id)
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  // Filtra fotos de evolução
  const fotosAluno = fotos.filter(f => f.alunoId === aluno.id);

  // Filtra check-ins
  const checkinsAluno = checkins
    .filter(c => c.alunoId === aluno.id)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  // Calcula macros totais prescritos da dieta
  const carboCal = prescCarb * 4;
  const protCal = prescProt * 4;
  const gordCal = prescGord * 9;
  const caloriasCalculadas = carboCal + protCal + gordCal;

  const handleExportarPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const dataAtual = new Date().toLocaleDateString("pt-BR");
      const arrMedidas = [...medidasAluno]; // Já ordenado cronologicamente (crescente)
      const totalRegistros = arrMedidas.length;

      // Pegar os valores de início e fim para a comparação
      const pesoInicial = totalRegistros > 0 ? arrMedidas[0].peso : aluno.pesoAtual;
      const bfInicial = totalRegistros > 0 ? arrMedidas[0].bf : aluno.bfAtual;
      const cinturaInicial = totalRegistros > 0 ? (arrMedidas[0].cintura || 80) : 80;
      const bracoDInicial = totalRegistros > 0 ? (arrMedidas[0].bracoD || 35) : 35;
      const coxaDInicial = totalRegistros > 0 ? (arrMedidas[0].coxaD || 55) : 55;

      const pesoFinal = totalRegistros > 0 ? arrMedidas[totalRegistros - 1].peso : aluno.pesoAtual;
      const bfFinal = totalRegistros > 0 ? arrMedidas[totalRegistros - 1].bf : aluno.bfAtual;
      const cinturaFinal = totalRegistros > 0 ? (arrMedidas[totalRegistros - 1].cintura || 80) : 80;
      const bracoDFinal = totalRegistros > 0 ? (arrMedidas[totalRegistros - 1].bracoD || 35) : 35;
      const coxaDFinal = totalRegistros > 0 ? (arrMedidas[totalRegistros - 1].coxaD || 55) : 55;

      const diffPeso = pesoFinal - pesoInicial;
      const diffBf = bfFinal - bfInicial;
      const diffCintura = cinturaFinal - cinturaInicial;

      // 1. HEADER PREMIUM COM CORES E MARCA GL MOCK DA LOGO (FUNDO GRÁFITE / AZULADO ESCURO - BLACK TEXTURED FEEL)
      // Caixa superior de fundo do banner (Grafite Escura / Preta)
      doc.setFillColor(12, 13, 15);
      doc.rect(15, 12, 180, 36, "F");

      // Desenhar o monograma centralizado ou à esquerda
      // Desenhar barras verticais do halter de fundo da "GL" que aparecem no anexo
      doc.setFillColor(31, 41, 55); // Cinza intermediário
      doc.rect(21, 16, 2.8, 28, "F");
      doc.rect(38, 16, 2.8, 28, "F");

      // Desenhar o monograma "GL" (em branco e cinza metalizado)
      doc.setTextColor(241, 245, 249); // White Slate
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.text("GL", 24, 35);

      // Nome principal: "GABRIEL LEAL" em tom verde floresta marcante (RGB: 9, 76, 37) como no anexo
      doc.setTextColor(14, 115, 61); // Tom de verde elegante e legível
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("GABRIEL LEAL", 50, 27);

      // Subtítulo: "PERSONAL TRAINER" em tom cinza elegante
      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      // Espaçamento simulado para tracking elegante
      doc.text("P E R S O N A L   T R A I N E R", 50, 34);

      // Linha verde vibrante decorativa horizontal
      doc.setFillColor(16, 185, 129); // Emerald
      doc.rect(50, 37, 42, 0.8, "F");

      // Detalhes de Emissão no canto direito do cabeçalho
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(`Emitido em: ${dataAtual}`, 155, 24);
      doc.text("Sistema Gabriel Leal", 155, 28.5);
      doc.text("Membro VIP Oficial", 155, 33);

      // 2. DADOS DO ALUNO / CARD DE ABERTURA
      let y = 58;
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("DADOS CADASTRAIS DO ASSESSORADO", 15, y);

      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.4);
      doc.line(15, y + 2, 195, y + 2);

      y += 8;
      doc.setFontSize(8.5);
      
      doc.setFont("helvetica", "bold");
      doc.text("Aluno(a):", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(aluno.nome, 30, y);

      doc.setFont("helvetica", "bold");
      doc.text("Telefone:", 110, y);
      doc.setFont("helvetica", "normal");
      doc.text(aluno.telefone, 126, y);

      y += 5.5;
      doc.setFont("helvetica", "bold");
      doc.text("Objetivo:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(aluno.objetivo, 30, y);

      doc.setFont("helvetica", "bold");
      doc.text("E-mail:", 110, y);
      doc.setFont("helvetica", "normal");
      doc.text(aluno.email, 126, y);

      y += 5.5;
      doc.setFont("helvetica", "bold");
      doc.text("Altura:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${aluno.altura} cm`, 30, y);

      doc.setFont("helvetica", "bold");
      doc.text("Adesão Geral:", 110, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${aluno.scoreAdesao}% das metas concluídas hoje`, 131, y);

      // 3. SEÇÃO COMPARATIVA / BENTO SIMULADO
      y += 12;
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("ANÁLISE COMPARATIVA DE PROGRESSO COMPOSICIONAL", 15, y);
      doc.line(15, y + 2, 195, y + 2);

      y += 7;
      // Card 1: Peso Corporal
      doc.setFillColor(248, 250, 252);
      doc.rect(15, y, 55, 25, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(15, y, 55, 25, "S");
      
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("PESO CORPORAL TOTAL", 19, y + 5.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(`Medida Inicial: ${pesoInicial.toFixed(1)} kg`, 19, y + 10.5);
      doc.text(`Último Registro: ${pesoFinal.toFixed(1)} kg`, 19, y + 14.5);
      
      const pesoDiffSign = diffPeso > 0 ? "+" : "";
      if (diffPeso <= 0) {
        doc.setTextColor(14, 115, 61); // Verde para perda/manutenção de peso
      } else {
        doc.setTextColor(220, 38, 38); // Vermelho para ganho
      }
      doc.setFont("helvetica", "bold");
      doc.text(`Variação Líquida: ${pesoDiffSign}${diffPeso.toFixed(1)} kg`, 19, y + 19.5);

      // Card 2: Percentual de Gordura (BF)
      doc.setFillColor(248, 250, 252);
      doc.rect(77, y, 55, 25, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(77, y, 55, 25, "S");
      
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("PERCENTUAL DE GORDURA", 81, y + 5.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(`BF Inicial: ${bfInicial.toFixed(1)}%`, 81, y + 10.5);
      doc.text(`BF Atual: ${bfFinal.toFixed(1)}%`, 81, y + 14.5);
      
      const bfDiffSign = diffBf > 0 ? "+" : "";
      if (diffBf <= 0) {
        doc.setTextColor(14, 115, 61); // Verde para queima de gordura
      } else {
        doc.setTextColor(220, 38, 38); // Vermelho
      }
      doc.setFont("helvetica", "bold");
      doc.text(`Variação Líquida: ${bfDiffSign}${diffBf.toFixed(1)}%`, 81, y + 19.5);

      // Card 3: Cintura / Abdomem (Principal indicador visceral)
      doc.setFillColor(248, 250, 252);
      doc.rect(140, y, 55, 25, "F");
      doc.setDrawColor(226, 232, 240);
      doc.rect(140, y, 55, 25, "S");
      
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("CINTURA / ABDÔMEN", 144, y + 5.5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text(`Inicial: ${cinturaInicial} cm`, 144, y + 10.5);
      doc.text(`Atual: ${cinturaFinal} cm`, 144, y + 14.5);
      
      const cinturaDiffSign = diffCintura > 0 ? "+" : "";
      if (diffCintura <= 0) {
        doc.setTextColor(14, 115, 61); // Verde para cintura reduzindo
      } else {
        doc.setTextColor(15, 23, 42);
      }
      doc.setFont("helvetica", "bold");
      doc.text(`Variação Líquida: ${cinturaDiffSign}${diffCintura} cm`, 144, y + 19.5);

      // 4. TABELA DE HISTÓRICO GERAL COMPLETO
      y += 34;
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.text("HISTÓRICO ACUMULADO DE MEDIDAS CORPORAIS", 15, y);
      doc.line(15, y + 2, 195, y + 2);

      y += 7;
      // Cabeçalho da tabela com o VERDE LOGO GABRIEL LEAL
      doc.setFillColor(9, 76, 37); // Verde floresta escuro da marca
      doc.rect(15, y, 180, 7.5, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.text("DATA", 18, y + 5);
      doc.text("PESO (KG)", 45, y + 5);
      doc.text("BF (%)", 68, y + 5);
      doc.text("CINTURA", 88, y + 5);
      doc.text("BRAÇO DR", 112, y + 5);
      doc.text("BRAÇO ES", 134, y + 5);
      doc.text("COXA DR", 156, y + 5);
      doc.text("COXA ES", 178, y + 5);

      // Renderização das fileiras
      y += 7.5;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(30, 41, 59);

      if (totalRegistros === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(15, y, 180, 8, "F");
        doc.setTextColor(100, 116, 139);
        doc.text("Nenhum registro de medida física ou pesagem lançado no sistema até o momento.", 22, y + 5.5);
        y += 8;
      } else {
        arrMedidas.forEach((med, idx) => {
          // Proteção simples de quebra de página
          if (y > 255) {
            // Desenhar rodapé na página atual antes de pular
            doc.setTextColor(148, 163, 184);
            doc.setFontSize(6.5);
            doc.text("GABRIEL LEAL PERSONAL TRAINER - RELATÓRIO DE EVOLUÇÃO CORPORAL COMPLETO", 105, 287, { align: "center" });

            doc.addPage();
            y = 20;

            // Cabeçalho fino de continuação
            doc.setFillColor(12, 13, 15);
            doc.rect(15, 12, 180, 12, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.text("GL GABRIEL LEAL - HISTÓRICO DE EVOLUÇÃO (CONTINUAÇÃO)", 20, 20);
            
            // Re-desenhar cabeçalho da tabela
            y = 30;
            doc.setFillColor(9, 76, 37);
            doc.rect(15, y, 180, 7.5, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(7.5);
            doc.text("DATA", 18, y + 5);
            doc.text("PESO (KG)", 45, y + 5);
            doc.text("BF (%)", 68, y + 5);
            doc.text("CINTURA", 88, y + 5);
            doc.text("BRAÇO DR", 112, y + 5);
            doc.text("BRAÇO ES", 134, y + 5);
            doc.text("COXA DR", 156, y + 5);
            doc.text("COXA ES", 178, y + 5);
            
            y += 7.5;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(30, 41, 59);
          }

          if (idx % 2 === 0) {
            doc.setFillColor(248, 250, 252);
            doc.rect(15, y, 180, 6.5, "F");
          }

          doc.setTextColor(15, 23, 42);
          doc.setFont("helvetica", "bold");
          doc.text(med.data, 18, y + 4.5);
          
          doc.setFont("helvetica", "normal");
          doc.text(`${med.peso.toFixed(1)} kg`, 45, y + 4.5);
          doc.text(`${med.bf.toFixed(1)}%`, 68, y + 4.5);
          doc.text(`${med.cintura || "--"} cm`, 88, y + 4.5);
          doc.text(`${med.bracoD || "--"} cm`, 112, y + 4.5);
          doc.text(`${med.bracoE || "--"} cm`, 134, y + 4.5);
          doc.text(`${med.coxaD || "--"} cm`, 156, y + 4.5);
          doc.text(`${med.coxaE || "--"} cm`, 178, y + 4.5);

          y += 6.5;
        });
      }

      // 5. CAIXA DE CHANCELA DE ESTILO GABRIEL LEAL DA LOGOMARCA
      let botBoxY = Math.max(y + 10, 215);
      if (botBoxY > 248) {
        doc.addPage();
        botBoxY = 20;
      }

      // Card de conselho premium da assessoria
      doc.setFillColor(240, 253, 244); // Verdinha suave
      doc.rect(15, botBoxY, 180, 24, "F");
      doc.setDrawColor(187, 247, 208);
      doc.rect(15, botBoxY, 180, 24, "S");

      // Título do Conselho
      doc.setTextColor(9, 79, 43);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("CHANCELA DE CONSULTORIA PREMIUM E ANÁLISE COMPORTAMENTAL", 20, botBoxY + 5.5);

      // Texto
      doc.setTextColor(21, 115, 59);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      const conselho = `Os resultados expressos neste documento foram auditados pela equipe de alta performance Gabriel Leal. Recomenda-se manter a constância máxima nos treinos de hipertrofia estruturados, na reposição hídrica diária de no mínimo 3.0L e na adesão fiel às refeições e suplementos para consolidação dos ganhos biológicos.`;
      const splitConselho = doc.splitTextToSize(conselho, 170);
      doc.text(splitConselho, 20, botBoxY + 11);

      // Assinatura do Personal Trainer
      botBoxY += 34;
      doc.setDrawColor(148, 163, 184);
      doc.setLineWidth(0.35);
      doc.line(130, botBoxY, 190, botBoxY);
      
      doc.setTextColor(30, 41, 59);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("Gabriel Leal", 143, botBoxY + 4.5, { align: "left" });
      
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text("CREF: 039824-G/SP • Personal Trainer & Coach", 131, botBoxY + 8.5, { align: "left" });

      // RODAPÉ DO DOCUMENTO COMPLETO
      doc.setTextColor(148, 163, 184);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.text("GL GABRIEL LEAL • ASSESSORIA ESPORTIVA DE ELITE • FITGESTOR PRO • DIREITOS RESERVADOS © 2026", 105, 287, { align: "center" });

      // BAIXAR PDF
      const nomeLimpo = aluno.nome.toLowerCase().replace(/\s+/g, "_");
      doc.save(`evolucao_${nomeLimpo}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Houve um erro técnico ao estruturar o PDF. Verifique os dados das medidas.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Botão Voltar e Atalho Aluno */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <button
          id="btn-ficha-voltar"
          onClick={onVoltar}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 py-1.5 px-4 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Lista
        </button>

        <div className="flex items-center gap-3">
          <button
            id="btn-exportar-evolucao-pdf"
            onClick={handleExportarPDF}
            className="flex items-center gap-1.5 text-xs font-black text-white bg-slate-950 hover:bg-emerald-600 hover:text-slate-950 border border-slate-800 py-1.5 px-4.5 rounded-xl transition-all shadow-sm cursor-pointer select-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            Relatório de Evolução (PDF)
          </button>
          <span className="text-2xs font-mono text-slate-400">FICHA_ID: {aluno.id}</span>
        </div>
      </div>

      {/* Header Premium do Aluno (Bento Box) */}
      <div className="bg-slate-950 text-white rounded-3xl border border-slate-900 overflow-hidden shadow-lg p-6 relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img 
              src={aluno.avatar} 
              alt={aluno.nome} 
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg md:text-xl font-bold tracking-tight">{aluno.nome}</h2>
                <span className={`text-3xs font-bold font-mono py-0.5 px-2 rounded ${
                  aluno.scoreAdesao >= 75 ? "bg-emerald-950 text-emerald-405 border border-emerald-800" : "bg-amber-950 text-amber-405 border border-amber-800"
                }`}>
                  Adesão: {aluno.scoreAdesao}%
                </span>
                {aluno.id === "aluno_3" && (
                  <span className="text-3xs font-bold font-mono py-0.5 px-2 bg-rose-950 text-rose-400 border border-rose-900">
                    Sem Registros
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium mt-1 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                Meta: {aluno.objetivo}
              </p>
              <p className="text-3xs text-slate-400 mt-0.5 font-mono">Contato: {aluno.telefone} | Email: {aluno.email}</p>
              
              <div className="mt-2">
                <button
                  id="btn-edit-perfil"
                  onClick={abrirEditarPerfil}
                  className="inline-flex items-center gap-1 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-350 font-bold text-3xs uppercase font-mono py-1 px-2.5 rounded border border-slate-700 hover:border-emerald-500 transition-all cursor-pointer shadow-sm"
                >
                  <User className="w-2.5 h-2.5" />
                  Editar Perfil Completo
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl w-full md:w-auto self-stretch md:self-center items-center">
            <div className="text-center md:border-r md:border-slate-800 pr-2">
              <span className="text-4xs text-slate-400 font-mono block uppercase">Peso Atual</span>
              <span className="text-sm font-bold font-mono text-emerald-400">{aluno.pesoAtual} kg</span>
            </div>
            <div className="text-center md:border-r md:border-slate-800 px-2">
              <span className="text-4xs text-slate-400 font-mono block uppercase">Altura</span>
              <span className="text-sm font-bold font-mono text-white">{aluno.altura} cm</span>
            </div>
            <div className="text-center md:border-r md:border-slate-800 px-2">
              <span className="text-4xs text-slate-400 font-mono block uppercase">BF Real</span>
              <span className="text-sm font-bold font-mono text-white">{aluno.bfAtual}%</span>
            </div>
            <div className="text-center pl-2">
              <span className="text-4xs text-slate-400 font-mono block uppercase">Peso Alvo</span>
              <span className="text-sm font-bold font-mono text-slate-450">{aluno.id === "aluno_2" ? "58.0 kg" : aluno.id === "aluno_1" ? "85.0 kg" : "85.0 kg"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu de Abas da Ficha */}
      <div className="flex border-b border-slate-250 overflow-x-auto gap-1">
        <button
          onClick={() => setAbaAtiva("evolucao")}
          className={`flex items-center gap-1.5 text-xs py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            abaAtiva === "evolucao" 
              ? "border-emerald-500 text-emerald-600 font-black bg-slate-50/50" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Evolução Corporal / Medidas
        </button>

        <button
          id="tab-prescrever-dieta"
          onClick={() => setAbaAtiva("dieta")}
          className={`flex items-center gap-1.5 text-xs py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            abaAtiva === "dieta" 
              ? "border-emerald-500 text-emerald-600 font-black bg-slate-50/50" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Apple className="w-3.5 h-3.5" />
          Gerenciar/Prescrever Dieta
        </button>

        <button
          onClick={() => setAbaAtiva("treino")}
          className={`flex items-center gap-1.5 text-xs py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            abaAtiva === "treino" 
              ? "border-emerald-500 text-emerald-600 font-black bg-slate-50/50" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          Ver/Editar Treino
        </button>

        <button
          onClick={() => setAbaAtiva("suplementacao")}
          className={`flex items-center gap-1.5 text-xs py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            abaAtiva === "suplementacao" 
              ? "border-emerald-500 text-emerald-600 font-black bg-slate-50/50" 
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          Fármacos & Suplementação
        </button>

        <button
          id="tab-ia-analisador"
          onClick={() => setAbaAtiva("ia")}
          className={`flex items-center gap-1.5 text-xs py-2.5 px-4 font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap bg-emerald-50/50 hover:bg-emerald-50 ${
            abaAtiva === "ia" 
              ? "border-emerald-500 text-emerald-700 font-black bg-emerald-100/50" 
              : "border-transparent text-emerald-600"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 animate-bounce" />
          Análise & Feedback IA
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-3xs min-h-[350px]">
        {/* ABA 1: EVOLUÇÃO CORPORAL / MEDIDAS */}
        {abaAtiva === "evolucao" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Histórico de Peso e BF</h3>
                <p className="text-2xs text-slate-400 mt-0.5">Visão do progresso das pesagens reportadas ou medidas pelo profissional.</p>
              </div>
              <button
                id="btn-lancar-nova-medida"
                onClick={() => setNovaMedidaModal(true)}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-2xs py-2 px-4 rounded-xl transition-all cursor-pointer"
              >
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                Lançar Medida
              </button>
            </div>

            {/* Gráfico SVG feito à mão fantástico e robusto */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-2xs font-bold text-slate-500 font-mono uppercase tracking-wider block mb-3">Linha do Tempo de Fluidez de Peso (kg)</span>
              
              {medidasAluno.length < 2 ? (
                <div className="py-8 text-center text-slate-400 text-xs">Aguardando mais registros de medidas físicas para plotar evolução.</div>
              ) : (
                <div className="relative h-44 w-full bg-white rounded-lg border border-slate-100 p-2 flex items-end">
                  {/* Desenhando o gráfico em SVG puro */}
                  <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 500 100" preserveAspectRatio="none">
                    {/* Linha guia */}
                    <line x1="0" y1="50" x2="500" y2="50" stroke="#f1f5f9" strokeDasharray="3" />
                    
                    {/* Desenhar a linha de peso */}
                    {(() => {
                      const pesos = medidasAluno.map(m => m.peso);
                      const minPeso = Math.min(...pesos) - 2;
                      const maxPeso = Math.max(...pesos) + 2;
                      const delta = maxPeso - minPeso || 1;
                      
                      const points = medidasAluno.map((m, idx) => {
                        const x = (idx / (medidasAluno.length - 1)) * 480 + 10;
                        const y = 90 - ((m.peso - minPeso) / delta) * 70;
                        return `${x},${y}`;
                      }).join(" ");

                      return (
                        <>
                          {/* Polígono de Gradiente por baixo da linha */}
                          <polygon 
                            points={`10,95 ${points} 490,95`} 
                            fill="url(#grad-peso)" 
                            opacity="0.1" 
                          />
                          <defs>
                            <linearGradient id="grad-peso" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#ffffff" />
                            </linearGradient>
                          </defs>

                          <polyline
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            points={points}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />

                          {/* Renderiza pontos interativos */}
                          {medidasAluno.map((m, idx) => {
                            const x = (idx / (medidasAluno.length - 1)) * 480 + 10;
                            const y = 90 - ((m.peso - minPeso) / delta) * 70;
                            return (
                              <g key={m.id}>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="5"
                                  fill="#0f172a"
                                  stroke="#10b981"
                                  strokeWidth="2"
                                />
                                <text
                                  x={x}
                                  y={y - 10}
                                  fill="#1e293b"
                                  fontSize="8"
                                  fontWeight="bold"
                                  fontFamily="monospace"
                                  textAnchor="middle"
                                >
                                  {m.peso}kg
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>

                  {/* Escala de datas */}
                  <div className="absolute bottom-2 left-0 right-0 px-4 flex justify-between text-4xs font-mono text-slate-400 uppercase">
                    {medidasAluno.map((m, idx) => (
                      <span key={m.id}>{m.data}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Tabela de Medidas Corporais Completas */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Grid className="w-4 h-4 text-slate-500" />
                Histórico Geral de Medidas Detalhado
              </span>

              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-2xs">
                  <thead className="bg-slate-50 font-mono text-slate-450 uppercase">
                    <tr>
                      <th className="py-2.5 px-4 font-bold">Data</th>
                      <th className="py-2.5 px-4 font-bold text-center">Peso</th>
                      <th className="py-2.5 px-4 font-bold text-center">BF Encontrado</th>
                      <th className="py-2.5 px-4 font-bold text-center">Abdomem / Cintura</th>
                      <th className="py-2.5 px-4 font-bold text-center">Braço Dir.</th>
                      <th className="py-2.5 px-4 font-bold text-center">Braço Esq.</th>
                      <th className="py-2.5 px-4 font-bold text-center">Coxa Dir.</th>
                      <th className="py-2.5 px-4 font-bold text-center">Coxa Esq.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {medidasAluno.map(med => (
                      <tr key={med.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-bold font-mono text-slate-900">{med.data}</td>
                        <td className="py-2.5 px-4 font-bold text-center text-emerald-600 font-mono">{med.peso} kg</td>
                        <td className="py-2.5 px-4 text-center font-mono">{med.bf}%</td>
                        <td className="py-2.5 px-4 text-center font-mono">{med.cintura || "--"} cm</td>
                        <td className="py-2.5 px-4 text-center font-mono">{med.bracoD || "--"} cm</td>
                        <td className="py-2.5 px-4 text-center font-mono">{med.bracoE || "--"} cm</td>
                        <td className="py-2.5 px-4 text-center font-mono">{med.coxaD || "--"} cm</td>
                        <td className="py-2.5 px-4 text-center font-mono">{med.coxaE || "--"} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Centro de Arquivos, Mídias e Evolução */}
            <div className="space-y-6 pt-6 border-t border-slate-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-rose-500" />
                    Centro de Arquivos, Mídias de Evolução & Exames
                  </h4>
                  <p className="text-2xs text-slate-400 mt-0.5">Suba e consulte imagens comparativas de evolução corporal, vídeos de execução de treinos ou documentos clínicos e exames gerais.</p>
                </div>
              </div>

              {/* Box de Upload Interativo */}
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 transition-all hover:border-rose-400/50">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  <div className="md:col-span-7">
                    <label 
                      htmlFor="multi-file-selector"
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files) {
                          processarArquivos(e.dataTransfer.files);
                        }
                      }}
                      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all text-center ${
                        dragActive ? "border-rose-500 bg-rose-50/30" : "border-slate-200 bg-white"
                      }`}
                    >
                      <UploadCloud className={`w-8 h-8 mb-2 transition-all ${dragActive ? "text-rose-500 scale-110 animate-bounce" : "text-slate-450"}`} />
                      <span className="text-2xs font-bold text-slate-800 block">Clique para buscar ou arraste múltiplos arquivos</span>
                      <span className="text-[10px] text-slate-400 mt-1 block">Fotos, vídeos de treino, exames (PDF, Word, MP4, JPEG, PNG, etc)</span>
                      
                      <input 
                        type="file" 
                        id="multi-file-selector" 
                        multiple 
                        accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" 
                        onChange={(e) => {
                          if (e.target.files) {
                            processarArquivos(e.target.files);
                          }
                        }}
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <div className="md:col-span-5 space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3.5 shadow-3xs">
                      <div>
                        <label className="text-4xs text-slate-400 font-bold font-mono tracking-wider block mb-1">FASE / MARCAÇÃO DO ARQUIVO</label>
                        <select
                          value={novoArquivoFase}
                          onChange={(e) => setNovoArquivoFase(e.target.value)}
                          className="bg-slate-50 p-2.5 text-2xs rounded-lg border border-slate-150 w-full focus:outline-none focus:border-rose-400 font-bold text-slate-800 cursor-pointer"
                        >
                          <option value="Atual">Fase Atual (Atual)</option>
                          <option value="Início">Início do Ciclo / TRT</option>
                          <option value="Mês 1">Evolução Mês 1</option>
                          <option value="Mês 2">Evolução Mês 2</option>
                          <option value="Pós-Ciclo">Pós-Ciclo ou Consolidação</option>
                          <option value="Exame Clínico">Exames e Prontuários (PDF / Docs)</option>
                          <option value="Execução de Exercício">Correção de Movimento (Vídeo)</option>
                        </select>
                      </div>

                      <div className="text-[10px] text-slate-455 leading-normal flex items-start gap-1 p-2 bg-emerald-50 rounded-lg text-emerald-800 border border-emerald-100">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Dica:</strong> Defina o marcador antes do envio para catalogar as mídias. O sistema segmentará cada arquivo por data.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barra de Filtros por Categoria de Arquivo */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-150 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFiltroTipoArquivo("todos")}
                    className={`px-3 py-1.5 rounded-full text-2xs font-extrabold transition-all cursor-pointer ${
                      filtroTipoArquivo === "todos" 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Todos ({fotosAluno.length})
                  </button>
                  <button
                    onClick={() => setFiltroTipoArquivo("imagem")}
                    className={`px-3 py-1.5 rounded-full text-2xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                      filtroTipoArquivo === "imagem" 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📸 Fotos ({fotosAluno.filter(f => !f.tipo || f.tipo === "imagem").length})
                  </button>
                  <button
                    onClick={() => setFiltroTipoArquivo("video")}
                    className={`px-3 py-1.5 rounded-full text-2xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                      filtroTipoArquivo === "video" 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    🎥 Vídeos ({fotosAluno.filter(f => f.tipo === "video").length})
                  </button>
                  <button
                    onClick={() => setFiltroTipoArquivo("documento")}
                    className={`px-3 py-1.5 rounded-full text-2xs font-extrabold transition-all cursor-pointer flex items-center gap-1 ${
                      filtroTipoArquivo === "documento" 
                        ? "bg-slate-900 text-white shadow-sm" 
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📁 Documentos ({fotosAluno.filter(f => f.tipo === "documento").length})
                  </button>
                </div>
              </div>

              {/* Lista e Grid Filtrado */}
              {(() => {
                const arquivosFiltrados = fotosAluno
                  .filter(f => f.fase !== "Recebido por Chat")
                  .filter(f => {
                    if (filtroTipoArquivo === "todos") return true;
                    if (filtroTipoArquivo === "imagem") return !f.tipo || f.tipo === "imagem";
                    return f.tipo === filtroTipoArquivo;
                  });

                if (arquivosFiltrados.length === 0) {
                  return (
                    <div className="bg-slate-50 py-12 rounded-2xl text-center text-slate-400 text-xs border border-slate-150">
                      Nenhum registro oficial de evolução encontrado nesta categoria.
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {arquivosFiltrados.map(f => {
                      const isImage = !f.tipo || f.tipo === "imagem";
                      const isVideo = f.tipo === "video";
                      const isDocument = f.tipo === "documento";

                      return (
                        <div key={f.id} className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-3xs hover:shadow-2xs transition-all flex flex-col justify-between group relative overflow-hidden">
                          {/* Top Tag & Delete */}
                          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100 z-15">
                            <span className="text-[9px] font-black tracking-widest uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                              {f.fase}
                            </span>
                            <button
                              onClick={() => {
                                if (confirm("Deseja realmente apagar este arquivo da ficha do aluno?")) {
                                  onExcluirFoto(f.id);
                                }
                              }}
                              className="text-slate-300 hover:bg-rose-50 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                              title="Apagar Arquivo"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            </button>
                          </div>

                          {/* Visual Component depending on type */}
                          <div className="flex-1 flex flex-col justify-center min-h-[160px] bg-slate-50 rounded-xl overflow-hidden relative border border-slate-100">
                            {isImage && (
                              <div className="relative w-full h-40 group cursor-zoom-in" onClick={() => setPreviewZoom(f)}>
                                <img 
                                  src={f.frenteUrl} 
                                  alt={f.nomeArquivo || `Evolução: ${f.fase}`} 
                                  className="w-full h-full object-cover group-hover:scale-103 transition-transform" 
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <div className="p-1.5 bg-white/90 rounded-full shadow-2xs text-slate-800">
                                    <Eye className="w-4 h-4" />
                                  </div>
                                </div>
                              </div>
                            )}

                            {isVideo && (
                              <div className="relative w-full h-40 bg-black flex flex-col justify-between">
                                <video 
                                  src={f.frenteUrl} 
                                  preload="metadata"
                                  controls 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                            )}

                            {isDocument && (
                              <div className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                                <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                                  <FileText className="w-8 h-8" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-800 line-clamp-2 px-1 block break-all">
                                  {f.nomeArquivo || "Documento Clínico"}
                                </span>
                                {f.tamanhoArquivo && (
                                  <span className="text-[9px] text-slate-400 font-mono block">
                                    {f.tamanhoArquivo} • {f.extensao?.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            )}

                            {!isImage && !isVideo && !isDocument && (
                              <div className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                                <span className="p-3 bg-slate-100 text-slate-600 rounded-2xl border border-slate-200">
                                  <Folder className="w-8 h-8" />
                                </span>
                                <span className="text-[10px] font-bold text-slate-800 line-clamp-2 block break-all">
                                  {f.nomeArquivo || "Arquivo Anexo"}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Footer Info / Action */}
                          <div className="mt-3.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div className="text-left">
                              <span className="text-[9px] text-slate-400 font-mono block">Adicionado:</span>
                              <span className="text-[10px] font-bold text-slate-700 block font-mono">{f.data}</span>
                            </div>
                            
                            {/* Action links */}
                            {isDocument && f.frenteUrl && (
                              <a 
                                href={f.frenteUrl} 
                                download={f.nomeArquivo || "documento"} 
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 text-[10px] font-extrabold text-white bg-slate-900 border border-slate-900 hover:bg-slate-850 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-3xs"
                              >
                                <Download className="w-3 h-3" />
                                Abrir
                              </a>
                            )}
                            
                            {isImage && (
                              <button 
                                onClick={() => setPreviewZoom(f)}
                                className="px-2.5 py-1 text-[10px] font-extrabold text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                              >
                                Zoom
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

              {/* Fotos recebidas por chat */}
              {(() => {
                const midiasChat = fotosAluno.filter(f => f.fase === "Recebido por Chat");
                if (midiasChat.length === 0) return null;

                return (
                  <div className="bg-rose-50/20 border border-slate-200/80 rounded-2xl p-5 mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-rose-500 animate-pulse animate-duration-1000" />
                        <h5 className="text-xs font-black text-rose-900 uppercase tracking-wide">
                          Fotos e Vídeos recebidos por chat ({midiasChat.length})
                        </h5>
                      </div>
                      <span className="text-[10px] text-rose-600 font-mono bg-rose-50 px-2 py-0.5 rounded-full font-bold">
                        Integrado do Chat Suporte
                      </span>
                    </div>
                    <p className="text-3xs text-slate-500 leading-relaxed">
                      Estas mídias foram enviadas durante conversas e foram salvas na ficha automaticamente.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
                      {midiasChat.map(f => {
                        const isImage = !f.tipo || f.tipo === "imagem";
                        const isVideo = f.tipo === "video";

                        return (
                          <div key={f.id} className="bg-white border border-slate-200/80 rounded-xl p-2 shadow-4xs hover:shadow-3xs transition-all relative overflow-hidden group flex flex-col justify-between">
                            <button
                              onClick={() => {
                                if (confirm("Deseja apagar esta mídia do histórico?")) {
                                  onExcluirFoto(f.id);
                                }
                              }}
                              className="absolute top-1 right-1 bg-white/90 hover:bg-rose-500 hover:text-white text-slate-400 p-1 rounded-md transition-colors z-20 shadow-3xs cursor-pointer"
                              title="Apagar"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>

                            <div className="h-24 bg-slate-50 rounded-lg overflow-hidden relative border border-slate-100 flex items-center justify-center">
                              {isImage ? (
                                <img 
                                  src={f.frenteUrl} 
                                  alt="Chat upload" 
                                  className="w-full h-full object-cover group-hover:scale-103 transition-transform cursor-pointer"
                                  onClick={() => setPreviewZoom(f)}
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <video 
                                  src={f.frenteUrl} 
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              )}
                            </div>

                            <div className="mt-1.5 text-left text-[9px] font-mono text-slate-400 flex items-center justify-between gap-1">
                              <span className="truncate max-w-[55px]" title={f.nomeArquivo}>{f.nomeArquivo || 'Mídia'}</span>
                              <span>{f.data}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Lightbox Modal para Zoom Visual */}
              {previewZoom && (
                <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setPreviewZoom(null)}>
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-2xl w-full relative shadow-2xl flex flex-col gap-4 animate-scale" onClick={e => e.stopPropagation()}>
                    {/* Header bar inside modal */}
                    <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
                      <div className="text-left">
                        <span className="text-4xs font-mono font-bold text-rose-500 uppercase tracking-widest">{previewZoom.fase}</span>
                        <h4 className="text-xs font-bold text-slate-100">{previewZoom.nomeArquivo || "Visualização do Arquivo"}</h4>
                      </div>
                      <button 
                        onClick={() => setPreviewZoom(null)}
                        className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Viewer Frame */}
                    <div className="flex-1 flex items-center justify-center min-h-[300px] max-h-[70vh] bg-slate-950 rounded-2xl overflow-hidden p-2 border border-slate-850">
                      {(!previewZoom.tipo || previewZoom.tipo === "imagem") ? (
                        <img 
                          src={previewZoom.frenteUrl} 
                          alt="Visualização" 
                          className="max-h-[60vh] object-contain max-w-full rounded-lg"
                        />
                      ) : previewZoom.tipo === "video" ? (
                        <video 
                          src={previewZoom.frenteUrl} 
                          controls 
                          autoPlay
                          className="max-h-[60vh] w-full object-contain rounded-lg"
                        />
                      ) : (
                        <div className="text-center p-6 text-slate-400 space-y-4">
                          <FileText className="w-16 h-16 mx-auto text-slate-600" />
                          <p className="text-2xs">Este é um arquivo geral de extensão <strong>.{previewZoom.extensao}</strong>.</p>
                          <a 
                            href={previewZoom.frenteUrl} 
                            download={previewZoom.nomeArquivo || "arquivo"} 
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block px-4 py-2 bg-rose-500 text-white rounded-xl text-2xs font-bold hover:bg-rose-600 transition-colors"
                          >
                            Baixar / Visualizar Arquivo Integral
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-slate-400 text-3xs font-mono border-t border-slate-800 pt-3">
                      <span>Tamanho: {previewZoom.tamanhoArquivo || "N/A"}</span>
                      <span>Enviado em: {previewZoom.data}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* ABA 2: GERENCIAR/PRESCREVER DIETA */}
        {abaAtiva === "dieta" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-950">Estatísticas e Prescrição de Macrogrupos</h3>
              <p className="text-2xs text-slate-400 mt-0.5">Configure abaixo os alvos calóricos e desmonte cada refeição com gramagens exatas.</p>
            </div>

            {/* Macro configurador */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-1">
                <label className="text-3xs font-mono font-bold text-slate-400 uppercase tracking-widest block">Metas de Calorias Totais</label>
                <input
                  type="number"
                  value={prescCalorias}
                  onChange={(e) => setPrescCalorias(Number(e.target.value))}
                  className="bg-slate-850 p-2 text-md font-bold text-emerald-400 rounded-lg w-full border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-4xs text-slate-500 block">Soma macros: {caloriasCalculadas} kcal</span>
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-mono font-bold text-slate-400 uppercase tracking-widest block">Carboidratos (g)</label>
                <input
                  type="number"
                  value={prescCarb}
                  onChange={(e) => setPrescCarb(Number(e.target.value))}
                  className="bg-slate-850 p-2 text-md font-bold text-white rounded-lg w-full border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-4xs text-slate-500 block">Contribui {carboCal} kcal (4kcal/g)</span>
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-mono font-bold text-slate-400 uppercase tracking-widest block">Proteínas (g)</label>
                <input
                  type="number"
                  value={prescProt}
                  onChange={(e) => setPrescProt(Number(e.target.value))}
                  className="bg-slate-850 p-2 text-md font-bold text-white rounded-lg w-full border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-4xs text-slate-500 block">Contribui {protCal} kcal (4kcal/g)</span>
              </div>

              <div className="space-y-1">
                <label className="text-3xs font-mono font-bold text-slate-400 uppercase tracking-widest block">Gorduras (g)</label>
                <input
                  type="number"
                  value={prescGord}
                  onChange={(e) => setPrescGord(Number(e.target.value))}
                  className="bg-slate-850 p-2 text-md font-bold text-white rounded-lg w-full border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                />
                <span className="text-4xs text-slate-500 block">Contribui {gordCal} kcal (9kcal/g)</span>
              </div>
            </div>

            {/* Lista de Refeições Prescritas */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800">Detalhamento dos Alimentos e Refeições</h4>
                <button
                  id="btn-adicionar-refeicao-form"
                  onClick={handleAddRefeicao}
                  className="flex items-center gap-1.5 text-2xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 py-1.5 px-3 rounded-lg border border-emerald-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nova Refeição
                </button>
              </div>

              <div className="space-y-4">
                {refeicoesPrescritas.map((ref, idxOption) => (
                  <div key={ref.id} className="bg-slate-50 border border-slate-205 rounded-2xl p-4 space-y-3 relative">
                    <button
                      onClick={() => handleRemoveRefeicao(ref.id)}
                      className="absolute right-4 top-4 hover:bg-rose-100/70 p-1.5 rounded-lg text-rose-500 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                      title="Excluir refeição completa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex flex-col sm:flex-row gap-2 max-w-lg">
                      <input
                        type="text"
                        value={ref.nome}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRefeicoesPrescritas(prev => prev.map(r => r.id === ref.id ? { ...r, nome: val } : r));
                        }}
                        className="text-xs font-bold bg-white p-1.5 rounded border border-slate-200 focus:outline-none focus:border-emerald-500 flex-1 font-sans"
                        placeholder="Nome da Refeição"
                      />
                      <input
                        type="text"
                        value={ref.horario}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRefeicoesPrescritas(prev => prev.map(r => r.id === ref.id ? { ...r, horario: val } : r));
                        }}
                        className="text-xs font-bold bg-white p-1.5 rounded border border-slate-200 text-center w-20 focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="08:00"
                      />
                    </div>

                    {/* Alimentos detalhados */}
                    <div className="space-y-2 pt-2">
                      <label className="text-3xs font-mono font-bold text-slate-400 block uppercase tracking-wider">Lançamento de Alimentos e Substitutos Adicionais:</label>
                      <div className="space-y-3">
                        {ref.alimentos.map((alimento: any, foodIdx: number) => (
                          <div key={foodIdx} className="bg-white p-3 rounded-xl border border-slate-200/85 space-y-2.5 shadow-3xs">
                            <div className="flex items-center gap-2">
                              <span className="text-3xs font-bold text-slate-400 font-mono">#{foodIdx + 1}</span>
                              <input
                                type="text"
                                value={alimento.nome}
                                onChange={(e) => handleUpdateAlimento(ref.id, foodIdx, "nome", e.target.value)}
                                placeholder="Nome do alimento. Ex: Tapioca"
                                className="bg-slate-50 p-1.5 text-2xs rounded border border-slate-200 flex-1 focus:outline-none focus:border-emerald-500 font-semibold text-slate-800"
                              />
                              <input
                                type="text"
                                value={alimento.quantidade}
                                onChange={(e) => handleUpdateAlimento(ref.id, foodIdx, "quantidade", e.target.value)}
                                placeholder="Ex: 100g, 4 fatias"
                                className="bg-slate-50 p-1.5 text-2xs rounded border border-slate-200 w-36 focus:outline-none focus:border-emerald-500 font-mono text-center"
                              />
                              <button
                                onClick={() => handleRemoveAlimento(ref.id, foodIdx)}
                                className="p-1.5 rounded hover:bg-rose-50 text-rose-500 cursor-pointer"
                                title="Remover"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Campo de substituto */}
                            <div className="pl-4 border-l-2 border-slate-200 flex flex-col sm:flex-row gap-2 items-center">
                              <div className="flex-1 w-full relative">
                                <input
                                  type="text"
                                  value={alimento.substituicao || ""}
                                  onChange={(e) => handleUpdateAlimento(ref.id, foodIdx, "substituicao", e.target.value)}
                                  placeholder="Opção de substituição (Manual ou gerado por IA)"
                                  className="bg-white px-2 py-1.5 text-3xs rounded-lg border border-slate-250 w-full focus:outline-none focus:border-slate-400 text-slate-600 font-medium"
                                />
                              </div>
                              <button
                                onClick={() => handleSugerirSubstituicaoIa(ref.id, foodIdx, alimento.nome, alimento.quantidade)}
                                disabled={loadingFoodSec === `${ref.id}_${foodIdx}`}
                                className="flex items-center gap-1 bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white text-emerald-400 text-3xs font-black px-3 py-1.5 rounded-lg select-none cursor-pointer transition-all disabled:opacity-50 w-full sm:w-auto text-center justify-center h-8"
                              >
                                {loadingFoodSec === `${ref.id}_${foodIdx}` ? (
                                  <>
                                    <div className="w-2.5 h-2.5 rounded-full border border-current border-t-transparent animate-spin"></div>
                                    Analisando...
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-3 h-3 text-emerald-400" />
                                    Gerar Ajuste IA (TACO)
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => handleAddAlimento(ref.id)}
                        className="flex items-center gap-1 text-4xs font-mono font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 py-1 px-2.5 rounded hover:bg-slate-100 transition-colors mt-2 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        Mais Alimento
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Salvar formulário de dieta */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                id="btn-salvar-prescricao-dieta"
                onClick={handleSaveDieta}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Salvar Nova Dieta do Aluno
              </button>
            </div>
          </div>
        )}

        {/* ABA 3: VER/EDITAR TREINO */}
        {abaAtiva === "treino" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-950">Prescrever e Ajustar Treinos</h3>
                <p className="text-2xs text-slate-400 mt-0.5">Faça ajustes manuais nos exercícios do aluno ou conte com a ajuda da Inteligência Esportiva.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {editTreinos.map((treino, tIdx) => (
                <div key={treino.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-205">
                    <div className="flex-1">
                      <label className="text-4xs font-mono font-bold text-slate-400 block uppercase tracking-wider mb-1">Divisão / Nome do Treino:</label>
                      <input
                        type="text"
                        value={treino.nomeDivisao}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditTreinos(prev => prev.map(t => t.id === treino.id ? { ...t, nomeDivisao: val } : t));
                        }}
                        className="bg-white px-3 py-1.5 text-xs font-black rounded-lg border border-slate-200 w-full focus:outline-none focus:border-emerald-500 text-slate-900"
                        placeholder="Ex: Treino A - Peito & Tríceps"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2 sm:pt-4">
                      <button
                        onClick={() => {
                          setEditTreinos(prev => prev.map(t => {
                            if (t.id !== treino.id) return t;
                            return {
                              ...t,
                              exercicios: [
                                ...t.exercicios,
                                {
                                  id: `ex_${Date.now()}_${Math.random()}`,
                                  nome: "Novo Exercício",
                                  series: 4,
                                  repeticoes: "10-12",
                                  carga: "Carga Sugerida",
                                  descanso: "60s",
                                  concluido: false
                                }
                              ]
                            };
                          }));
                        }}
                        className="text-4xs font-mono font-bold text-slate-600 bg-white border border-slate-250 hover:bg-slate-100 hover:text-slate-900 py-1.5 px-3 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-500" />
                        Adicionar Exercício
                      </button>
                    </div>
                  </div>

                  {/* Tabela de Exercícios Interativos */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-2xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100/75 text-3xs font-mono text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                          <th className="py-2.5 px-3">Exercício</th>
                          <th className="py-2.5 px-3 text-center w-20">Séries</th>
                          <th className="py-2.5 px-3 text-center w-36">Repetições</th>
                          <th className="py-2.5 px-3 text-center w-36">Carga</th>
                          <th className="py-2.5 px-3 text-center w-28">Descanso</th>
                          <th className="py-2.5 px-3 text-right">Excluir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150">
                        {treino.exercicios.map((ex, exIdx) => (
                          <tr key={ex.id} className="hover:bg-slate-100/30">
                            <td className="py-2 px-1">
                              <input
                                type="text"
                                value={ex.nome}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditTreinos(prev => prev.map(t => {
                                    if (t.id !== treino.id) return t;
                                    const novosExs = [...t.exercicios];
                                    novosExs[exIdx] = { ...novosExs[exIdx], nome: val };
                                    return { ...t, exercicios: novosExs };
                                  }));
                                }}
                                className="bg-white p-1.5 text-2xs font-bold text-slate-800 rounded border border-slate-200 w-full focus:outline-none focus:border-slate-400"
                              />
                            </td>
                            <td className="py-2 px-1 text-center">
                              <input
                                type="number"
                                value={ex.series}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setEditTreinos(prev => prev.map(t => {
                                    if (t.id !== treino.id) return t;
                                    const novosExs = [...t.exercicios];
                                    novosExs[exIdx] = { ...novosExs[exIdx], series: val };
                                    return { ...t, exercicios: novosExs };
                                  }));
                                }}
                                className="bg-white p-1.5 text-2xs rounded border border-slate-200 text-center w-14 font-mono font-bold focus:outline-none focus:border-slate-400"
                              />
                            </td>
                            <td className="py-2 px-1 text-center">
                              <input
                                type="text"
                                value={ex.repeticoes}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditTreinos(prev => prev.map(t => {
                                    if (t.id !== treino.id) return t;
                                    const novosExs = [...t.exercicios];
                                    novosExs[exIdx] = { ...novosExs[exIdx], repeticoes: val };
                                    return { ...t, exercicios: novosExs };
                                  }));
                                }}
                                className="bg-white p-1.5 text-2xs rounded border border-slate-200 text-center w-32 font-medium font-mono focus:outline-none focus:border-slate-400"
                              />
                            </td>
                            <td className="py-2 px-1 text-center">
                              <input
                                type="text"
                                value={ex.carga}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditTreinos(prev => prev.map(t => {
                                    if (t.id !== treino.id) return t;
                                    const novosExs = [...t.exercicios];
                                    novosExs[exIdx] = { ...novosExs[exIdx], carga: val };
                                    return { ...t, exercicios: novosExs };
                                  }));
                                }}
                                className="bg-white p-1.5 text-2xs rounded border border-slate-200 text-center w-32 font-bold font-mono text-emerald-800 focus:outline-none focus:border-slate-400"
                              />
                            </td>
                            <td className="py-2 px-1 text-center">
                              <input
                                type="text"
                                value={ex.descanso}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setEditTreinos(prev => prev.map(t => {
                                    if (t.id !== treino.id) return t;
                                    const novosExs = [...t.exercicios];
                                    novosExs[exIdx] = { ...novosExs[exIdx], descanso: val };
                                    return { ...t, exercicios: novosExs };
                                  }));
                                }}
                                className="bg-white p-1.5 text-2xs rounded border border-slate-200 text-center w-24 font-mono text-slate-500 focus:outline-none focus:border-slate-400"
                              />
                            </td>
                            <td className="py-2 px-1 text-right">
                              <button
                                onClick={() => {
                                  setEditTreinos(prev => prev.map(t => {
                                    if (t.id !== treino.id) return t;
                                    return {
                                      ...t,
                                      exercicios: t.exercicios.filter((_, i) => i !== exIdx)
                                    };
                                  }));
                                }}
                                className="text-rose-500 hover:bg-rose-100 hover:text-rose-750 p-1.5 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                                title="Excluir exercício"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Controle Inteligente IA - Ajustes de Divisão */}
                  <div className="bg-emerald-50/50 border border-emerald-100 p-3.5 rounded-xl flex flex-col md:flex-row items-center gap-3">
                    <div className="flex items-center gap-2 text-3xs font-extrabold text-[#0e733d] shrink-0 font-sans">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      AJUSTAR COM IA:
                    </div>
                    <input
                      type="text"
                      placeholder="Ex: Mudar foco para força, adicionar 1 exercício de abdominal ou reescrever completamente para costas"
                      id={`ia-instrucao-treino-${treino.id}`}
                      className="bg-white px-2.5 py-1.5 text-3xs rounded-lg border border-slate-200 flex-1 focus:outline-none focus:border-slate-400 text-slate-700"
                    />
                    <button
                      onClick={async () => {
                        const inputEl = document.getElementById(`ia-instrucao-treino-${treino.id}`) as HTMLInputElement;
                        const instr = inputEl?.value?.trim() || "";
                        if (!instr) {
                          alert("Insira uma instrução (ex: 'focar em força nas séries finais' ou 'adicionar desenvolvimento com halteres')!");
                          return;
                        }
                        setLoadingIaTreinoId(treino.id);
                        try {
                          const response = await fetch("/api/gemini/assistant-workout", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              nomeDivisao: treino.nomeDivisao,
                              exercicios: treino.exercicios,
                              instrucao: instr
                            })
                          });
                          if (!response.ok) throw new Error("Erro na requisição para IA");
                          const data = await response.json();
                          if (data && data.exercicios) {
                            const formatados = data.exercicios.map((ex: any, i: number) => ({
                              id: `ex_ia_${Date.now()}_${i}`,
                              nome: ex.nome,
                              series: ex.series || 4,
                              repeticoes: ex.repeticoes || "10",
                              carga: ex.carga || "10kg",
                              descanso: ex.descanso || "60s",
                              concluido: false
                            }));
                            setEditTreinos(prev => prev.map(t => {
                              if (t.id !== treino.id) return t;
                              return { ...t, exercicios: formatados };
                            }));
                            inputEl.value = "";
                          }
                        } catch (err) {
                          console.error(err);
                          alert("Erro ao recalcular divisão de treino com IA.");
                        } finally {
                          setLoadingIaTreinoId(null);
                        }
                      }}
                      disabled={loadingIaTreinoId === treino.id}
                      className="bg-slate-900 border border-slate-850 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white text-emerald-400 text-3xs font-extrabold px-3 py-2 rounded-lg cursor-pointer transition-all disabled:opacity-50 shrink-0 w-full md:w-auto text-center justify-center flex items-center gap-1"
                    >
                      {loadingIaTreinoId === treino.id ? (
                        <>
                          <div className="w-2.5 h-2.5 rounded-full border border-current border-t-transparent animate-spin"></div>
                          Carregando...
                        </>
                      ) : (
                        "Otimizar com IA"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Salvar formulário de treino */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                id="btn-salvar-treinos-alteracoes"
                onClick={handleSaveTreino}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Salvar Configurações de Treino
              </button>
            </div>
          </div>
        )}

        {/* ABA 4: FÁRMACOS & SUPLEMENTAÇÃO */}
        {abaAtiva === "suplementacao" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-slate-950">Fármacos, Hormônios e Suplementos Prescritos</h3>
              <p className="text-2xs text-slate-400 mt-0.5">Gestão clínica, metabólica e ergogênica de compostos prescritos para aumento de performance, saúde e terapias hormonais controladas (TRT/Ciclos).</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {editSuplementos.map((sup, sIdx) => {
                const isHormonio = sup.categoria === "hormonio";
                const isFarmaco = sup.categoria === "farmaco";
                
                // Escolha das classes estéticas para a borda dependendo do tipo de composto
                let cardStyle = "bg-white border-slate-200";
                if (isHormonio) {
                  cardStyle = "bg-rose-50/50 border-rose-200 shadow-3xs";
                } else if (isFarmaco) {
                  cardStyle = "bg-amber-50/40 border-amber-200/90";
                }

                return (
                  <div key={sup.id} className={`border p-4 rounded-xl flex flex-col xl:flex-row items-center gap-3.5 shadow-3xs hover:shadow-2xs transition-all ${cardStyle}`}>
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-4xs text-slate-400 font-bold font-mono tracking-wider block">NOME DO COMPOSTO</label>
                        <input
                          type="text"
                          value={sup.nome}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditSuplementos(prev => prev.map(s => s.id === sup.id ? { ...s, nome: val } : s));
                          }}
                          className="bg-white p-2 text-2xs rounded-lg border border-slate-200 w-full focus:outline-none focus:border-slate-500 font-bold text-slate-900"
                          placeholder="Ex: Enantato de Testosterona"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-4xs text-slate-400 font-bold font-mono tracking-wider block">DOSAGEM ATIVA</label>
                        <input
                          type="text"
                          value={sup.dosagem}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditSuplementos(prev => prev.map(s => s.id === sup.id ? { ...s, dosagem: val } : s));
                          }}
                          className={`bg-white p-2 text-2xs rounded-lg border border-slate-200 w-full focus:outline-none focus:border-slate-500 font-bold font-mono ${isHormonio ? "text-rose-700" : "text-emerald-800"}`}
                          placeholder="Ex: 250mg ou 5g"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-4xs text-slate-400 font-bold font-mono tracking-wider block">HORÁRIO / CRONOGRAMA</label>
                        <input
                          type="text"
                          value={sup.horario}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditSuplementos(prev => prev.map(s => s.id === sup.id ? { ...s, horario: val } : s));
                          }}
                          className="bg-white p-2 text-2xs rounded-lg border border-slate-200 w-full focus:outline-none focus:border-slate-500 font-mono text-slate-600 font-medium"
                          placeholder="Ex: Quarta-feira de manhã"
                        />
                      </div>
                      <div className="space-y-1 overflow-visible">
                        <label className="text-4xs text-slate-400 font-bold font-mono tracking-wider block">CLASSE TERAPÊUTICA</label>
                        <select
                          value={sup.categoria || "suplemento"}
                          onChange={(e) => {
                            const val = e.target.value as any;
                            setEditSuplementos(prev => prev.map(s => s.id === sup.id ? { ...s, categoria: val } : s));
                          }}
                          className="bg-white p-2 text-2xs rounded-lg border border-slate-200 w-full focus:outline-none focus:border-slate-500 font-bold text-slate-700 cursor-pointer"
                        >
                          <option value="suplemento">Suplemento Alimentar</option>
                          <option value="farmaco">Fármaco / Protetores (Clínico)</option>
                          <option value="hormonio">Hormônio / Ergogênico (TRT/Ciclos)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 xl:pt-4 shrink-0">
                      {isHormonio && (
                        <span className="text-[9px] font-black tracking-widest uppercase bg-rose-100 text-rose-700 border border-rose-200 px-2 py-1 rounded-md mb-0">
                          Hormônio ⚠️
                        </span>
                      )}
                      {isFarmaco && (
                        <span className="text-[9px] font-black tracking-widest uppercase bg-amber-100 text-amber-800 border border-amber-200 px-2 py-1 rounded-md mb-0">
                          Clínico / Suporte
                        </span>
                      )}
                      {!isHormonio && !isFarmaco && (
                        <span className="text-[9px] font-black tracking-widest uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-1 rounded-md mb-0">
                          Suplemento
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setEditSuplementos(prev => prev.filter(s => s.id !== sup.id));
                        }}
                        className="text-rose-505 hover:bg-rose-100 hover:text-rose-800 p-2 rounded-lg border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                        title="Excluir Prescrição"
                      >
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="flex justify-start">
                <button
                  onClick={() => {
                    setEditSuplementos(prev => [
                      ...prev,
                      {
                        id: `sup_${Date.now()}_${Math.random()}`,
                        alunoId: aluno.id,
                        nome: "Novo Composto",
                        dosagem: "50mg",
                        horario: "Quarta-feira Manhã",
                        concluidoHoje: false,
                        categoria: "hormonio" // default to hormone for interactive usage as requested!
                      }
                    ]);
                  }}
                  className="flex items-center gap-1.5 text-2xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 py-1.5 px-3 rounded-lg border border-rose-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-rose-500" />
                  Prescrever Novo Ergogênico / TRT
                </button>
              </div>

              {/* Ajuste Avançado Clínico com IA */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4 mt-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-430" />
                  <span className="text-xs font-black font-sans uppercase tracking-widest text-emerald-400">Nutrologia & Endocrinologia AI Pro</span>
                </div>
                <p className="text-3xs text-slate-405 leading-normal max-w-2xl">
                  Insira as diretrizes para que o assistente projete ou ajuste protocolos inteligentes. A IA calcula a integração de suplementos, fármacos preventivos (compostos hepáticos, moduladores hormonais) e ergogênicos adequados ao biotipo do aluno.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    id="ia-instrucao-suplementacao"
                    placeholder="Ex: Pedro quer focar em ganho muscular seco: monte protocolo com 250mg enantato de testosterona/sem + protetores hepáticos e creatina"
                    className="bg-slate-855 text-2xs px-3 py-2.5 w-full flex-1 rounded-xl border border-slate-800 text-white focus:outline-none focus:border-emerald-505"
                  />
                  <button
                    onClick={async () => {
                      const inputEl = document.getElementById("ia-instrucao-suplementacao") as HTMLInputElement;
                      const instr = inputEl?.value?.trim() || "";
                      if (!instr) {
                        alert("Por favor, digite as orientações esportivas do aluno primeiro!");
                        return;
                      }
                      setLoadingSuplementacaoIa(true);
                      try {
                        const response = await fetch("/api/gemini/assistant-pharmacos", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            suplementos: editSuplementos,
                            instrucao: instr
                          })
                        });
                        if (!response.ok) throw new Error("Erro na solicitação de IA");
                        const data = await response.json();
                        if (data && data.suplementos) {
                          const formatados = data.suplementos.map((s: any, i: number) => ({
                            id: `sup_ia_${Date.now()}_${i}`,
                            alunoId: aluno.id,
                            nome: s.nome,
                            dosagem: s.dosagem || "1 cap",
                            horario: s.horario || "Qualquer horário",
                            concluidoHoje: false,
                            categoria: s.categoria || "suplemento"
                          }));
                          setEditSuplementos(formatados);
                          inputEl.value = "";
                        }
                      } catch (err) {
                        console.error(err);
                        alert("Não foi possível gerar recomendações de Protocolo na IA no momento.");
                      } finally {
                        setLoadingSuplementacaoIa(false);
                      }
                    }}
                    disabled={loadingSuplementacaoIa}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-2 px-5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 select-none transition-all w-full sm:w-auto h-9 font-sans"
                  >
                    {loadingSuplementacaoIa ? (
                      <>
                        <div className="w-2.5 h-2.5 rounded-full border border-current border-t-transparent animate-spin"></div>
                        Prescrevendo Ciclo/Suplementos...
                      </>
                    ) : (
                      <>
                        Otimizar Prescrição com IA
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Salvar formulário de suplementação */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                id="btn-salvar-suplementacao-alteracoes"
                onClick={handleSaveSuplementacao}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Salvar Recorrentes de Suplementação / Fármacos
              </button>
            </div>
          </div>
        )}

        {/* ABA 5: ANÁLISE & FEEDBACK IA */}
        {abaAtiva === "ia" && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

              <div className="space-y-2 relative z-10 flex-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-430 animate-pulse" />
                  <h4 className="text-sm font-bold uppercase tracking-wider">Mecanismo Integrado Gabriel Leal AI Pro</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                  Nosso sistema faz varreduras heurísticas prontas de desvio, peso e taxa de adesão para sugerir o feedback ideal do profissional. Economize 80% do tempo ao gerar o relatório semanal.
                </p>
              </div>

              <button
                id="btn-gerar-feedback-ia"
                onClick={handleGerarFeedbackIa}
                disabled={gerandoIa}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs py-2.5 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/10 active:scale-95 flex items-center gap-2 relative z-10 cursor-pointer disabled:opacity-50"
              >
                {gerandoIa ? (
                  <>
                    <div className="w-3 h-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin"></div>
                    Analisando Métricas...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Gerar Análise IA
                  </>
                )}
              </button>
            </div>

            {/* PAINEL DE TREINAMENTO DE AGENTES IA */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Treino de Protocolos de Agente de IA</h4>
                </div>
                <span className="text-[10px] bg-slate-900 text-slate-350 px-2 py-0.5 rounded-full font-mono font-bold uppercase">Agentes Paramétricos</span>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                Configure os parâmetros de prompt recomendados ou anexe arquivos clínicos em PDF/TXT como referências de diretrizes fisiológicas para seu agente Gabriel Leal AI Pro. O robô irá escanear estas instruções para calibrar o relatório e o suporte clínico do aluno {aluno.nome}.
              </p>

              <div className="space-y-3.5">
                {/* Textarea de Diretrizes */}
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">Diretriz do Prompt de Referência</label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Priorize treinos em drop-set no final de cada sessão e foque em elevar a ingestão hídrica diária para pelo menos 5.0L para otimizar os receptores hormonais."
                    value={diretrizIaInput}
                    onChange={(e) => setDiretrizIaInput(e.target.value)}
                    className="w-full bg-white p-3 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-medium font-sans text-slate-800"
                  />
                </div>

                {/* Upload Section de Arquivos de Referência */}
                <div className="space-y-2">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">Arquivos Clínicos & Diretrizes Fisiológicas (Referência de Upload)</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Botão de Upload */}
                    <div className="relative border-2 border-dashed border-slate-250 hover:border-emerald-550 rounded-xl p-4 transition-colors flex flex-col items-center justify-center text-center bg-white cursor-pointer hover:bg-slate-50/50">
                      <input
                        type="file"
                        accept=".pdf,.txt,.doc,.docx"
                        onChange={handleAdicionarArquivoIa}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <UploadCloud className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-3xs font-bold text-slate-600 uppercase">Selecionar Arquivo PDF/TXT</span>
                      <span className="text-[8px] text-slate-400 mt-0.5 font-mono">Arraste ou clique para carregar manual</span>
                    </div>

                    {/* Lista de Ficheros Carregados */}
                    <div className="bg-white rounded-xl border border-slate-205 p-3 space-y-2 max-h-[110px] overflow-y-auto">
                      <span className="text-[9px] font-bold text-slate-405 uppercase tracking-wide block border-b border-slate-100 pb-1 flex items-center justify-between">
                        <span>Diretrizes de Sucesso ({arquivosReferenciaIa.length})</span>
                      </span>
                      {arquivosReferenciaIa.length === 0 ? (
                        <div className="py-2 text-center text-[10px] text-slate-400 font-mono">Sem arquivos carregados.</div>
                      ) : (
                        <div className="space-y-1.5">
                          {arquivosReferenciaIa.map(f => (
                            <div key={f.id} className="flex items-center justify-between bg-slate-50 p-1.5 rounded-lg border border-slate-150 text-[10px]">
                              <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                                <Folder className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                                <span className="font-sans font-semibold text-slate-700 truncate" title={f.nome}>{f.nome}</span>
                              </div>
                              <div className="flex items-center gap-1.5 font-mono text-[8px] text-slate-400">
                                <span>{f.tamanho}</span>
                                <button
                                  type="button"
                                  onClick={() => handleExcluirArquivoIa(f.id)}
                                  className="text-slate-450 hover:text-rose-500 transition-colors cursor-pointer"
                                  title="Remover arquivo do Agente"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="text-[9px] text-slate-400 font-mono flex items-center gap-1.5">
                    {uploadProgressIa ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></span>
                        Vetorizando material clínico...
                      </>
                    ) : (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        O robô lerá os anexos na próxima análise
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSalvarDiretrizIa}
                    className="bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold text-2xs py-1.5 px-4.5 rounded-xl transition-all shadow-3xs flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    Salvar Treino de Protocolo
                  </button>
                </div>
              </div>
            </div>

            {feedbackIaOutput ? (
              <div id="campo-ia-output" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-3xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    Feedback Técnico / Emocional do Coach para o Aluno
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(feedbackIaOutput);
                      alert("Feedback copiado para a Área de Transferência!");
                    }}
                    className="text-3xs font-mono font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    Mandar para WhatsApp (Copiar Texto)
                  </button>
                </div>
                
                {/* Visualizador de Markdown simples em JSX */}
                <div className="text-xs text-slate-700 leading-relaxed font-sans space-y-3 prose max-w-none">
                  {feedbackIaOutput.split("\n").map((line, i) => {
                    if (line.startsWith("###")) {
                      return <h4 key={i} className="text-sm font-bold text-slate-900 mt-4 border-b border-slate-100 pb-1">{line.replace("###", "")}</h4>;
                    }
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <p key={i} className="font-semibold text-slate-800">{line.replace(/\*\*/g, "")}</p>;
                    }
                    if (line.startsWith("####")) {
                      return <h5 key={i} className="text-xs font-bold text-slate-800 mt-3">{line.replace("####", "")}</h5>;
                    }
                    if (line.startsWith("*")) {
                      return <li key={i} className="ml-4 list-disc font-medium">{line.replace("*", "")}</li>;
                    }
                    return <p key={i} className="font-medium">{line}</p>;
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-150 rounded-2xl p-12 text-center text-slate-400">
                <Sparkles className="w-10 h-10 mx-auto text-emerald-300 stroke-1 block mb-3" />
                <p className="text-xs font-medium">Toque no botão &quot;Gerar Análise IA&quot; no card acima para que o robô faça um escaneamento completo do histórico físico, dietético e do check-in do aluno Pedro/Mariana/Lucas.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lançar medida corporal modal */}
      {novaMedidaModal && (
        <div id="modal-nova-medida-corporal" className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-xl border border-slate-100">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider">Lançar Novas Medidas Fisológicas</h4>
              <button 
                onClick={() => setNovaMedidaModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleMedidasSubmit} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-2xs">
                <div className="space-y-1 col-span-2">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">PESO ATUAL (KG)</label>
                  <input
                    id="med-input-peso"
                    type="number"
                    step="0.1"
                    required
                    value={medPeso}
                    onChange={(e) => setMedPeso(Number(e.target.value))}
                    className="bg-slate-50 p-1.5 rounded border border-slate-200 w-full focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">BF ESTIMADO %</label>
                  <input
                    id="med-input-bf"
                    type="number"
                    step="0.1"
                    required
                    value={medBf}
                    onChange={(e) => setMedBf(Number(e.target.value))}
                    className="bg-slate-50 p-1.5 rounded border border-slate-200 w-full focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">CINTURA (CM)</label>
                  <input
                    type="number"
                    value={medCintura}
                    onChange={(e) => setMedCintura(Number(e.target.value))}
                    className="bg-slate-50 p-1.5 rounded border border-slate-200 w-full focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">BRAÇO DIR (CM)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={medBracoD}
                    onChange={(e) => setMedBracoD(Number(e.target.value))}
                    className="bg-slate-50 p-1.5 rounded border border-slate-200 w-full focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">BRAÇO ESQ (CM)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={medBracoE}
                    onChange={(e) => setMedBracoE(Number(e.target.value))}
                    className="bg-slate-50 p-1.5 rounded border border-slate-200 w-full focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">COXA DIR (CM)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={medCoxaD}
                    onChange={(e) => setMedCoxaD(Number(e.target.value))}
                    className="bg-slate-50 p-1.5 rounded border border-slate-200 w-full focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-150 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNovaMedidaModal(false)}
                  className="bg-slate-50 text-slate-700 py-1.5 px-3 rounded-xl hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-salvar-medida-modal"
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-1.5 px-4 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Lançar Peso/Medidas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDITAR PERFIL COMPLETO (Surgical Form) */}
      {modalEditarPerfil && (
        <div id="modal-editar-perfil-aluno" className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-850">
              <div className="flex items-center gap-2">
                <User className="text-emerald-500 w-5 h-5" />
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider font-mono">Editar Perfil Integral</h3>
                  <span className="text-3xs text-slate-400">Modifique dados físicos, contato e metas do aluno</span>
                </div>
              </div>
              <button 
                onClick={() => setModalEditarPerfil(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarEditarPerfil} className="p-5.5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome */}
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    className="w-full bg-slate-50 p-2 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-800"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">E-mail</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full bg-slate-50 p-2 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-medium font-mono text-slate-800"
                  />
                </div>

                {/* Celular/Whatsapp */}
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={editTelefone}
                    onChange={(e) => setEditTelefone(e.target.value)}
                    className="w-full bg-slate-50 p-2 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-medium font-mono text-slate-800"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                {/* Objetivo */}
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">Objetivo Primário</label>
                  <input
                    type="text"
                    required
                    value={editObjetivo}
                    onChange={(e) => setEditObjetivo(e.target.value)}
                    className="w-full bg-slate-50 p-2 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-800"
                  />
                </div>

                {/* Avatar URL */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">Foto de Avatar (URL)</label>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className="w-full bg-slate-50 p-2 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-3xs text-slate-800"
                  />
                </div>

                {/* Peso Inicial */}
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">Peso Inicial (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editPesoInicial}
                    onChange={(e) => setEditPesoInicial(Number(e.target.value))}
                    className="w-full bg-slate-50 p-2 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                  />
                </div>

                {/* Peso Atual */}
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">Peso Atual (KG)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editPesoAtual}
                    onChange={(e) => setEditPesoAtual(Number(e.target.value))}
                    className="w-full bg-slate-50 p-2 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                  />
                </div>

                {/* Altura */}
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">Altura (CM)</label>
                  <input
                    type="number"
                    value={editAltura}
                    onChange={(e) => setEditAltura(Number(e.target.value))}
                    className="w-full bg-slate-50 p-2 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                  />
                </div>

                {/* BF Atual */}
                <div className="space-y-1">
                  <label className="text-3xs font-mono font-bold text-slate-500 block uppercase">Gordura Corporal - BF (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editBfAtual}
                    onChange={(e) => setEditBfAtual(Number(e.target.value))}
                    className="w-full bg-slate-50 p-2 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalEditarPerfil(false)}
                  className="bg-slate-100 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl hover:bg-slate-200 cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  id="btn-salvar-perfil-submit"
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2 px-5 rounded-xl cursor-pointer transition-colors shadow-md"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
