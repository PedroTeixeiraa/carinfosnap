import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_APIKEY)
console.log(process.env.REACT_APP_GEMINI_APIKEY, 'TESTE')

const run = async file => {
	const generationConfig = {
		candidateCount: 1,
		maxOutputTokens: 200,
	}

	const systemInstruction = "Como um agente de trânsito digital, minha responsabilidade é identificar e extrair informações de veículos, seja em imagens ou vídeos. Essas informações incluem nome do carro, cor, marca e placa. Minha função é processar esses dados de forma eficiente e precisa para auxiliar nas tarefas de fiscalização e monitoramento de tráfego.\n\nA resposta deve ser no formato de JSON e sempre o primeiro carro deve ser analisado\n{\n  \"nome\": \"\",\n    \"cor\": \"\",\n    \"marca\": \"\",\n    \"placa\": \"\" \n}\n"

	const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest", generationConfig, systemInstruction})
	
	const prompt = ""
	const teste = await fileToGenerativePart(file)
	const result = await model.generateContent([prompt, teste])
  const text = result.response.text().replace('```', '').replace('json', '').replace('```', '')
	return JSON.parse(text)
}

const fileToGenerativePart = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      const mimeType = file.type;

      resolve({
        inlineData: {
          data: base64String,
          mimeType
        }
      })
    }

    reader.onerror = (error) => {
      reject(error);
    }

    reader.readAsDataURL(file)
  })
}


export default run