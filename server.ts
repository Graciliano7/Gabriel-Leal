import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API Client safely (supporting lazy initialization via API check)
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("A chave GEMINI_API_KEY não foi encontrada no ambiente.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Endpoint para Substituição de Alimento (Referência TACO)
app.post("/api/gemini/food-substitution", async (req, res) => {
  try {
    const { alimentoNome, quantidade } = req.body;
    if (!alimentoNome) {
      res.status(400).json({ error: "O nome do alimento é obrigatório." });
      return;
    }

    const ai = getAi();
    const prompt = `Alimento original: "${alimentoNome}" com a quantidade "${quantidade || "100g"}".
Forneça uma opção de substituição que atenda à mesma necessidade nutricional (mesma categoria: ex. carboidrato por carboidrato, proteína por proteína).
Utilize como referência a Tabela Brasileira de Composição de Alimentos (TACO).
Considere e calcule aproximadamente os macronutrientes do novo alimento (proteína, carboidrato, gordura).

Responda APENAS com um objeto JSON válido, contendo:
- nome: Nome do novo alimento sugerido.
- quantidade: Quantidade sugerida para equivalência de macros.
- proteina: Gramas de proteína (número).
- carboidrato: Gramas de carboidrato (número).
- gordura: Gramas de gordura (número).
- justificativa: Uma frase curta explicando o porquê dessa substituição com base na TACO.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nome: { type: Type.STRING },
            quantidade: { type: Type.STRING },
            proteina: { type: Type.NUMBER },
            carboidrato: { type: Type.NUMBER },
            gordura: { type: Type.NUMBER },
            justificativa: { type: Type.STRING },
          },
          required: ["nome", "quantidade", "proteina", "carboidrato", "gordura", "justificativa"],
        },
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Erro na substituição de alimento via IA:", error);
    res.status(500).json({ error: error.message || "Erro interno no servidor." });
  }
});

// 2. Endpoint para Auxiliar edição de Treino
app.post("/api/gemini/assistant-workout", async (req, res) => {
  try {
    const { nomeDivisao, exercicios, instrucao } = req.body;
    
    const ai = getAi();
    const prompt = `Você é um Personal Trainer de elite e consultor esportivo.
Divisão de Treino atual: "${nomeDivisao}"
Instrução ou objetivo do ajuste: "${instrucao}"
Lista de exercícios atuais:
${JSON.stringify(exercicios, null, 2)}

Ajuste a lista de exercícios com base nas instruções recebidas. Você pode sugerir substituições, mudança de séries, repetições, cargas recomendadas ou descansos corretos. Se o treino estiver vazio ou o usuário pediu para criar um novo, preencha com exercícios excelentes que façam sentido para essa divisão.
Garanta manter os exercícios como objetos estruturados exatamente como o modelo abaixo.

Responda APENAS com um objeto JSON contendo uma lista atualizada de exercicios:
- exercicios: Array de objetos compostos por:
  - nome: Nome do exercício.
  - series: Número de séries (inteiro).
  - repeticoes: String (ex: "10 a 12", "Falha", "12/10/8").
  - carga: String (ex: "30kg", "Corporal", "Halter de 14kg").
  - descanso: String (ex: "60s", "90s", "2 min").`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exercicios: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  series: { type: Type.INTEGER },
                  repeticoes: { type: Type.STRING },
                  carga: { type: Type.STRING },
                  descanso: { type: Type.STRING },
                },
                required: ["nome", "series", "repeticoes", "carga", "descanso"],
              },
            },
          },
          required: ["exercicios"],
        },
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Erro no ajuste de treino via IA:", error);
    res.status(500).json({ error: error.message || "Erro interno no servidor." });
  }
});

// 3. Endpoint para Auxiliar edição de Fármacos, Hormônios e Suplementação
app.post("/api/gemini/assistant-pharmacos", async (req, res) => {
  try {
    const { suplementos, instrucao } = req.body;

    const ai = getAi();
    const prompt = `Você é um médico endocrinologista esportivo e assessor de alta performance de elite mundial.
Ajuste a lista de compostos ou prescreva protocolos baseando-se na instrução recebida.
Instrução do ajuste: "${instrucao}"
Lista de itens atuais:
${JSON.stringify(suplementos, null, 2)}

Você pode sugerir:
- Suplementos essenciais (ex: Creatina, Whey, Beta-Alanina)
- Fármacos de suporte clínico ou fitoterápicos (ex: Protetores hepáticos como Silimarina/NAC, redutores de estradiol como Anastrozol, indutores de sono, etc.)
- Protocolos de Hormônios Estigmatizados e Ergogênicos, sejam Terapias de Reposição Hormonal (TRT) ou ciclos de performance atlética cientificamente dosados (ex: Enantato de Testosterona, Oxandrolona, Primobolan) com suas dosagens clínicas seguras adequadas às diretrizes esportivas modernas.

Retorne a lista com as dosagens precisas, horários de ingestão e a classificação correta.

Responda APENAS com um objeto JSON contendo:
- suplementos: Array de objetos contendo:
  - nome: Nome do composto (comercial, ativo ou sal).
  - dosagem: Dosagem sugerida e frequência (ex: "100mg/semana", "5g", "0.5mg no dia", "10mg de 12/12h").
  - horario: Horário ideal de uso ou dia de aplicação (ex: "Pós-treino", "Em jejum", "Quarta-feira de manhã", "Antes de dormir").
  - categoria: Obrigatório, deve ser exatamente "suplemento", "farmaco" ou "hormonio".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suplementos: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  dosagem: { type: Type.STRING },
                  horario: { type: Type.STRING },
                  categoria: {
                    type: Type.STRING,
                    description: "Categoria do composto: 'suplemento', 'farmaco' ou 'hormonio'."
                  },
                },
                required: ["nome", "dosagem", "horario", "categoria"],
              },
            },
          },
          required: ["suplementos"],
        },
      },
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Erro no ajuste de suplementação via IA:", error);
    res.status(500).json({ error: error.message || "Erro interno no servidor." });
  }
});

// Vite & Express Integration
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Gabriel Leal Server] Iniciado e escutando na porta ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Erro ao inicializar o servidor express:", err);
});
