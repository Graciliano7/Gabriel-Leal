import React, { useState } from "react";
import { Aluno, Alerta, Pagamento } from "../types";
import { 
  Users, 
  UserPlus, 
  Sparkles, 
  TrendingUp, 
  Activity, 
  AlertTriangle, 
  DollarSign, 
  Search, 
  Eye, 
  MessageSquare, 
  Plus, 
  ChevronRight, 
  Calendar,
  X,
  Target,
  ArrowRight,
  UploadCloud
} from "lucide-react";

interface DashboardGestorProps {
  alunos: Aluno[];
  alertas: Alerta[];
  pagamentos: Pagamento[];
  onSelecionarAluno: (id: string) => void;
  onCadastrarAluno: (aluno: Omit<Aluno, "id" | "scoreAdesao" | "status">) => void;
  onMudarParaAba: (aba: string) => void;
  onLimparNotificacao: (id: string) => void; // simulado
}

export default function DashboardGestor({
  alunos,
  alertas,
  pagamentos,
  onSelecionarAluno,
  onCadastrarAluno,
  onMudarParaAba
}: DashboardGestorProps) {
  const [busca, setBusca] = useState("");
  const [modalNovoAluno, setModalNovoAluno] = useState(false);
  
  // States para o formulário de novo aluno
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [objetivo, setObjetivo] = useState("Hipertrofia Limpa");
  const [altura, setAltura] = useState(175);
  const [pesoInicial, setPesoInicial] = useState(80);
  const [bfAtual, setBfAtual] = useState(18);
  const [telefone, setTelefone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processarArquivoFoto(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processarArquivoFoto(e.target.files[0]);
    }
  };

  const processarArquivoFoto = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem!");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatar(base64String);
      setImagemPreview(base64String);
    };
    reader.readAsDataURL(file);
  };

  const removerFotoSelecionada = () => {
    setAvatar("");
    setImagemPreview(null);
  };

  const fecharModalNovoAluno = () => {
    setNome("");
    setEmail("");
    setObjetivo("Hipertrofia Limpa");
    setAltura(175);
    setPesoInicial(80);
    setBfAtual(18);
    setTelefone("");
    setAvatar("");
    setImagemPreview(null);
    setModalNovoAluno(false);
  };

  // Filtros de busca
  const alunosFiltrados = alunos.filter(aluno => 
    aluno.nome.toLowerCase().includes(busca.toLowerCase()) || 
    aluno.objetivo.toLowerCase().includes(busca.toLowerCase())
  );

  // KPIs
  const totalAlunos = alunos.length;
  const mediaAdesao = totalAlunos > 0 
    ? Math.round(alunos.reduce((acc, current) => acc + current.scoreAdesao, 0) / totalAlunos) 
    : 0;
  
  const alunosEmAlerta = alunos.filter(a => a.scoreAdesao < 75).length;
  
  const faturamentoPotencial = pagamentos.reduce((acc, c) => acc + c.valor, 0);
  const faturamentoPago = pagamentos.filter(p => p.status === "pago").reduce((acc, c) => acc + c.valor, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) return;

    // Use default premium Unsplash avatars if none given
    const randomAvatars = [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    ];
    const finalAvatar = avatar || randomAvatars[Math.floor(Math.random() * randomAvatars.length)];

    onCadastrarAluno({
      nome,
      email,
      avatar: finalAvatar,
      objetivo,
      dataInicio: new Date().toISOString().split("T")[0],
      pesoInicial: Number(pesoInicial),
      pesoAtual: Number(pesoInicial),
      altura: Number(altura),
      bfAtual: Number(bfAtual),
      telefone
    });

    // Reset form
    setNome("");
    setEmail("");
    setObjetivo("Hipertrofia Limpa");
    setAltura(175);
    setPesoInicial(80);
    setBfAtual(18);
    setTelefone("");
    setAvatar("");
    setImagemPreview(null);
    setModalNovoAluno(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Painel do Treinador</h1>
          <p className="text-slate-400 text-sm mt-1">Gerencie a saúde física, adesão e evolução da sua equipe de alunos em tempo real.</p>
        </div>
        <button
          id="btn-abrir-cadastro-aluno"
          onClick={() => setModalNovoAluno(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm py-2.5 px-5 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Novo Aluno
        </button>
      </div>

      {/* Grid de KPIs - Bento Box premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div id="kpi-total-alunos" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400 block font-medium uppercase tracking-wider">Total de Alunos</span>
            <span className="text-3xl font-bold tracking-tight text-slate-900">{totalAlunos}</span>
            <span className="text-xs text-slate-500 block">Ativos na plataforma</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <Users className="w-6 h-6 text-slate-700" />
          </div>
        </div>

        {/* KPI 2 */}
        <div id="kpi-adesao" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 block font-medium uppercase tracking-wider">Adesão Média</span>
              <span className="text-3xl font-bold tracking-tight text-slate-900">{mediaAdesao}%</span>
            </div>
            <div className={`p-3 rounded-xl border ${
              mediaAdesao >= 75 
                ? "bg-emerald-50 border-emerald-100 text-emerald-600" 
                : mediaAdesao >= 55 
                ? "bg-amber-50 border-amber-100 text-amber-600" 
                : "bg-rose-50 border-rose-100 text-rose-600"
            }`}>
              <Activity className="w-6 h-6" />
            </div>
          </div>
          {/* Barra de progresso */}
          <div className="mt-3">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  mediaAdesao >= 75 ? "bg-emerald-500" : mediaAdesao >= 55 ? "bg-amber-500" : "bg-rose-500"
                }`}
                style={{ width: `${mediaAdesao}%` }}
              ></div>
            </div>
            <span className="text-2xs text-slate-400 mt-1 block">Reflete dieta, treinos e cardios gerados</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div id="kpi-alertas" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400 block font-medium uppercase tracking-wider">Foco / Inconsistentes</span>
            <span className={`text-3xl font-bold tracking-tight ${alunosEmAlerta > 0 ? "text-amber-600" : "text-slate-900"}`}>{alunosEmAlerta} Aluno{alunosEmAlerta !== 1 ? "s" : ""}</span>
            <span className="text-xs text-rose-500 block font-medium">Precisam de intervenção</span>
          </div>
          <div className={`p-3 rounded-xl border ${alunosEmAlerta > 0 ? "bg-amber-50 border-amber-100" : "bg-slate-50 border-slate-100"}`}>
            <AlertTriangle className={`w-6 h-6 ${alunosEmAlerta > 0 ? "text-amber-500" : "text-slate-400"}`} />
          </div>
        </div>

        {/* KPI 4 */}
        <div id="kpi-financeiro" className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-mono text-slate-400 block font-medium uppercase tracking-wider">Faturamento (Este Mês)</span>
              <span className="text-3xl font-bold tracking-tight text-emerald-600">R$ {faturamentoPago}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-emerald-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-2xs text-slate-500">
            <span>Meta Alvo: R$ {faturamentoPotencial}</span>
            <span className="bg-emerald-50 text-emerald-700 py-0.5 px-1.5 rounded font-mono font-bold">
              {faturamentoPotencial > 0 ? Math.round((faturamentoPago / faturamentoPotencial) * 100) : 0}% Pago
            </span>
          </div>
        </div>
      </div>

      {/* Alertas Inteligentes */}
      {alertas.length > 0 && (
        <div id="container-alertas-inteligentes" className="bg-slate-50 border border-slate-150 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-bold text-slate-905 uppercase tracking-wide">Alertas Rápidos de Evolução & Rotina</h2>
            </div>
            <span className="text-2xs font-bold text-rose-600 bg-rose-50 py-0.5 px-2 rounded-full font-mono">
              {alertas.length} {alertas.length === 1 ? "NOTIFICAÇÃO" : "NOTIFICAÇÕES"}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alertas.map(alerta => (
              <div 
                id={`card-alerta-${alerta.id}`}
                key={alerta.id} 
                className={`flex gap-3 p-3.5 rounded-xl border bg-white shadow-3xs hover:shadow-2xs transition-all ${
                  alerta.gravidade === "perigo" 
                    ? "border-l-4 border-l-rose-500 border-rose-105" 
                    : alerta.gravidade === "alerta" 
                    ? "border-l-4 border-l-amber-500 border-amber-105" 
                    : "border-l-4 border-l-sky-500 border-sky-105"
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span 
                      onClick={() => onSelecionarAluno(alerta.alunoId)}
                      className="text-xs font-bold hover:underline hover:text-emerald-600 cursor-pointer"
                    >
                      {alerta.alunoNome}
                    </span>
                    <span className="text-2xs text-slate-400 font-mono">hoje</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">{alerta.mensagem}</p>
                </div>
                <button
                  onClick={() => onSelecionarAluno(alerta.alunoId)}
                  className="self-center bg-slate-50 hover:bg-emerald-500 hover:text-slate-950 p-1.5 rounded-lg border border-slate-100 transition-all text-slate-400 cursor-pointer"
                  title="Ir para a ficha do Aluno"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de Alunos e Pesquisa */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="input-busca-alunos"
              type="text"
              placeholder="Pesquisar por aluno, objetivo física..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full bg-slate-50 max-w-sm pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-400 font-mono">FILTRADOS: {alunosFiltrados.length}</span>
          </div>
        </div>

        {alunosFiltrados.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Users className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
            <p className="text-sm mt-3 font-medium">Nenhum aluno encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-2xs font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-5">Aluno</th>
                  <th className="py-3 px-5">Adesão Recente</th>
                  <th className="py-3 px-5">Objetivo atual</th>
                  <th className="py-3 px-5">Peso Atual (Medido)</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Ficha Corporal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alunosFiltrados.map((aluno) => (
                  <tr 
                    id={`row-aluno-${aluno.id}`}
                    key={aluno.id} 
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img 
                          src={aluno.avatar} 
                          alt={aluno.nome} 
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shadow-3xs" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span 
                            onClick={() => onSelecionarAluno(aluno.id)}
                            className="text-xs font-bold text-slate-900 block hover:underline hover:text-emerald-600 cursor-pointer"
                          >
                            {aluno.nome}
                          </span>
                          <span className="text-3xs text-slate-400 block font-mono">Cadastrado: {aluno.dataInicio}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {/* Score Circular Simples em SVG */}
                        <div className="relative w-8 h-8 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="16" cy="16" r="14" fill="transparent" stroke="#f1f5f9" strokeWidth="2.5" />
                            <circle 
                              cx="16" 
                              cy="16" 
                              r="14" 
                              fill="transparent" 
                              stroke={aluno.scoreAdesao >= 75 ? "#10b981" : aluno.scoreAdesao >= 55 ? "#f59e0b" : "#ef4444"} 
                              strokeWidth="2.5" 
                              strokeDasharray={`${2 * Math.PI * 14}`}
                              strokeDashoffset={`${2 * Math.PI * 14 * (1 - aluno.scoreAdesao / 100)}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="text-4xs font-bold font-mono absolute text-slate-800">{aluno.scoreAdesao}%</span>
                        </div>
                        <span className={`text-2xs font-bold px-1.5 py-0.5 rounded-md ${
                          aluno.scoreAdesao >= 75 
                            ? "bg-emerald-50 text-emerald-700 font-mono" 
                            : aluno.scoreAdesao >= 55 
                            ? "bg-amber-50 text-amber-700 font-mono" 
                            : "bg-rose-50 text-rose-700 font-mono"
                        }`}>
                          {aluno.scoreAdesao >= 75 ? "Excelente" : aluno.scoreAdesao >= 55 ? "Atenção" : "Inconsistente"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-2xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 text-slate-400" />
                        {aluno.objetivo}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="space-y-0.5">
                        <span className="text-2xs font-bold text-slate-800 font-mono">{aluno.pesoAtual} kg</span>
                        <span className="text-3xs text-slate-400 block font-mono">BF: {aluno.bfAtual}% / {aluno.altura}cm</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full ${
                        aluno.id === "aluno_3" 
                          ? "bg-rose-50 text-rose-600" 
                          : aluno.status === "ativo" 
                          ? "bg-emerald-50 text-emerald-600" 
                          : "bg-amber-50 text-amber-600"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          aluno.id === "aluno_3" ? "bg-rose-500" : aluno.status === "ativo" ? "bg-emerald-500" : "bg-amber-500"
                        }`}></span>
                        {aluno.id === "aluno_3" ? "Ausente" : aluno.status === "ativo" ? "Ativo" : "Risco de Abandono"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end items-center gap-1.5">
                        {aluno.telefone && (
                          <a
                            href={(() => {
                              const limpo = aluno.telefone.replace(/\D/g, "");
                              const num = limpo.length === 11 || limpo.length === 10 ? `55${limpo}` : limpo;
                              const texto = encodeURIComponent(`Olá ${aluno.nome.split(" ")[0]}, tudo bem? Aqui é o seu treinador Gabriel Leal. Gostaria de falar sobre o seu progresso recente na plataforma!`);
                              return `https://api.whatsapp.com/send?phone=${num}&text=${texto}`;
                            })()}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-slate-950 font-bold text-3xs py-1.5 px-2.5 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                            title="Conversar no WhatsApp"
                          >
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            WhatsApp
                          </a>
                        )}
                        <button
                          id={`btn-ver-ficha-${aluno.id}`}
                          onClick={() => onSelecionarAluno(aluno.id)}
                          className="flex items-center gap-1 bg-slate-100 hover:bg-emerald-500 hover:text-slate-950 text-slate-700 font-semibold text-2xs py-1.5 px-3 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          Acessar Ficha
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL de Cadastro de Aluno feito com Tailwind puro */}
      {modalNovoAluno && (
        <div id="modal-cadastro-aluno" className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-100 shadow-xl overflow-hidden focus:outline-none">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-md font-bold">Matricular Novo Aluno</h3>
                <p className="text-slate-400 text-2xs mt-0.5">Defina as métricas corporais iniciais e metas físicas do aluno.</p>
              </div>
              <button 
                onClick={fecharModalNovoAluno}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer animate-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-2xs font-mono font-bold text-slate-500 uppercase tracking-wider block">Nome Completo</label>
                  <input
                    id="cad-nome"
                    type="text"
                    required
                    placeholder="Ex: João da Silva Reis"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-mono font-bold text-slate-500 uppercase tracking-wider block">E-mail</label>
                  <input
                    id="cad-email"
                    type="email"
                    required
                    placeholder="aluno@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-mono font-bold text-slate-500 uppercase tracking-wider block">Telefone</label>
                  <input
                    id="cad-fone"
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-mono font-bold text-slate-500 uppercase tracking-wider block">Objetivo Principal</label>
                  <select
                    id="cad-objetivo"
                    value={objetivo}
                    onChange={(e) => setObjetivo(e.target.value)}
                    className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Hipertrofia Limpa">Hipertrofia Limpa</option>
                    <option value="Emagrecimento Rápido">Emagrecimento Rápido</option>
                    <option value="Definição Extrema">Definição Extrema</option>
                    <option value="Condicionamento Geral">Condicionamento Geral</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-mono font-bold text-slate-500 uppercase tracking-wider block">Altura (cm)</label>
                  <input
                    id="cad-altura"
                    type="number"
                    required
                    value={altura}
                    onChange={(e) => setAltura(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-mono font-bold text-slate-500 uppercase tracking-wider block">Peso Inicial (kg)</label>
                  <input
                    id="cad-peso"
                    type="number"
                    step="0.1"
                    required
                    value={pesoInicial}
                    onChange={(e) => setPesoInicial(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-2xs font-mono font-bold text-slate-500 uppercase tracking-wider block">BF Estimado %</label>
                  <input
                    id="cad-bf"
                    type="number"
                    step="0.1"
                    required
                    value={bfAtual}
                    onChange={(e) => setBfAtual(Number(e.target.value))}
                    className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2 space-y-2">
                  <span className="text-2xs font-mono font-bold text-slate-500 uppercase tracking-wider block">Foto de Perfil do Aluno</span>
                  
                  {/* Drag and Drop Container */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-xl p-4 transition-all text-center relative ${
                      dragActive 
                        ? "border-emerald-500 bg-emerald-50/50" 
                        : imagemPreview 
                          ? "border-slate-200 bg-slate-50" 
                          : "border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-slate-100/50"
                    }`}
                  >
                    {imagemPreview ? (
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <img 
                          src={imagemPreview} 
                          alt="Preview do Avatar" 
                          className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div className="text-center">
                          <span className="text-3xs text-emerald-600 font-bold block">✓ Foto carregada com sucesso!</span>
                          <button
                            type="button"
                            onClick={removerFotoSelecionada}
                            className="text-[10px] text-rose-500 hover:underline hover:font-bold font-mono uppercase mt-1 cursor-pointer"
                          >
                            Remover imagem
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-1.5 cursor-pointer">
                        <input
                          id="cad-upload-foto"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-3xs font-bold text-slate-700 uppercase">Selecione ou Arraste uma foto</span>
                        <span className="text-[9px] text-slate-400 mt-0.5">Formatos suportados: JPG, PNG, WEBP</span>
                      </div>
                    )}
                  </div>

                  {/* URL fallback option if they prefer */}
                  <div className="pt-1.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <label htmlFor="cad-avatar" className="text-[10px] font-mono font-bold text-slate-400 uppercase">Ou cole uma URL da Imagem</label>
                      {avatar && avatar.startsWith("http") && (
                        <span className="text-[9px] text-slate-500 italic block">Link Ativo</span>
                      )}
                    </div>
                    <input
                      id="cad-avatar"
                      type="text"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={avatar && !avatar.startsWith("data:") ? avatar : ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAvatar(val);
                        if (val.trim()) {
                          setImagemPreview(val);
                        } else {
                          setImagemPreview(null);
                        }
                      }}
                      className="w-full text-xs p-2 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 placeholder:text-slate-350"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={fecharModalNovoAluno}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-750 font-semibold text-xs py-2 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  id="btn-cadastrar-novo-aluno-submit"
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-2 px-6 rounded-xl transition-colors cursor-pointer"
                >
                  Matricular Aluno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
