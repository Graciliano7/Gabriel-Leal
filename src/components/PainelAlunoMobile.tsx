import React, { useState } from "react";
import { jsPDF } from "jspdf";
import { 
  Aluno, 
  Dieta, 
  Treino, 
  Cardio, 
  Suplemento, 
  CheckIn, 
  FotoEvolucao, 
  Mensagem 
} from "../types";
import { 
  Apple, 
  Dumbbell, 
  CheckCircle2, 
  Camera, 
  Droplet, 
  Scale, 
  Calendar, 
  Send, 
  Lock, 
  Compass, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  AlertCircle, 
  Hourglass, 
  Star,
  Users,
  MessageSquare,
  Flame,
  User,
  Activity,
  X,
  Folder,
  UploadCloud,
  FileText,
  Trash2,
  Download,
  Eye,
  Video
} from "lucide-react";

interface PainelAlunoMobileProps {
  aluno: Aluno;
  dieta: Dieta | undefined;
  treino: Treino | undefined; // treino do dia
  cardio: Cardio | undefined;
  suplementos: Suplemento[];
  checkins: CheckIn[];
  fotos: FotoEvolucao[];
  aguaConsumida: number;
  onAtualizarRefeicao: (alunoId: string, refeicaoId: string, concluida: boolean, fotoUrl?: string) => void;
  onRegistrarAgua: (alunoId: string, ml: number) => void;
  onResetarAgua: (alunoId: string) => void;
  onAtualizarExercicio: (alunoId: string, treinoId: string, exercicioId: string, concluido: boolean) => void;
  onMarcarTreinoConcluido: (alunoId: string, treinoId: string, concluido: boolean) => void;
  onRegistrarCardio: (alunoId: string, minutos: number, intensidade: "baixa" | "moderada" | "alta") => void;
  onResetarCardioHoje: (alunoId: string) => void;
  onAtualizarSuplemento: (alunoId: string, suplementoId: string, concluido: boolean) => void;
  onResponderCheckIn: (
    alunoId: string, 
    peso: number, 
    rendimento: number, 
    sono: number, 
    disposicao: number, 
    estresse: number, 
    fome: number, 
    comentarios: string
  ) => void;
  onAdicionarFoto?: (
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
  onExcluirFoto?: (id: string) => void;
}

export default function PainelAlunoMobile({
  aluno,
  dieta,
  treino,
  cardio,
  suplementos,
  checkins,
  fotos,
  aguaConsumida,
  onAtualizarRefeicao,
  onRegistrarAgua,
  onResetarAgua,
  onAtualizarExercicio,
  onMarcarTreinoConcluido,
  onRegistrarCardio,
  onResetarCardioHoje,
  onAtualizarSuplemento,
  onResponderCheckIn,
  onAdicionarFoto,
  onExcluirFoto
}: PainelAlunoMobileProps) {
  const [secaoAtiva, setSecaoAtiva] = useState<"dieta" | "treino" | "rotina" | "midias">("dieta");
  
  // States Locais
  const [modalCheckin, setModalCheckin] = useState(false);
  const [chkPeso, setChkPeso] = useState(aluno.pesoAtual);
  const [chkRendimento, setChkRendimento] = useState(5);
  const [chkSono, setChkSono] = useState(4);
  const [chkDisposicao, setChkDisposicao] = useState(4);
  const [chkEstresse, setChkEstresse] = useState(2);
  const [chkFome, setChkFome] = useState(3);
  const [chkComentarios, setChkComentarios] = useState("");

  const [modalFotoRef, setModalFotoRef] = useState<{ aberta: boolean; refId?: string }>({ aberta: false });
  const [fotoRefUrl, setFotoRefUrl] = useState("");

  // Controladores de Cardio
  const [cardioMinutos, setCardioMinutos] = useState(cardio?.duracaoAlvo || 30);
  const [cardioIntensidade, setCardioIntensidade] = useState<"baixa" | "moderada" | "alta">("moderada");

  // Alimentos e Macros consumidos hoje
  const refeicoes = dieta?.refeicoes || [];
  const refeicoesConcluidas = refeicoes.filter(r => r.concluida).length;
  
  // Check-in mensal pendente?
  const checkinPendente = checkins.find(c => c.alunoId === aluno.id && !c.respondido);

  const handleSimularFotoRefeicao = (refeicaoId: string) => {
    // Simula o registro de foto com deliciosos pratos de Unsplash saudáveis
    const pratosSaudaveis = [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400"
    ];
    const fotoMock = pratosSaudaveis[Math.floor(Math.random() * pratosSaudaveis.length)];
    onAtualizarRefeicao(aluno.id, refeicaoId, true, fotoMock);
    alert("Prato saudável registrado com foto e enviado ao Personal com sucesso!");
  };

  const handleSubmeterCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    onResponderCheckIn(
      aluno.id,
      Number(chkPeso),
      chkRendimento,
      chkSono,
      chkDisposicao,
      chkEstresse,
      chkFome,
      chkComentarios
    );
    alert("Check-in Semanal respondido com sucesso! Seu score de adesão foi recalculado.");
    setModalCheckin(false);
  };

  const handleSalvarCardio = () => {
    onRegistrarCardio(aluno.id, Number(cardioMinutos), cardioIntensidade);
    alert(`Cardio de ${cardioMinutos} minutos registrado com sucesso!`);
  };

  const handleExportarPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const dataAtual = new Date().toLocaleDateString("pt-BR");

      // 1. BANNER CABEÇALHO COM ESTILO GL BRANQUILHADO/ESCURO
      doc.setFillColor(12, 13, 15);
      doc.rect(15, 12, 180, 36, "F");

      // Linhas verticais do halter
      doc.setFillColor(31, 41, 55);
      doc.rect(21, 16, 2.8, 28, "F");
      doc.rect(38, 16, 2.8, 28, "F");

      // Sigla "GL"
      doc.setTextColor(241, 245, 249);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.text("GL", 24, 35);

      // Nome: Gabriel Leal
      doc.setTextColor(14, 115, 61);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("GABRIEL LEAL", 50, 27);

      // Slogan
      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("P E R S O N A L   T R A I N E R", 50, 34);

      // Faixa Decorativa Verde
      doc.setFillColor(16, 185, 129);
      doc.rect(50, 37, 42, 0.8, "F");

      // Data e Identificadores à direita
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.text(`Emitido: ${dataAtual}`, 155, 24);
      doc.text("Área do Assessorado", 155, 28.5);
      doc.text("Plano de Alta Performance VIP", 155, 33);

      // 2. DADOS DO ALUNO
      let y = 58;
      doc.setTextColor(15, 23, 42); // slate-900
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("RELATÓRIO DE EVOLUÇÃO, DIETA & TREINO", 15, y);

      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.4);
      doc.line(15, y + 2, 195, y + 2);

      y += 8;
      doc.setFontSize(8.5);
      
      doc.setFont("helvetica", "bold");
      doc.text("Assessorado:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(aluno.nome, 38, y);

      doc.setFont("helvetica", "bold");
      doc.text("Meta Primária:", 110, y);
      doc.setFont("helvetica", "normal");
      doc.text(aluno.objetivo, 132, y);

      y += 5.5;
      doc.setFont("helvetica", "bold");
      doc.text("Altura Cadastral:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${aluno.altura} cm`, 38, y);

      doc.setFont("helvetica", "bold");
      doc.text("Adesão Geral:", 110, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${aluno.scoreAdesao}% de Constância`, 132, y);

      y += 5.5;
      doc.setFont("helvetica", "bold");
      doc.text("Peso Inicial:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${aluno.pesoInicial} kg`, 38, y);

      doc.setFont("helvetica", "bold");
      doc.text("Peso Atualizado:", 110, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${aluno.pesoAtual} kg`, 132, y);

      // Diferencial de Peso
      const pesoPerdido = (aluno.pesoInicial - aluno.pesoAtual).toFixed(1);
      y += 5.5;
      doc.setFont("helvetica", "bold");
      doc.text("Evolução Corporal:", 15, y);
      doc.setFont("helvetica", "normal");
      const evText = Number(pesoPerdido) > 0 
        ? `Eliminou -${pesoPerdido} kg desde o início da assessoria (${aluno.pesoInicial}kg -> ${aluno.pesoAtual}kg).`
        : Number(pesoPerdido) < 0 
          ? `Adquiriu +${Math.abs(Number(pesoPerdido))} kg de massa/densidade (${aluno.pesoInicial}kg -> ${aluno.pesoAtual}kg).`
          : `Manteve peso estável em ${aluno.pesoAtual} kg de acordo com as prescrições biológicas.`;
      doc.text(evText, 38, y);

      // 3. DIETA E REFEIÇÕES DE ROTINA
      y += 10;
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("ROTEIRO NUTRICIONAL DIÁRIO (DIETA PRESCRITA)", 15, y);
      
      doc.line(15, y + 1.5, 195, y + 1.5);
      y += 6;

      if (!dieta || !dieta.refeicoes || dieta.refeicoes.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.text("Nenhuma dieta ou plano alimentar foi registrado até o momento.", 15, y);
        y += 6;
      } else {
        // Exibe macros totais aproximados
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.text(`Calorias Diárias: ${dieta.caloriasAlvo || 2100} kcal  |  Carboidratos: ${dieta.macrosAlvo?.carboidrato || 220}g  |  Proteínas: ${dieta.macrosAlvo?.proteina || 160}g  |  Gorduras: ${dieta.macrosAlvo?.gordura || 60}g`, 15, y);
        y += 6.5;

        // Lista as refeições em tabela compacta refinada
        dieta.refeicoes.forEach((ref) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }

          doc.setFillColor(248, 250, 252);
          doc.rect(15, y - 4, 180, 5 + (ref.alimentos.length * 4), "F");
          doc.setDrawColor(241, 245, 249);
          doc.rect(15, y - 4, 180, 5 + (ref.alimentos.length * 4), "D");

          doc.setTextColor(9, 79, 43);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.text(`${ref.nome} (${ref.horario})`, 18, y);

          doc.setTextColor(51, 65, 85);
          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);
          
          let alimentosStr = ref.alimentos.map(al => `${al.quantidade}x ${al.nome} (${al.proteina || 0}g Prot, ${al.carboidrato || 0}g Carb)`).join(", ");
          if (alimentosStr.length > 95) {
            alimentosStr = alimentosStr.substring(0, 95) + "...";
          }
          doc.text(alimentosStr, 70, y);

          y += 6;
        });
      }

      // 4. SUPLEMENTOS E FÁRMACOS
      y += 5;
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setDrawColor(226, 232, 240);
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("SUPLEMENTOS INTEGRADORES & FÁRMACOS DE PROTOCOLO", 15, y);
      doc.line(15, y + 1.5, 195, y + 1.5);
      y += 6;

      if (suplementos.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.text("Sem suplementação ou fármacos ativos no momento.", 15, y);
        y += 6;
      } else {
        suplementos.forEach(s => {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }
          doc.setTextColor(47, 55, 78);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.text(`■ ${s.nome}`, 18, y);
          
          doc.setTextColor(100, 116, 139);
          doc.setFont("helvetica", "normal");
          doc.text(`Dosagem/Uso: ${s.dosagem} (${s.horario})`, 65, y);
          y += 5;
        });
      }

      // 5. TREINO SEMANAL DA ASSESSORIA
      y += 5;
      if (y > 255) {
        doc.addPage();
        y = 20;
      }

      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("PROGRAMA DE TREINO & EXERCÍCIOS COORDENADOS", 15, y);
      doc.line(15, y + 1.5, 195, y + 1.5);
      y += 6;

      if (!treino || !treino.exercicios || treino.exercicios.length === 0) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8.5);
        doc.text("Nenhum exercício ou treino do dia foi prescrito.", 15, y);
        y += 6;
      } else {
        doc.setTextColor(14, 115, 61);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8.5);
        doc.text(`Ficha Ativa: [${treino.nomeDivisao}]`, 15, y);
        y += 5.5;

        treino.exercicios.forEach((ex, idx) => {
          if (y > 275) {
            doc.addPage();
            y = 20;
          }

          doc.setTextColor(51, 65, 85);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(8);
          doc.text(`${idx + 1}. ${ex.nome}`, 18, y);

          doc.setFont("helvetica", "normal");
          doc.setTextColor(100, 116, 139);
          doc.text(`Ajuste: ${ex.series} séries x ${ex.repeticoes} | Carga: ${ex.carga || "N/A"} | Descanso: ${ex.descanso || "60s"}`, 105, y);
          y += 5;
        });
      }

      // 6. CHANCELA DA ASSESSORIA
      if (y > 240) {
        doc.addPage();
        y = 20;
      }

      y += 10;
      doc.setFillColor(240, 253, 244);
      doc.rect(15, y, 180, 24, "F");
      doc.setDrawColor(187, 247, 208);
      doc.rect(15, y, 180, 24, "D");

      doc.setTextColor(9, 79, 43);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("CHANCELA DE CONSULTORIA PREMIUM - GABRIEL LEAL", 20, y + 6);

      doc.setTextColor(21, 115, 59);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      const conselho = "Este documento resume sua prescrição de nutrição e de treino recomendados pelo seu mentor Gabriel Leal. Mantenha constância cirúrgica de registramento diário para garantir a calibração precisa de seus ganhos!";
      const splitConselho = doc.splitTextToSize(conselho, 170);
      doc.text(splitConselho, 20, y + 11);

      // Baixar PDF
      const nomeCompletoStr = `Evolucao_GabrielLeal_${aluno.nome.replace(/\s+/g, "_")}.pdf`;
      doc.save(nomeCompletoStr);
      alert("Seu relatório consolidado PDF foi gerado e baixado com sucesso!");

    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Erro ao formatar PDF de exportação.");
    }
  };

  return (
    <div className="flex justify-center py-4 bg-slate-100 min-h-screen">
      {/* FRAME CELULAR MOCKUP */}
      <div className="w-full max-w-sm bg-slate-50 border border-slate-205 rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative h-[810px]">
        {/* Notch do celular */}
        <div className="bg-slate-950 h-5 w-full shrink-0 flex items-center justify-between px-6 text-white text-[10px] font-mono z-20">
          <span>19:42</span>
          <div className="w-16 h-4 bg-black rounded-b-xl absolute left-1/2 -translate-x-1/2 top-0"></div>
          <div className="flex items-center gap-1">
            <Flame className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
            <span>98%</span>
          </div>
        </div>

        {/* Header Superior App Aluno */}
        <div className="bg-slate-900 text-white p-4 pb-5 pt-3 shrink-0 flex items-center justify-between gap-2 border-b border-emerald-500/10">
          <div className="flex items-center gap-2.5">
            <img 
              src={aluno.avatar} 
              alt={aluno.nome} 
              className="w-10 h-10 rounded-full object-cover border border-emerald-500/50 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-3xs text-slate-400 font-mono block">ÁREA DO ALUNO</span>
              <span className="text-xs font-bold text-white block">{aluno.nome.split(" ")[0]} {aluno.nome.split(" ").slice(-1)[0]}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-4xs font-mono text-slate-400 block uppercase font-bold tracking-wider">Adesão Diária</span>
            <span className={`text-xs font-bold font-mono ${
              aluno.scoreAdesao >= 75 ? "text-emerald-400" : aluno.scoreAdesao >= 55 ? "text-amber-400" : "text-rose-400"
            }`}>{aluno.scoreAdesao}%</span>
          </div>
        </div>

        {/* Banner Pendência de Check-in */}
        {checkinPendente && (
          <div 
            id="banner-checkin-pendente"
            onClick={() => {
              setChkPeso(aluno.pesoAtual);
              setModalCheckin(true);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 py-2.5 px-4 font-bold flex items-center justify-between text-2xs cursor-pointer shadow-md select-none shrink-0"
          >
            <div className="flex items-center gap-1.5 font-medium leading-none">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Seu Check-In Semanal de Medidas e Fotos está pendente!</span>
            </div>
            <span className="bg-slate-950 text-white py-0.5 px-1.5 rounded text-[8px] font-mono font-black uppercase">Responder</span>
          </div>
        )}

        {/* Scrollable Container do Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 focus:outline-none">
          
          {/* SEÇÃO 1: DIETA DO DIA */}
          {secaoAtiva === "dieta" && (
            <div className="space-y-4">
              {/* Card Premium de Exportação de PDF */}
              <div id="card-baixar-pdf-aluno" className="bg-slate-900 border border-emerald-500/25 p-4 rounded-3xl relative overflow-hidden flex items-center justify-between gap-3 shadow-md">
                <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="space-y-1 relative z-10">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-430 animate-pulse animate-bounce" />
                    <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-widest">Performance Vip</span>
                  </div>
                  <h4 className="text-2xs font-extrabold text-white">Relatório Integrado</h4>
                  <p className="text-[9px] text-slate-400">PDF completo com evolução, dieta e treino.</p>
                </div>
                <button
                  id="btn-aluno-baixar-pdf"
                  onClick={handleExportarPDF}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-3xs uppercase py-2 px-3 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Download className="w-3 h-3" />
                  PDF Ficha
                </button>
              </div>

              {/* Água Tracker */}
              <div className="bg-white p-4 rounded-3xl border border-slate-150 shadow-3xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500">
                    <Droplet className="w-6 h-6 fill-sky-200" />
                  </div>
                  <div>
                    <span className="text-2xs text-slate-400 block font-mono">Registro de Hidratação</span>
                    <span className="text-md font-bold text-slate-800 block font-mono">{(aguaConsumida / 1000).toFixed(2)} / 3.0 Litros</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    id="btn-add-agua-250"
                    onClick={() => onRegistrarAgua(aluno.id, 250)}
                    className="bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold text-2xs py-1.5 px-2.5 rounded-lg active:scale-90 transition-all cursor-pointer"
                  >
                    +250ml
                  </button>
                  <button
                    id="btn-reset-agua"
                    onClick={() => onResetarAgua(aluno.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 active:scale-95 transition-all text-3xs font-mono font-semibold"
                    title="Resetar Água de Hoje"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Lista de refeições da Dieta */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider font-mono">Sua Dieta de Hoje</span>
                  <span className="text-3xs font-bold font-mono text-slate-400">{refeicoesConcluidas} de {refeicoes.length} Refeições</span>
                </div>

                {refeicoes.map(ref => (
                  <div 
                    id={`ref-box-aluno-${ref.id}`}
                    key={ref.id} 
                    className={`bg-white rounded-2xl border p-4.5 shadow-3xs transition-all space-y-3.5 relative overflow-hidden ${
                      ref.concluida ? "border-emerald-250 bg-emerald-50/15" : "border-slate-150"
                    }`}
                  >
                    {/* Tarjeta de concluído */}
                    {ref.concluida && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-mono font-black text-[8px] uppercase py-0.5 px-3 rounded-bl">
                        Concluída às {ref.enviadoAs || "12:00"}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5 max-w-[70%]">
                        <span className="text-2xs font-bold block text-slate-900">{ref.nome}</span>
                        <span className="text-3xs text-slate-400 font-bold block font-mono">Sugestão: {ref.horario}h</span>
                      </div>

                      <div className="flex gap-1">
                        {/* Se não concluída, permite simular foto ou dar check direto */}
                        <button
                          id={`btn-foto-refeicao-${ref.id}`}
                          onClick={() => handleSimularFotoRefeicao(ref.id)}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                            ref.fotoUrl 
                              ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                              : "bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-100"
                          }`}
                          title="Enviar foto para o Personal"
                        >
                          <Camera className="w-4 h-4" />
                        </button>

                        <button
                          id={`btn-check-refeicao-${ref.id}`}
                          onClick={() => onAtualizarRefeicao(aluno.id, ref.id, !ref.concluida)}
                          className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                            ref.concluida 
                              ? "bg-emerald-550 text-white border-emerald-500" 
                              : "bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Alimentos detalhados */}
                    <div className="border-t border-slate-100 pt-2.5 divide-y divide-slate-100">
                      {ref.alimentos.map((alimento, fIdx) => (
                        <div key={fIdx} className="py-2.5 space-y-1">
                          <div className="flex justify-between items-center text-2xs font-medium">
                            <span className="text-slate-750 font-bold">{alimento.nome}</span>
                            <span className="text-slate-400 font-mono text-[10px]">{alimento.quantidade}</span>
                          </div>
                          {(alimento as any).substituicao && (
                            <p className="text-[10px] leading-relaxed text-slate-500 bg-slate-50 border border-slate-150 rounded-lg p-2 font-medium flex items-start gap-1.5 matches-taco">
                              <span className="font-black text-emerald-600 shrink-0 uppercase tracking-wider text-[9px]">Opção de Substituição:</span>
                              {(alimento as any).substituicao}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Miniaturiza a foto anexada */}
                    {ref.fotoUrl && (
                      <div className="h-28 rounded-xl overflow-hidden bg-slate-200 max-w-sm mt-1">
                        <img 
                          src={ref.fotoUrl} 
                          alt="Refeição consumida" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO 2: TREINO DO DIA */}
          {secaoAtiva === "treino" && (
            <div className="space-y-4">
              {treino ? (
                <div className="space-y-4">
                  {/* Divisão e Botão Concluir Treino Integral */}
                  <div className="bg-slate-900 text-white rounded-3xl p-4 border border-slate-850 shadow-md">
                    <span className="text-3xs text-emerald-400 font-bold uppercase block font-mono">Divisão Recomendada</span>
                    <h3 className="text-xs font-bold text-white block mt-0.5 leading-tight">{treino.nomeDivisao}</h3>
                    
                    <button
                      id="btn-aluno-marcar-treino-todo"
                      onClick={() => onMarcarTreinoConcluido(aluno.id, treino.id, !treino.concluidoHoje)}
                      className={`w-full text-center py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer mt-3.5 ${
                        treino.concluidoHoje 
                          ? "bg-emerald-600 text-white hover:bg-rose-600" 
                          : "bg-emerald-500 text-slate-950 font-extrabold hover:bg-emerald-400"
                      }`}
                    >
                      {treino.concluidoHoje ? "Desfazer Treino Completo ✕" : "Concluir Treino de Hoje! 💪"}
                    </button>
                  </div>

                  {/* Exercícios */}
                  <div className="space-y-3">
                    <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider font-mono px-1 block">Rotina de Exercícios</span>

                    {treino.exercicios.map(ex => (
                      <div 
                        id={`ex-card-aluno-${ex.id}`}
                        key={ex.id} 
                        onClick={() => onAtualizarExercicio(aluno.id, treino.id, ex.id, !ex.concluido)}
                        className={`bg-white rounded-2xl border p-4 shadow-3xs hover:border-slate-350 transition-all cursor-pointer flex items-center justify-between select-none ${
                          ex.concluido ? "border-emerald-200 bg-emerald-50/15" : "border-slate-150"
                        }`}
                      >
                        <div className="space-y-1 max-w-[80%]">
                          <span className={`text-2xs font-bold block ${ex.concluido ? "line-through text-slate-400" : "text-slate-800"}`}>
                            {ex.nome}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block font-semibold">
                            {ex.series} séries × {ex.repeticoes} • Carga: <strong className="text-emerald-700 font-extrabold font-mono">{ex.carga}</strong>
                          </span>
                        </div>

                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          ex.concluido ? "bg-emerald-500 text-white border-emerald-600" : "border-slate-300 bg-slate-50"
                        }`}>
                          {ex.concluido && <CheckCircle2 className="w-4 h-4 animate-scale" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl p-6 shadow-3xs">
                  <Dumbbell className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs font-medium mt-3">Nenhum treino prescrito para você hoje. Excelente dia de descanso!</p>
                </div>
              )}
            </div>
          )}

          {/* SEÇÃO 3: ROTINA & CARDIO & SUPLEMENTAÇÃO */}
          {secaoAtiva === "rotina" && (
            <div className="space-y-5">
              
              {/* CARDIO REGISTRATION */}
              <div className="bg-white p-4.5 rounded-3xl border border-slate-150 shadow-3xs space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-2xs font-bold text-slate-900 leading-tight">Registrar Atividade Cardio</h4>
                    <p className="text-3xs text-slate-400 font-mono">Meta Semanal: {cardio?.duracaoAlvo || 40}min × {cardio?.frequenciaSemanal || 4}x (Realizado: {cardio?.frequenciaRealizada || 0}x)</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-2xs pt-2">
                  <div className="space-y-1 col-span-2">
                    <label className="text-3xs font-mono font-bold text-slate-405 uppercase block">DURAÇÃO HOJE (MINUTOS)</label>
                    <input
                      id="cardio-input-minutos"
                      type="number"
                      required
                      value={cardioMinutos}
                      onChange={(e) => setCardioMinutos(Number(e.target.value))}
                      className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 w-full focus:outline-none focus:border-emerald-500 font-mono text-center font-bold text-xs"
                    />
                  </div>
                  
                  <div className="space-y-1 col-span-2">
                    <label className="text-3xs font-mono font-bold text-slate-405 uppercase block">INTENSIDADE REPT</label>
                    <select
                      id="cardio-select-intensidade"
                      value={cardioIntensidade}
                      onChange={(e) => setCardioIntensidade(e.target.value as any)}
                      className="bg-slate-50 p-1.5 rounded-lg border border-slate-200 w-full focus:outline-none focus:border-emerald-500 font-bold"
                    >
                      <option value="baixa">Baixa (Caminhada leve)</option>
                      <option value="moderada">Moderada (Corrida leve / Elíptico)</option>
                      <option value="alta">Alta (Intervalado / Bike Pesada)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 font-mono">
                  <button
                    id="btn-aluno-registrar-cardio"
                    onClick={handleSalvarCardio}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-2xs py-2 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Registrar Cardio
                  </button>
                  <button
                    onClick={() => {
                      onResetarCardioHoje(aluno.id);
                      alert("Registro de cardio de hoje limpo.");
                    }}
                    className="text-rose-500 hover:text-rose-450 text-3xs font-medium px-2"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              {/* SUPLEMENTAÇÃO DIÁRIA & ERGOGÊNICOS */}
              <div className="space-y-2.5">
                <span className="text-2xs font-bold text-slate-500 uppercase tracking-wider font-mono px-1 block">Rotina de Suplementos, Hormônios & Fármacos</span>

                {suplementos.filter(s => s.alunoId === aluno.id).map(sup => {
                  const isHormonio = sup.categoria === "hormonio";
                  const isFarmaco = sup.categoria === "farmaco";
                  
                  let borderStyle = "border-slate-150";
                  let bgAccent = "bg-white";
                  let tagText = "Suplemento";
                  let tagStyle = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  
                  if (sup.concluidoHoje) {
                    borderStyle = "border-emerald-200 bg-emerald-50/15";
                  } else if (isHormonio) {
                    borderStyle = "border-rose-200";
                    bgAccent = "bg-rose-50/20";
                    tagText = "Hormônio / Ergogênico 🧪";
                    tagStyle = "bg-rose-100 text-rose-700 border-rose-200";
                  } else if (isFarmaco) {
                    borderStyle = "border-amber-200";
                    bgAccent = "bg-amber-50/20";
                    tagText = "Clínico / Suporte 🩺";
                    tagStyle = "bg-amber-100 text-amber-800 border-amber-200";
                  } else {
                    tagText = "Suplemento 💊";
                  }

                  return (
                    <div 
                      id={`sup-box-aluno-${sup.id}`}
                      key={sup.id} 
                      onClick={() => onAtualizarSuplemento(aluno.id, sup.id, !sup.concluidoHoje)}
                      className={`rounded-2xl border p-4 shadow-3xs cursor-pointer hover:border-slate-350 transition-all flex items-center justify-between select-none ${bgAccent} ${borderStyle}`}
                    >
                      <div className="space-y-1 max-w-[75%]">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className={`text-2xs font-bold ${sup.concluidoHoje ? "line-through text-slate-400" : "text-slate-800"}`}>
                            {sup.nome}
                          </span>
                          {!sup.concluidoHoje && (
                            <span className={`text-[8px] font-extrabold tracking-wider px-1.5 py-0.5 rounded-full border ${tagStyle}`}>
                              {tagText}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono text-slate-405 block">Dosagem: {sup.dosagem} • Horário: {sup.horario}</span>
                      </div>

                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        sup.concluidoHoje ? "bg-emerald-500 text-white border-emerald-600" : "border-slate-300 bg-slate-50"
                      }`}>
                        {sup.concluidoHoje && <CheckCircle2 className="w-4 h-4 animate-scale" />}
                      </div>
                    </div>
                  );
                })}

                {suplementos.filter(s => s.alunoId === aluno.id).length === 0 && (
                  <div className="py-6 text-center text-slate-400 bg-white border border-slate-200 rounded-3xl p-4 text-xs">Nenhum suplemento ou fármaco cadastrado.</div>
                )}
              </div>
            </div>
          )}

          {/* SEÇÃO 4: CENTRO DE MÍDIAS DO ALUNO */}
          {secaoAtiva === "midias" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 leading-none">
                  <Folder className="w-4 h-4 text-rose-500" />
                  Mídias e Evolução Física
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">Veja ou envie fotos, vídeos de execuções ou exames.</p>
              </div>

              {/* Mobile Uploader Card */}
              {onAdicionarFoto && (
                <div className="bg-slate-800 rounded-2.5xl p-4.5 text-center border border-slate-700/80 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 bg-rose-500 h-1.5 w-full"></div>
                  <UploadCloud className="w-7 h-7 mx-auto mb-1.5 text-rose-400" />
                  <span className="text-2xs font-extrabold text-white block">Compartilhar Foto, Vídeo ou Documento</span>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Disponibilize arquivos para correção direta com seu treinador.</p>
                  
                  <label htmlFor="student-mobile-uploader" className="mt-4 inline-flex items-center gap-1.5 justify-center bg-slate-900 border border-slate-700 hover:border-slate-500 text-white text-2xs font-bold py-2 px-4 rounded-xl cursor-pointer w-full transition-colors">
                    Selecionar do Celular
                  </label>
                  <input 
                    type="file" 
                    id="student-mobile-uploader" 
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files) {
                        Array.from(e.target.files).forEach((file: any) => {
                          const reader = new FileReader();
                          const ext = file.name.split('.').pop()?.toLowerCase() || '';
                          
                          let tipo: "imagem" | "video" | "documento" | "outro" = "outro";
                          if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                            tipo = "imagem";
                          } else if (['mp4', 'mov', 'webm'].includes(ext)) {
                            tipo = "video";
                          } else if (['pdf', 'doc', 'docx'].includes(ext)) {
                            tipo = "documento";
                          }

                          reader.onload = (loadEvent) => {
                            const localBase64 = loadEvent.target?.result as string || "";
                            const sizeInMb = file.size / (1024 * 1024);
                            const sizeStr = sizeInMb >= 1 ? `${sizeInMb.toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
                            onAdicionarFoto(aluno.id, localBase64, undefined, undefined, "Sessão Aluno", tipo, file.name, sizeStr, ext);
                          };
                          reader.readAsDataURL(file);
                        });
                      }
                    }}
                  />
                </div>
              )}

              {/* Grid of Files */}
              <div className="space-y-3">
                <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest font-mono block px-1">Meus Arquivos Cadastrados</span>
                
                {fotos.filter(f => f.alunoId === aluno.id && f.fase !== "Recebido por Chat").length === 0 ? (
                  <div className="py-8 bg-slate-800 rounded-3xl text-center text-slate-400 text-xs border border-slate-700/50 block">
                    Você ainda não tem arquivos carregados neste ciclo.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {fotos.filter(f => f.alunoId === aluno.id && f.fase !== "Recebido por Chat").map(f => {
                      const isImage = !f.tipo || f.tipo === "imagem";
                      const isVideo = f.tipo === "video";
                      const isDocument = f.tipo === "documento";

                      return (
                        <div key={f.id} className="bg-slate-800 rounded-2xl p-3 border border-slate-700/60 shadow-3xs flex flex-col gap-2 relative">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black tracking-wider uppercase bg-slate-700 text-slate-350 px-2 py-0.5 rounded-md">
                              {f.fase}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] text-slate-400 font-mono">{f.data}</span>
                              {onExcluirFoto && (
                                <button
                                  onClick={() => {
                                    if (confirm("Quer remover este arquivo do seu histórico?")) {
                                      onExcluirFoto(f.id);
                                    }
                                  }}
                                  className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                                  title="Remover arquivo"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Preview container */}
                          {isImage && (
                            <div className="h-40 rounded-xl overflow-hidden bg-slate-900 border border-slate-750 relative">
                              <img 
                                src={f.frenteUrl} 
                                alt={f.nomeArquivo || "Foto Evolução"} 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {isVideo && (
                            <div className="h-44 rounded-xl overflow-hidden bg-black border border-slate-750 relative">
                              <video 
                                src={f.frenteUrl} 
                                controls 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}

                          {isDocument && (
                            <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-750">
                              <span className="p-2.5 bg-red-500/10 text-red-500 rounded-lg">
                                <FileText className="w-5 h-5" />
                              </span>
                              <div className="text-left flex-1 min-w-0">
                                <span className="text-11px font-bold text-white block truncate break-all">
                                  {f.nomeArquivo || "Documento"}
                                </span>
                                {f.tamanhoArquivo && (
                                  <span className="text-[9px] text-slate-400 font-mono block">
                                    {f.tamanhoArquivo} • {f.extensao?.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <a
                                href={f.frenteUrl}
                                download={f.nomeArquivo || "documento"}
                                className="p-2 bg-slate-800 text-white hover:text-emerald-400 rounded-lg transition-all"
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Seção Nova: Fotos Recebidas Por Chat */}
              {(() => {
                const midiasChat = fotos.filter(f => f.alunoId === aluno.id && f.fase === "Recebido por Chat");
                if (midiasChat.length === 0) return null;

                return (
                  <div className="mt-6 bg-slate-800/85 rounded-2.5xl p-4 border border-rose-500/20 shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-rose-500 animate-pulse" />
                        <span className="text-2xs font-extrabold text-white">Fotos Recebidas por Chat ({midiasChat.length})</span>
                      </div>
                      <span className="text-[8px] font-mono font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded">Integrado</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {midiasChat.map(f => {
                        const isImage = !f.tipo || f.tipo === "imagem";

                        return (
                          <div key={f.id} className="bg-slate-900 rounded-xl p-2 border border-slate-700/50 flex flex-col justify-between relative overflow-hidden group">
                            {onExcluirFoto && (
                              <button
                                onClick={() => {
                                  if (confirm("Quer remover esta mídia do seu chat?")) {
                                    onExcluirFoto(f.id);
                                  }
                                }}
                                className="absolute top-1.5 right-1.5 bg-slate-950/70 text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors z-10 cursor-pointer"
                                title="Excluir"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}

                            <div className="h-24 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-slate-850">
                              {isImage ? (
                                <img src={f.frenteUrl} alt="Chat" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <video src={f.frenteUrl} className="w-full h-full object-cover" controls playsInline />
                              )}
                            </div>

                            <div className="mt-1.5 flex items-center justify-between text-[8px] font-mono text-slate-400">
                              <span className="truncate max-w-[50px]">{f.nomeArquivo || "Mídia"}</span>
                              <span>{f.data}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* CONTROLE MODAL DO CHECK-IN SEMANAL */}
        {modalCheckin && (
          <div id="modal-responder-checkin-aluno" className="absolute inset-0 bg-slate-950/80 z-40 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-100 max-h-[95%] flex flex-col focus:outline-none">
              <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between shrink-0">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Responder Check-In Corporal</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Compartilhe peso e bem-estar físico.</p>
                </div>
                <button 
                  onClick={() => setModalCheckin(false)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmeterCheckIn} className="p-4.5 space-y-3 overflow-y-auto">
                <div className="space-y-1 text-2xs">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">PESO ATUAL REGISTRADO (KG)</label>
                  <input
                    id="chk-input-peso"
                    type="number"
                    step="0.1"
                    required
                    value={chkPeso}
                    onChange={(e) => setChkPeso(Number(e.target.value))}
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg w-full focus:border-emerald-500 focus:outline-none font-mono font-bold text-center"
                  />
                </div>

                {/* Star rating 1-5 adaptado em range simpler */}
                <div className="space-y-1 text-2xs">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">RENDIMENTO DO SEU TREINO (1-5)</label>
                  <div className="flex gap-1.5 justify-center py-1">
                    {[1,2,3,4,5].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setChkRendimento(v)}
                        className={`p-1.5 rounded-lg border text-2xs font-extrabold w-8 transition-colors cursor-pointer ${
                          chkRendimento === v ? "bg-emerald-503 text-slate-950 border-emerald-500 font-black scale-105" : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-2xs">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">QUALIDADE DO SEU SONO (1-5)</label>
                  <div className="flex gap-1.5 justify-center py-1">
                    {[1,2,3,4,5].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setChkSono(v)}
                        className={`p-1.5 rounded-lg border text-2xs font-extrabold w-8 transition-colors cursor-pointer ${
                          chkSono === v ? "bg-emerald-503 text-slate-950 border-emerald-500 font-black scale-105" : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-2xs">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase font-bold">DISPOSIÇÃO META / CANSAÇO (1-5)</label>
                  <div className="flex gap-1.5 justify-center py-1">
                    {[1,2,3,4,5].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setChkDisposicao(v)}
                        className={`p-1.5 rounded-lg border text-2xs font-extrabold w-8 transition-colors cursor-pointer ${
                          chkDisposicao === v ? "bg-emerald-503 text-slate-950 border-emerald-500 font-black scale-105" : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-2xs">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">Estresse de Rotina (1-5)</label>
                  <div className="flex gap-1.5 justify-center py-1">
                    {[1,2,3,4,5].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setChkEstresse(v)}
                        className={`p-1.5 rounded-lg border text-2xs font-extrabold w-8 transition-colors cursor-pointer ${
                          chkEstresse === v ? "bg-emerald-503 text-slate-950 border-emerald-500 font-black scale-105" : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-2xs">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">Nível de Fome de Dieta (1-5)</label>
                  <div className="flex gap-1.5 justify-center py-1">
                    {[1,2,3,4,5].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setChkFome(v)}
                        className={`p-1.5 rounded-lg border text-2xs font-extrabold w-8 transition-colors cursor-pointer ${
                          chkFome === v ? "bg-emerald-503 text-slate-950 border-emerald-500 font-black scale-105" : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-2xs">
                  <label className="text-3xs font-mono font-bold text-slate-400 block uppercase">Descreva em texto suas dúvidas ou fadigas</label>
                  <textarea
                    id="chk-input-comentarios"
                    value={chkComentarios}
                    onChange={(e) => setChkComentarios(e.target.value)}
                    placeholder="Ex: Tive um pouco de azia na quarta, mas os treinos renderam bem."
                    className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg w-full focus:border-emerald-500 focus:outline-none h-14 text-2xs font-medium"
                  />
                </div>

                <div className="pt-2 border-t border-slate-105 flex justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setModalCheckin(false)}
                    className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-1.5 px-3 rounded-lg text-2xs cursor-pointer"
                  >
                    Mudar Idéia
                  </button>
                  <button
                    id="btn-enviar-checkin-aluno"
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-1.5 px-4 rounded-lg text-2xs cursor-pointer"
                  >
                    Submeter Check-In
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Barra de Navegação Inferior Mobile-First */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 h-16 shrink-0 flex items-center justify-around px-2 text-white z-30">
          <button
            id="tab-aluno-navigation-dieta"
            onClick={() => setSecaoAtiva("dieta")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
              secaoAtiva === "dieta" ? "text-emerald-430 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Apple className="w-4.5 h-4.5" />
            <span className="text-[10px]">Nutrição</span>
          </button>

          <button
            id="tab-aluno-navigation-treino"
            onClick={() => setSecaoAtiva("treino")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
              secaoAtiva === "treino" ? "text-emerald-430 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Dumbbell className="w-4.5 h-4.5" />
            <span className="text-[10px]">Rotina</span>
          </button>

          <button
            id="tab-aluno-navigation-rotina"
            onClick={() => setSecaoAtiva("rotina")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
              secaoAtiva === "rotina" ? "text-emerald-430 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="w-4.5 h-4.5" />
            <span className="text-[10px]">Cardio/Sups</span>
          </button>

          <button
            id="tab-aluno-navigation-midias"
            onClick={() => setSecaoAtiva("midias")}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 cursor-pointer transition-colors ${
              secaoAtiva === "midias" ? "text-emerald-430 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Folder className="w-4.5 h-4.5" />
            <span className="text-[10px]">Mídias</span>
          </button>
        </div>
      </div>
    </div>
  );
}
