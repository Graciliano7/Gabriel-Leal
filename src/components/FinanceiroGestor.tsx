import { useState } from "react";
import { Pagamento, Aluno } from "../types";
import { DollarSign, Check, Clock, AlertCircle, RefreshCw, Send, Search } from "lucide-react";

interface FinanceiroGestorProps {
  pagamentos: Pagamento[];
  alunos: Aluno[];
  onAtualizarPagamento: (id: string, status: "pago" | "atrasado" | "pendente") => void;
}

export default function FinanceiroGestor({
  pagamentos,
  alunos,
  onAtualizarPagamento
}: FinanceiroGestorProps) {
  const [busca, setBusca] = useState("");

  const faturamentoEsperado = pagamentos.reduce((acc, curr) => acc + curr.valor, 0);
  const faturamentoArrecadado = pagamentos
    .filter(p => p.status === "pago")
    .reduce((acc, curr) => acc + curr.valor, 0);
  const faturamentoAtrasado = pagamentos
    .filter(p => p.status === "atrasado")
    .reduce((acc, curr) => acc + curr.valor, 0);

  const pagamentosFiltrados = pagamentos.filter(p => 
    p.alunoNome.toLowerCase().includes(busca.toLowerCase()) ||
    p.status.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Fluxo de Caixa & Mensalidades</h2>
        <p className="text-xs text-slate-500 mt-1">Monitore faturamentos, adimplecias e gerencie pendências financeiras das suas assessorias.</p>
      </div>

      {/* Bento de faturamento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-150 p-5 rounded-2xl flex items-center justify-between text-emerald-800">
          <div>
            <span className="text-3xs font-mono uppercase font-bold tracking-wider block">Total Recebido (Este Mês)</span>
            <span className="text-3xl font-extrabold font-mono block">R$ {faturamentoArrecadado.toFixed(2)}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-1">Pago integralmente</span>
          </div>
          <div className="bg-emerald-100 p-3 rounded-xl text-emerald-750">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-150 p-5 rounded-2xl flex items-center justify-between text-rose-800">
          <div>
            <span className="text-3xs font-mono uppercase font-bold tracking-wider block">Valores Vencidos/Atrasados</span>
            <span className="text-3xl font-extrabold font-mono block">R$ {faturamentoAtrasado.toFixed(2)}</span>
            <span className="text-[10px] text-rose-600 font-medium block mt-1">Cobrança pendente manual</span>
          </div>
          <div className="bg-rose-100 p-3 rounded-xl text-rose-700">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-3xs font-mono uppercase font-bold tracking-wider block">Faturamento Estimado</span>
            <span className="text-3xl font-extrabold font-mono text-emerald-430 block">R$ {faturamentoEsperado.toFixed(2)}</span>
            <span className="text-[10px] text-slate-400 block mt-1">Adimplência alvo: 100%</span>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Lista de Boletos / Pagamentos dos Alunos */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-3xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <input
            id="input-busca-financeira"
            type="text"
            placeholder="Pesquisar por aluno ou status financeiro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-slate-50 max-w-sm pl-4 pr-4 py-2 text-xs border border-slate-205 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <div className="flex items-center gap-2">
            <span className="text-3xs font-mono text-slate-400">METAS CONVOCADAS: {pagamentos.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-2xs border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-slate-50 font-mono text-slate-450 uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-4">Aluno Assessoria</th>
                <th className="py-2.5 px-4 text-center">Valor do Plano</th>
                <th className="py-2.5 px-4 text-center">Vencimento</th>
                <th className="py-2.5 px-4 text-center">Status Fiscal</th>
                <th className="py-2.5 px-4 text-right">Ação de Caixa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {pagamentosFiltrados.map(p => {
                const alunoObj = alunos.find(a => a.id === p.alunoId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={alunoObj?.avatar || "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200"} 
                          alt={p.alunoNome} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-100" 
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="font-bold text-slate-800 block">{p.alunoNome}</span>
                          <span className="text-3xs text-slate-400 font-mono block">ID Aluno: {p.alunoId}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold font-mono text-slate-700">R$ {p.valor.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">{p.vencimento}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 font-bold font-mono text-2xs px-2.5 py-0.5 rounded-full ${
                        p.status === "pago"
                          ? "bg-emerald-50 text-emerald-700"
                          : p.status === "atrasado"
                          ? "bg-rose-50 text-rose-700 animate-pulse"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {p.status === "pago" ? "✓ Liquidado" : p.status === "atrasado" ? "⚠ Atrasado" : "⏱ Em aberto"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2 items-center">
                        {p.status !== "pago" ? (
                          <>
                            {/* Marca como pago */}
                            <button
                              id={`btn-aprovar-pg-${p.id}`}
                              onClick={() => {
                                onAtualizarPagamento(p.id, "pago");
                                alert(`Mensalidade de ${p.alunoNome} liquidada com sucesso!`);
                              }}
                              className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-500 hover:text-slate-950 text-emerald-700 text-3xs font-bold py-1 px-2.5 rounded border border-emerald-100 hover:border-emerald-500 transition-colors cursor-pointer"
                              title="Marcar como Pago"
                            >
                              <Check className="w-3 h-3" />
                              Baixar Pagamento
                            </button>

                            {/* Enviar Lembrante whatsapp */}
                            <button
                              onClick={() => {
                                alert(`Lembrete de cobrança simples enviado ao WhatsApp do Aluno ${p.alunoNome}!\nTexto: Olá, lembramos que a mensalidade do plano Gabriel Leal de R$ ${p.valor} venceu em ${p.vencimento}. Aguardamos retorno.`);
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-3xs font-bold py-1 px-2.5 rounded border border-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                              title="Enviar Cobrança de Mensalidade pelo Whatsapp"
                            >
                              <Send className="w-3 h-3" />
                              Lembrete
                            </button>
                          </>
                        ) : (
                          <div className="flex gap-1.5 items-center">
                            <span className="text-3xs text-slate-400 font-mono font-medium">Pago em: {p.dataPagamento || p.vencimento}</span>
                            <button
                              onClick={() => onAtualizarPagamento(p.id, "pendente")}
                              className="text-slate-300 hover:text-slate-500 p-1 cursor-pointer"
                              title="Estornar liquidação"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
