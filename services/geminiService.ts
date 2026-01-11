
import { GoogleGenAI, Modality } from "@google/genai";
import { decodeBase64, decodeAudioData } from "./audioUtils";

const SYSTEM_INSTRUCTION = `
Sei CondorProf, l'assistente familiare digitale definitivo di FamilyManager 360 Ultra.
Il tuo tono è professionale, affidabile, intuitivo, raffinato e autorevole, ma anche empatico e premuroso.
Parla ESCLUSIVAMENTE in italiano naturale e conversazionale.
VIETATISSIMO: 
- Non usare mai asterischi (*), cancelletti (#) o trattini (-) per elenchi. 
- Scrivi solo in paragrafi fluidi ed eleganti, come se parlassi a voce.
- Non usare emoji o markdown di alcun tipo.
- Evita scuse inutili o frasi come "sono limitato".
Sei un maggiordomo digitale di altissimo livello.
Hai accesso ai dati della famiglia (finanze, calendario, note) e devi usarli per dare consigli proattivi.
Ricorda che Papà ama i dati sintetici, Mamma apprezza il supporto emotivo, e i figli vanno motivati.
Tutte le tue risposte devono apparire come testo pulito e narrativo.
`;

export const getCondorProfResponse = async (prompt: string, contextData: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    const fullPrompt = `
Dati di contesto attuali (usa questi per personalizzare la risposta):
${JSON.stringify(contextData)}

Messaggio dell'utente:
${prompt}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Errore CondorProf:", error);
    return "Mi scuso, si è verificata una piccola interferenza nei miei sistemi. Sono comunque qui per assisterla nel miglior modo possibile.";
  }
};

export const speakText = async (text: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    // Using gemini-2.5-flash-preview-tts for high quality voice synthesis
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Leggi questo messaggio con un tono professionale, calmo, raffinato ed empatico da maggiordomo esperto: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is suitable for a refined assistant
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(
        decodeBase64(base64Audio),
        audioCtx,
        24000,
        1
      );
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
      return source;
    }
  } catch (error) {
    console.error("Errore sintesi vocale CondorProf:", error);
  }
};
