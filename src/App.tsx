import { useState } from "react";
import { useFitState } from "./hooks/useFitState";
import AlternadorAcesso from "./components/AlternadorAcesso";
import DashboardGestor from "./components/DashboardGestor";
import FichaAlunoGestor from "./components/FichaAlunoGestor";
import PainelAlunoMobile from "./components/PainelAlunoMobile";
import ChatMural from "./components/ChatMural";
import FinanceiroGestor from "./components/FinanceiroGestor";
import AjustesIaGlobal from "./components/AjustesIaGlobal";

import { 
  Dumbbell, 
  Shield, 
  MessageSquare, 
  DollarSign, 
  Users, 
  Trash2, 
  RefreshCw, 
  HelpCircle,
  Activity,
  Award,
  Brain
} from "lucide-react";

export default function App() {
  const {
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
    registrarFotoEvolucao,
    excluirFotoEvolucao,
    registrarNovaMedidaCompleta,
    registrarNovaPrescricaoIntegrada,
    atualizarPagamentoStatus,
    resetarBancoDeDados,
    editarAluno,
    atualizarProtocolosIa
  } = useFitState();

  // "gestor" ou id do aluno ("aluno_1", "aluno_2", "aluno_3")
  const [acessoAtual, setAcessoAtual] = useState<string>("gestor");
  
  // Controle de sub-abas do treinador: "dashboard", "mensagens", "financeiro"
  const [abaGestorAtiva, setAbaGestorAtiva] = useState<string>("dashboard");

  // Aluno focado no subpainel do Gestor (ir para a ficha dele)
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState<string | null>(null);

  // Aluno ativo na visualização do chat do gestor
  const [alunoChatAtivoId, setAlunoChatAtivoId] = useState<string>("aluno_1");

  // Recupera o objeto de aluno selecionado na ficha do Personal
  const alunoSelecionadoObj = state.alunos.find(a => a.id === alunoSelecionadoId);

  // Recupera o objeto do Aluno que está logado na visão mobile
  const alunoLogadoObj = state.alunos.find(a => a.id === acessoAtual);

  // Encontra a Dieta do aluno logado
  const dietaAlunoLogado = state.dietas.find(d => d.alunoId === acessoAtual);

  // Encontra o treino do aluno logado (está no primeiro item disponível para simplificação)
  const treinosDoAluno = state.treinos.filter(t => t.alunoId === acessoAtual);
  // Pega o treino do dia (ou o primeiro disponível)
  const treinoAlunoLogado = treinosDoAluno.length > 0 ? treinosDoAluno[0] : undefined;

  // Encontra cardio do aluno logado
  const cardioAlunoLogado = state.cardios.find(c => c.alunoId === acessoAtual);

  // Encontra suplementos do aluno logado
  const suplementosAlunoLogado = state.suplementos.filter(s => s.alunoId === acessoAtual);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-slate-950">
      
      {/* 1. SELETOR DE ACESSO GLOBAL (BARRA TOP PRETA) */}
      <AlternadorAcesso
        alunos={state.alunos}
        acessoAtual={acessoAtual}
        onMudarAcesso={(acesso) => {
          setAcessoAtual(acesso);
          if (acesso !== "gestor") {
            setAlunoSelecionadoId(null);
          }
        }}
        onResetDatabase={resetarBancoDeDados}
      />

      {/* 2. HEADER DA PLATAFORMA DE MARCA */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 shadow-3xs sticky top-0 z-10 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-slate-950 text-emerald-400 p-2.5 rounded-xl shadow-lg shadow-emerald-500/5">
              <Dumbbell className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase leading-none block">ASSESSORIA CORPORAL</span>
              <h1 className="text-lg font-black tracking-tight text-slate-950">Gabriel <span className="text-emerald-500">Leal</span></h1>
            </div>
          </div>

          {/* Se estiver no painel Gestor, exibe abas principais do ERP */}
          {acessoAtual === "gestor" && (
            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              <button
                id="tab-gestor-dashboard"
                onClick={() => {
                  setAbaGestorAtiva("dashboard");
                  setAlunoSelecionadoId(null);
                }}
                className={`flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer ${
                  abaGestorAtiva === "dashboard" && !alunoSelecionadoId
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Users className="w-4 h-4" />
                Alunos & Fichas
              </button>

              <button
                id="tab-gestor-financeiro"
                onClick={() => {
                  setAbaGestorAtiva("financeiro");
                  setAlunoSelecionadoId(null);
                }}
                className={`flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer ${
                  abaGestorAtiva === "financeiro"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Matrículas & Caixa
              </button>

              <button
                id="tab-gestor-mensagens"
                onClick={() => {
                  setAbaGestorAtiva("mensagens");
                  setAlunoSelecionadoId(null);
                }}
                className={`flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer ${
                  abaGestorAtiva === "mensagens"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Consultoria / Chats
              </button>

              <button
                id="tab-gestor-ia"
                onClick={() => {
                  setAbaGestorAtiva("ia");
                  setAlunoSelecionadoId(null);
                }}
                className={`flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer ${
                  abaGestorAtiva === "ia"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Brain className="w-4 h-4 text-emerald-500" />
                Treinar IA / Protocolos
              </button>
            </div>
          )}

          {/* Se estiver na visão do Aluno, mostra indicação de perfil */}
          {acessoAtual !== "gestor" && alunoLogadoObj && (
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 py-1.5 px-4 rounded-full border border-emerald-100 text-xs font-semibold uppercase font-mono">
              <Award className="w-4 h-4 text-emerald-500" />
              CONECTADO COMO: {alunoLogadoObj.nome.split(" ")[0]}
            </div>
          )}
        </div>
      </header>

      {/* 3. CONTEÚDO PRINCIPAL (DIFERENCIADO POR ACESSO) */}
      <main className="flex-1 w-full p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* ================= AREA DO GESTOR / PERSONAL ================= */}
          {acessoAtual === "gestor" && (
            <div className="space-y-6">
              
              {/* Se o personal está examinando a FICHA de um Aluno específico */}
              {alunoSelecionadoId && alunoSelecionadoObj ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Coluna Completa Ficha do Aluno (Dieta, Treino, Evolução...) */}
                  <div className="col-span-1 lg:col-span-2">
                    <FichaAlunoGestor
                      aluno={alunoSelecionadoObj}
                      dieta={state.dietas.find(d => d.alunoId === alunoSelecionadoId)}
                      treinos={state.treinos.filter(t => t.alunoId === alunoSelecionadoId)}
                      cardio={state.cardios.find(c => c.alunoId === alunoSelecionadoId)}
                      suplementos={state.suplementos.filter(s => s.alunoId === alunoSelecionadoId)}
                      medidas={state.medidas}
                      fotos={state.fotos}
                      checkins={state.checkins}
                      mensagens={state.mensagens}
                      onVoltar={() => setAlunoSelecionadoId(null)}
                      onPrescreverNovaIntegrada={registrarNovaPrescricaoIntegrada}
                      onAdicionarMedida={registrarNovaMedidaCompleta}
                      onAdicionarFoto={registrarFotoEvolucao}
                      onExcluirFoto={excluirFotoEvolucao}
                      onEditarAluno={editarAluno}
                      protocolosIa={state.protocolosIa}
                      onAtualizarProtocolosIa={atualizarProtocolosIa}
                    />
                  </div>

                  {/* Coluna Direita Chat com o Aluno que está sendo verificado */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider mb-2">Canal de Suporte Rápido</h4>
                      <ChatMural
                        mensagens={state.mensagens}
                        aluno={alunoSelecionadoObj}
                        perfilAtual={acessoAtual}
                        onEnviarMensagem={enviarMensagem}
                      />
                    </div>

                    <div className="bg-emerald-50 border border-emerald-150 p-4.5 rounded-3xl">
                      <h5 className="text-2xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase font-mono">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Adesão de Rotina: {alunoSelecionadoObj.scoreAdesao}%
                      </h5>
                      <p className="text-xs text-emerald-700 leading-relaxed mt-1.5 font-medium">
                        O score do {alunoSelecionadoObj.nome.split(" ")[0]} é ponderado em tempo real. Cada refeição que ele conclui ou copo d&apos;água que registra na área do Aluno, ou treino que dá check, altera este indicador instantaneamente.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Se não estiver focado em nenhuma ficha individual, renderiza a ABA GESTOR Ativa */
                <>
                  {/* Aba Dashboard Principal */}
                  {abaGestorAtiva === "dashboard" && (
                    <DashboardGestor
                      alunos={state.alunos}
                      alertas={state.alertas}
                      pagamentos={state.pagamentos}
                      onSelecionarAluno={(id) => setAlunoSelecionadoId(id)}
                      onCadastrarAluno={cadastrarAluno}
                      onMudarParaAba={(aba) => setAbaGestorAtiva(aba)}
                      onLimparNotificacao={() => {}}
                    />
                  )}

                  {/* Aba Financeira Completa */}
                  {abaGestorAtiva === "financeiro" && (
                    <FinanceiroGestor
                      pagamentos={state.pagamentos}
                      alunos={state.alunos}
                      onAtualizarPagamento={atualizarPagamentoStatus}
                    />
                  )}

                  {/* Aba Mural de Chats Gerais */}
                  {abaGestorAtiva === "mensagens" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Seletor de aluno para chat */}
                      <div className="bg-white rounded-3xl border border-slate-205 p-4.5 space-y-3 shadow-3xs">
                        <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">Conversas Recentes</h4>
                        <div className="divide-y divide-slate-100">
                          {state.alunos.map(student => (
                            <button
                              id={`select-chat-aluno-${student.id}`}
                              key={student.id}
                              onClick={() => setAlunoChatAtivoId(student.id)}
                              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-colors cursor-pointer mt-1 ${
                                student.id === alunoChatAtivoId 
                                  ? "bg-slate-900 text-white" 
                                  : "hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              <img 
                                src={student.avatar} 
                                alt={student.nome} 
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="font-bold text-xs truncate block">{student.nome}</span>
                                <span className="text-3xs block font-mono">Adesão: {student.scoreAdesao}%</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interface do Chat Ativo */}
                      <div className="col-span-1 md:col-span-2">
                        {state.alunos.find(a => a.id === alunoChatAtivoId) ? (
                          <div className="space-y-4">
                            <ChatMural
                              mensagens={state.mensagens}
                              aluno={state.alunos.find(a => a.id === alunoChatAtivoId)!}
                              perfilAtual={acessoAtual}
                              onEnviarMensagem={enviarMensagem}
                            />
                            <div className="text-2xs text-slate-400 font-medium px-2">
                              💡 <strong>Simulação de Chat:</strong> Mande uma mensagem para o aluno e mude o perfil do topo para &quot;Aluno: {state.alunos.find(a => a.id === alunoChatAtivoId)!.nome.split(" ")[0]}&quot; para logar como ele e responder o chat!
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 bg-white border rounded-3xl text-center text-slate-400 text-xs">Selecione um aluno ao lado para conversar.</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Aba Inteligência Artificial Integrada / Treinamento de Protocolos */}
                  {abaGestorAtiva === "ia" && (
                    <AjustesIaGlobal
                      alunos={state.alunos}
                      protocolosIa={state.protocolosIa}
                      onAtualizarProtocolosIa={atualizarProtocolosIa}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {/* ================= AREA DO ALUNO (MOBILE FIRST EM DESTAQUE) ================= */}
          {acessoAtual !== "gestor" && alunoLogadoObj && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start justify-center">
              
              {/* Coluna Central Celular App Aluno */}
              <div className="col-span-1 lg:col-span-2 flex justify-center">
                <PainelAlunoMobile
                  aluno={alunoLogadoObj}
                  dieta={dietaAlunoLogado}
                  treino={treinoAlunoLogado}
                  cardio={cardioAlunoLogado}
                  suplementos={suplementosAlunoLogado}
                  checkins={state.checkins}
                  fotos={state.fotos}
                  aguaConsumida={state.aguaDiaria[acessoAtual] || 0}
                  onAtualizarRefeicao={atualizarRefeicao}
                  onRegistrarAgua={registrarAgua}
                  onResetarAgua={resetarAgua}
                  onAtualizarExercicio={atualizarExercicio}
                  onMarcarTreinoConcluido={marcarTreinoConcluido}
                  onRegistrarCardio={registrarCardio}
                  onResetarCardioHoje={resetarCardioHoje}
                  onAtualizarSuplemento={atualizarSuplemento}
                  onResponderCheckIn={responderCheckIn}
                  onAdicionarFoto={registrarFotoEvolucao}
                  onExcluirFoto={excluirFotoEvolucao}
                />
              </div>

              {/* Coluna de Apoio Direito: Chat com o Coach + Informações da Prática */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase font-mono tracking-wider mb-2">Sua Central de Suporte com o Treinador</h4>
                  <ChatMural
                    mensagens={state.mensagens}
                    aluno={alunoLogadoObj}
                    perfilAtual={acessoAtual}
                    onEnviarMensagem={enviarMensagem}
                  />
                </div>

                {/* Banner de Lembrete das Metas */}
                <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-emerald-430" />
                    <h4 className="text-xs font-bold tracking-tight uppercase font-mono">Sua Ficha de Metas Diárias</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Sua pontuação de adesão atual é de <strong>{alunoLogadoObj.scoreAdesao}%</strong>. Marque as refeições, complete seus exercícios sugeridos no treino e beba água regularmente para manter seu score de excelência e acelerar seus ganhos!
                  </p>
                  <div className="text-4xs font-mono text-slate-500 mt-2">
                    PLATAFORMA FITGESTOR PRO V1.0 • PERSISTIDA NO LOCALSTORAGE
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

      {/* 4. FOOTER SIMPLES E LIMPO */}
      <footer className="bg-white border-t border-slate-100 py-4 px-6 text-center text-4xs font-mono text-slate-400 mt-auto shrink-0 uppercase tracking-wider">
        Gabriel Leal © 2026 • Projetado para Personal Trainers de Alta Performance • Banco de Dados Local Ativo
      </footer>
    </div>
  );
}
