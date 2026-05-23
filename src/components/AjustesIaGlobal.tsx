import React, { useState } from "react";
import { Aluno } from "../types";
import { 
  Sparkles, 
  UploadCloud, 
  Folder, 
  X, 
  Save, 
  Play, 
  CheckCircle2, 
  User, 
  Activity, 
  FileText,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

interface AjustesIaGlobalProps {
  alunos: Aluno[];
  protocolosIa?: {
    diretrizPrompt: string;
    arquivosReferencia: { id: string; nome: string; data: string; tamanho: string }[];
  };
  onAtualizarProtocolosIa?: (
    diretrizPrompt: string, 
    arquivosReferencia?: { id: string; nome: string; data: string; tamanho: string }[]
  ) => void;
}

export default function AjustesIaGlobal({
  alunos,
  protocolosIa,
  onAtualizarProtocolosIa
}: AjustesIaGlobalProps) {
  const [diretrizIaInput, setDiretrizIaInput] = useState(protocolosIa?.diretrizPrompt || "");
  const [arquivosReferenciaIa, setArquivosReferenciaIa] = useState<{ id: string; nome: string; data: string; tamanho: string }[]>(
    protocolosIa?.arquivosReferencia || [
      { id: "ref_init_1", nome: "diretriz_fisiologica_hipertrofia_2026.pdf", data: "2026-02-14", tamanho: "2.4 MB" },
      { id: "ref_init_2", nome: "protocolo_cardio_zona2_leal.txt", data: "2026-03-01", tamanho: "185 KB" }
    ]
  );
  
  const [dragActiveIa, setDragActiveIa] = useState(false);
  const [uploadProgressIa, setUploadProgressIa] = useState(false);

  // States para o Simulador de Aluno
  const [alunoSimuladorId, setAlunoSimuladorId] = useState<string>(alunos[0]?.id || "");
  const [gerandoFeedbackSimulado, setGerandoFeedbackSimulado] = useState(false);
  const [feedbackSimuladoOutput, setFeedbackSimuladoOutput] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveIa(true);
    } else if (e.type === "dragleave") {
      setDragActiveIa(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveIa(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processarArquivoReferencia(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processarArquivoReferencia(e.target.files[0]);
    }
  };

  const processarArquivoReferencia = (file: File) => {
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
    alert("Diretrizes de Prompt e Protocolos Gerais salvos com sucesso e propagados para todo o ecossistema!");
  };

  // Executa uma simulação com base em qualquer Aluno do sistema
  const handleSimularAgentePorAluno = () => {
    const alunoAlvo = alunos.find(a => a.id === alunoSimuladorId);
    if (!alunoAlvo) return;

    setGerandoFeedbackSimulado(true);
    setFeedbackSimuladoOutput(null);

    setTimeout(() => {
      const pPerdido = (alunoAlvo.pesoInicial - alunoAlvo.pesoAtual).toFixed(1);
      
      let report = `### 🤖 RELATÓRIO DO AGENTE DE PERFORMANCE VIP GABRIEL LEAL IA PRO
**Data da Análise**: ${new Date().toLocaleDateString("pt-BR")}
**Foco do Aluno**: ${alunoAlvo.nome} (${alunoAlvo.objetivo})

Olá Coach Gabriel Leal! Analisei os parâmetros do sistema e do aluno de acordo com o seu **Treinamento de IA**. Aqui está a simulação clínica integrada:

1. **Análise de Métricas Corporais**:
   * **Peso atual**: ${alunoAlvo.pesoAtual} kg (Variação de ${Number(pPerdido) > 0 ? `-${pPerdido} kg eliminados` : `+${Math.abs(Number(pPerdido))} kg de massa / densidade`}).
   * **BF Estimado**: ${alunoAlvo.bfAtual}%.
   * **Adesão Geral**: ${alunoAlvo.scoreAdesao}% de constância semanal.
   
2. **Avaliação Fisiológica Cruzada**:
   * O aluno está com regularidade estável. No entanto, é crucial prestar atenção no volume de estímulo semanal.
   * Recomenda-se estipular o cardio na faixa de zona 2 aeróbica para preservar reservas de glicogênio.

3. **Status do Robô & Agentes Ativos**:
   * **Agente de Dieta**: Carbo-cycling ativo com base nas macros alvo.
   * **Agente de Ergogênicos/Fármacos**: Protegendo integradores e mantendo protocolo hormonal alinhado.
   * **Agente de Treino**: Periodização ajustada para evitar sobrecarga articular de acordo com a meta de ${alunoAlvo.objetivo}.`;

      if (diretrizIaInput.trim() || arquivosReferenciaIa.length > 0) {
        report += `\n\n---\n### 🎯 PARÂMETROS DO TREINO DE PROTOCOLOS GERAIS APLICADOS COM SUCESSO:`;
        
        if (diretrizIaInput.trim()) {
          report += `\n* **Diretriz de Prompt Coletiva Detectada**: *"${diretrizIaInput.trim()}"*`;
        }
        if (arquivosReferenciaIa.length > 0) {
          report += `\n* **Diretrizes e Arquivos Clínicos Escaneados**: ${arquivosReferenciaIa.map(f => `📁 ${f.nome}`).join(", ")}`;
        }
        report += `\n\n* **Ajuste Cirúrgico**: Adaptamos as recomendações do microciclo de ${alunoAlvo.nome.split(" ")[0]} para se conformar exatamente com as novas premissas globais do consultório.`;
      }

      setFeedbackSimuladoOutput(report);
      setGerandoFeedbackSimulado(false);
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* COLUNA ESQUERDA & CENTRAL: PARÂMETROS DE TREINAMENTO DO ROBÔ */}
      <div className="col-span-1 lg:col-span-2 space-y-6">
        
        {/* CARD COM DIRETRIZES DE PROMPT DO SISTEMA */}
        <div className="bg-white rounded-3xl border border-slate-205 p-6 shadow-3xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                <Sparkles className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">Treinamento Geral do Agente de IA</h3>
                <span className="text-3xs text-slate-400 font-mono">Modifique as diretrizes do robô do consultório</span>
              </div>
            </div>
            <span className="text-3xs bg-slate-950 text-emerald-400 font-mono px-2.5 py-1 rounded-full font-bold uppercase">
              Modelo Pro Ativo
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Aqui você define as instruções e o prompt de apoio que regem as respostas e relatórios gerados por inteligência artificial para <strong>TODOS</strong> os alunos cadastrados. É o cérebro das suas recomendações automáticas de alta performance Gabriel Leal.
          </p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="input-diretriz-global" className="text-3xs font-mono font-bold text-slate-500 uppercase">Diretriz Coletiva de IA</label>
              <textarea
                id="input-diretriz-global"
                rows={5}
                placeholder="Exemplo de Prompt: Sempre priorize ingestão de água mineral acima de 4L por dia, dê ênfase no limite de cardio prescrito para que não fiquem catabólicos, e evite estimulantes fortes após as 18h..."
                value={diretrizIaInput}
                onChange={(e) => setDiretrizIaInput(e.target.value)}
                className="w-full bg-slate-50 p-3.5 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 font-medium text-slate-800"
              />
            </div>

            {/* Drag & Drop de arquivos globais */}
            <div className="space-y-2">
              <label className="text-3xs font-mono font-bold text-slate-500 uppercase">Vetor de Conhecimento Clínico (PDFs e Documentos de Sucesso)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className="relative border-2 border-dashed border-slate-205 hover:border-emerald-500/80 rounded-2xl p-5 hover:bg-slate-50/50 transition-all flex flex-col items-center justify-center text-center cursor-pointer bg-slate-50"
                >
                  <input
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <UploadCloud className="w-7 h-7 text-slate-450 mb-1.5" />
                  <span className="text-3xs font-bold text-slate-700 uppercase">Anexar Manual Clínico</span>
                  <span className="text-[9px] text-slate-450 font-mono mt-0.5">Vetoriza diretrizes fisiológicas</span>
                </div>

                <div className="border border-slate-205 bg-white p-3.5 rounded-2xl space-y-2 max-h-[120px] overflow-y-auto">
                  <span className="text-3xs font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-100 pb-1">Diretrizes Ativas ({arquivosReferenciaIa.length})</span>
                  {arquivosReferenciaIa.length === 0 ? (
                    <div className="text-[10px] text-slate-400 font-mono py-4 text-center">Nenhum protocolo anexado.</div>
                  ) : (
                    <div className="space-y-1.5">
                      {arquivosReferenciaIa.map(file => (
                        <div key={file.id} className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-150 text-[10px]">
                          <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                            <Folder className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="font-semibold text-slate-700 truncate" title={file.nome}>{file.nome}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[8px] font-mono text-slate-450">
                            <span>{file.tamanho}</span>
                            <button
                              type="button"
                              onClick={() => handleExcluirArquivoIa(file.id)}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <p className="text-[10px] text-slate-450 font-mono flex items-center gap-2">
                {uploadProgressIa ? (
                  <>
                    <span className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></span>
                    Indexando base científica do consultório...
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Integração em tempo real com todos os relatórios
                  </>
                )}
              </p>
              
              <button
                type="button"
                onClick={handleSalvarDiretrizIa}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-2xs uppercase py-2 px-4 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Salvar Regras de IA
              </button>
            </div>
          </div>
        </div>

        {/* TELEMETRIA DE AGENTES DO SISTEMA GABRIEL LEAL */}
        <div className="bg-white rounded-3xl border border-slate-205 p-6 shadow-3xs space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">Agentes de Sub-Processos Autônomos</h4>
          <p className="text-xs text-slate-500">Mapeamento dos agentes internos que lêem as diretrizes coletivas:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden">
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h5 className="text-[10px] font-bold text-slate-700 uppercase font-mono">NutriAgent Active</h5>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">Calibra carboidratos, proteínas e hidratação com base nas metas e diretrizes gerais.</p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden">
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h5 className="text-[10px] font-bold text-slate-700 uppercase font-mono">BioCoach Active</h5>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug">Calcula microciclos e aeróbicos de acordo com a adesão acumulada de cada aluno.</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl relative overflow-hidden">
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h5 className="text-[10px] font-bold text-slate-700 uppercase font-mono">PharmacoBot Active</h5>
              <p className="text-[10px] text-slate-500 mt-1 leading-snug font-sans">Acolhe suplementos e ergogênicos em horários de pico conforme diretriz fisiológica.</p>
            </div>
          </div>
        </div>
      </div>

      {/* COLUNA DIREITA: SIMULADOR DE AGENTE INTEGRADO */}
      <div className="col-span-1 space-y-6">
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md flex flex-col h-full space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Activity className="w-5 h-5 text-emerald-430 animate-pulse" />
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-white">Simulador de Agente</h3>
              <p className="text-[10px] text-slate-400">Verifique a inteligência nos alunos cadastrados</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <label htmlFor="select-simular-aluno" className="text-3xs font-mono font-bold text-slate-400 uppercase">Selecione o Aluno para Simular</label>
              <select
                id="select-simular-aluno"
                value={alunoSimuladorId}
                onChange={(e) => setAlunoSimuladorId(e.target.value)}
                className="w-full bg-slate-800 text-xs border border-slate-700 p-2.5 rounded-xl focus:outline-none focus:border-emerald-500 text-white font-semibold cursor-pointer"
              >
                {alunos.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.nome} ({st.objetivo})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              id="btn-rodar-simulador-ia"
              onClick={handleSimularAgentePorAluno}
              disabled={gerandoFeedbackSimulado}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {gerandoFeedbackSimulado ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-955" />
                  Calibrando Robô de Alta Performance...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-955" />
                  Testar Diagnóstico de IA
                </>
              )}
            </button>

            {/* output area */}
            {feedbackSimuladoOutput ? (
              <div id="campo-ia-simulado-output" className="bg-slate-850 border border-slate-800 p-4 rounded-2xl max-h-[310px] overflow-y-auto text-slate-200 text-3xs font-medium space-y-3 leading-relaxed">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase">Simulação OK</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  </div>
                </div>
                <div className="whitespace-pre-wrap font-sans">
                  {feedbackSimuladoOutput}
                </div>
              </div>
            ) : (
              <div className="bg-slate-850/60 border border-dashed border-slate-800 p-4.5 rounded-2xl text-center text-[10px] text-slate-400 flex flex-col items-center justify-center min-h-[160px]">
                <FileText className="w-6 h-6 text-slate-650 mb-1.5" />
                <span>Nenhuma simulação ativa no momento.</span>
                <span className="text-[8px] text-slate-500 mt-1 font-mono">Defina um aluno acima e clique em &quot;Testar Diagnóstico de IA&quot;.</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
