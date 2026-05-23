import { Aluno } from "../types";
import { Shield, User, RefreshCw } from "lucide-react";

interface AlternadorAcessoProps {
  alunos: Aluno[];
  acessoAtual: "gestor" | string; // 'gestor' ou o ID do aluno
  onMudarAcesso: (acesso: "gestor" | string) => void;
  onResetDatabase: () => void;
}

export default function AlternadorAcesso({
  alunos,
  acessoAtual,
  onMudarAcesso,
  onResetDatabase
}: AlternadorAcessoProps) {
  return (
    <div className="bg-slate-950 text-white py-2 px-4 border-b border-emerald-500/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono text-slate-400">AMB_SIMULE_ACCESS:</span>
          <span className="text-xs font-semibold bg-emerald-950 text-emerald-400 py-0.5 px-2 rounded border border-emerald-900">
            {acessoAtual === "gestor" ? "PAINEL GESTOR" : `VISÃO ALUNO: ${alunos.find(a => a.id === acessoAtual)?.nome.split(" ")[0]}`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium mr-1 select-none">Alternar Perfil:</span>
          
          <button
            id="btn-acesso-gestor"
            onClick={() => onMudarAcesso("gestor")}
            className={`flex items-center gap-1.5 text-xs font-medium py-1 px-3 rounded-full transition-all cursor-pointer ${
              acessoAtual === "gestor"
                ? "bg-emerald-500 text-slate-950 shadow-md font-bold scale-105"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Gestor / Personal
          </button>

          <span className="text-slate-700">|</span>

          {alunos.map(aluno => (
            <button
              id={`btn-acesso-aluno-${aluno.id}`}
              key={aluno.id}
              onClick={() => onMudarAcesso(aluno.id)}
              className={`flex items-center gap-1.5 text-xs font-medium py-1 px-3 rounded-full transition-all cursor-pointer ${
                acessoAtual === aluno.id
                  ? "bg-emerald-500 text-slate-950 shadow-md font-bold scale-105"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Aluno: {aluno.nome.split(" ")[0]}
            </button>
          ))}

          <span className="text-slate-705">|</span>

          <button
            id="btn-reset-db"
            onClick={() => {
              if (window.confirm("Isso redefinirá todas as alterações feitas de volta aos dados demonstrativos originais. Confirmar?")) {
                onResetDatabase();
              }
            }}
            title="Ajustar dados aos valores padrão de simulação"
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-900/50 py-1 px-2.5 rounded hover:bg-rose-950/70 transition-colors ml-2 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  );
}
