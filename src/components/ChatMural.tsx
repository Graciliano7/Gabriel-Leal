import React, { useState, useRef, useEffect } from "react";
import { Mensagem, Aluno } from "../types";
import { Send, MessageSquare, Shield, User, Bot, Paperclip, X, Eye, Video } from "lucide-react";

interface ChatMuralProps {
  mensagens: Mensagem[];
  aluno: Aluno;
  perfilAtual: "gestor" | string; // de quem está enviando
  onEnviarMensagem: (
    alunoId: string, 
    remetente: "personal" | "aluno", 
    texto: string,
    arquivoUrl?: string,
    tipoArquivo?: "imagem" | "video",
    nomeArquivo?: string
  ) => void;
}

export default function ChatMural({
  mensagens,
  aluno,
  perfilAtual,
  onEnviarMensagem
}: ChatMuralProps) {
  const [texto, setTexto] = useState("");
  const [anexoUrl, setAnexoUrl] = useState<string | null>(null);
  const [anexoTipo, setAnexoTipo] = useState<"imagem" | "video" | null>(null);
  const [anexoNome, setAnexoNome] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtra as mensagens trocadas especificamente com ESTE ALUNO
  const mensagensChat = mensagens.filter(m => m.alunoId === aluno.id);

  const handleSelecionarArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      
      let tipo: "imagem" | "video" = "imagem";
      if (['mp4', 'mov', 'webm', 'avi', 'mkv', '3gp'].includes(ext)) {
        tipo = "video";
      }

      reader.onload = (event) => {
        setAnexoUrl(event.target?.result as string || "");
        setAnexoTipo(tipo);
        setAnexoNome(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEnviar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim() && !anexoUrl) return;

    const remetente = perfilAtual === "gestor" ? "personal" : "aluno";
    
    // se possuir anexo mas não texto, cria uma mensagem descritiva
    const corpoTexto = texto.trim() || (anexoTipo === "imagem" ? "📸 Foto Anexa" : "🎥 Vídeo Anexo");

    onEnviarMensagem(
      aluno.id, 
      remetente, 
      corpoTexto, 
      anexoUrl || undefined, 
      anexoTipo || undefined, 
      anexoNome || undefined
    );

    setTexto("");
    setAnexoUrl(null);
    setAnexoTipo(null);
    setAnexoNome(null);
  };

  const removerAnexo = () => {
    setAnexoUrl(null);
    setAnexoTipo(null);
    setAnexoNome(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagensChat]);

  return (
    <div id="mural-chat-bilateral" className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col h-[400px] shadow-3xs">
      {/* Header do Chat */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-light-200">
        <div className="flex items-center gap-3">
          <img 
            src={aluno.avatar} 
            alt={aluno.nome} 
            className="w-8 h-8 rounded-full object-cover border border-slate-700"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-xs font-bold leading-none">{aluno.nome}</h4>
            <span className="text-[9px] font-mono text-slate-400">Canal de Comunicação Direto</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-slate-800 text-emerald-400 text-4xs font-mono font-bold py-1 px-2.5 rounded border border-slate-700">
          <Bot className="w-3 h-3 animate-pulse" />
          Mural de Consultoria
        </div>
      </div>

      {/* Caixa de Mensagens */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
        {mensagensChat.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
            <MessageSquare className="w-8 h-8 text-slate-300 stroke-1 block" />
            <p className="font-medium mt-2">Diga &quot;Olá!&quot; para iniciar o chat de suporte.</p>
          </div>
        ) : (
          mensagensChat.map(msg => {
            const isMe = perfilAtual === "gestor" 
              ? msg.remetente === "personal" 
              : msg.remetente === "aluno";

            const displaysAttachment = msg.arquivoUrl;

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[80%] ${isMe ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed space-y-2 relative overflow-hidden ${
                  isMe 
                    ? "bg-slate-900 text-white rounded-tr-none" 
                    : "bg-white text-slate-850 border border-slate-205 rounded-tl-none"
                }`}>
                  {/* Se tem anexo de foto ou video */}
                  {displaysAttachment && (
                    <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xs max-w-[220px] mx-auto">
                      {msg.tipoArquivo === "imagem" ? (
                        <a href={msg.arquivoUrl} target="_blank" rel="noreferrer" className="block max-h-44 relative group">
                          <img 
                            src={msg.arquivoUrl} 
                            alt={msg.nomeArquivo || "Imagem do chat"} 
                            className="w-full h-full object-cover rounded-lg group-hover:scale-102 transition-transform max-h-44" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Eye className="w-5 h-5 text-white bg-slate-950/60 p-1.5 rounded-full" />
                          </div>
                        </a>
                      ) : (
                        <video 
                          src={msg.arquivoUrl} 
                          controls 
                          className="w-full h-full object-cover max-h-44 rounded-lg" 
                        />
                      )}
                    </div>
                  )}

                  <p className="break-words">{msg.texto}</p>
                </div>
                {/* Remetente Label */}
                <span className="text-3xs font-mono text-slate-400 mt-1 uppercase flex items-center gap-1">
                  {msg.remetente === "personal" ? "👑 Personal/Mestre" : "👤 Aluno"}
                  {displaysAttachment && (
                    <span className="text-rose-500 font-extrabold text-[8px] border border-rose-200/50 bg-rose-50 px-1 rounded">
                      (Integrado à Evolução)
                    </span>
                  )}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preview do Anexo Pendente de Envio */}
      {anexoUrl && (
        <div className="bg-slate-100 border-t border-slate-200 px-4 py-2 flex items-center justify-between gap-3 animate-fade-in text-[10px]">
          <div className="flex items-center gap-2 truncate flex-1">
            {anexoTipo === "imagem" ? (
              <img src={anexoUrl} className="w-8 h-8 rounded object-cover border border-slate-350" alt="Preview" />
            ) : (
              <span className="p-1.5 bg-rose-500/10 text-rose-500 rounded"><Video className="w-4 h-4" /></span>
            )}
            <div className="text-left font-mono truncate">
              <span className="font-bold text-slate-700 block truncate">{anexoNome || "Arquivo Anexo"}</span>
              <span className="text-slate-400 block tracking-wide uppercase font-extrabold text-[8px]">Pronto para Enviar & Integrar à Galeria</span>
            </div>
          </div>
          <button 
            type="button" 
            onClick={removerAnexo} 
            className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Input de Envio de Mensagem */}
      <form onSubmit={handleEnviar} className="p-3 border-t border-slate-100 flex items-center gap-2 bg-white">
        {/* Input Oculto de Arquivo */}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleSelecionarArquivo}
          accept="image/*,video/*"
          className="hidden" 
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all cursor-pointer block active:scale-95"
          title="Anexar Foto ou Vídeo"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          id="input-chat-msg"
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={`Digite como ${perfilAtual === "gestor" ? "Personal" : "Aluno"}...`}
          className="bg-slate-50 text-xs p-2.5 rounded-xl border border-slate-200 flex-grow focus:outline-none focus:border-rose-400 font-medium"
        />
        <button
          id="btn-enviar-chat-msg"
          type="submit"
          className="bg-slate-900 hover:bg-rose-500 hover:text-slate-950 text-white p-2.5 rounded-xl transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
