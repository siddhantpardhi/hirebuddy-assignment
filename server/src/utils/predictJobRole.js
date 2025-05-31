import { CohereClient } from "cohere-ai"
import dotenv from "dotenv"
dotenv.config()

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
})
console.log("🚀 ~ process.env.COHERE_API_KEY:", process.env.COHERE_API_KEY)

export async function predictJobRole(text) {

    try {
        const prompt = `What software job role best fits the following resume content?\n\n"${text}"\n\nOnly return one role name like: frontend developer, backend developer, devops engineer, etc.`;

        const response = await cohere.generate({
            model: 'command-r-plus',
            prompt,
            max_tokens: 20,
            temperature: 0.2
        })
        // console.log("🚀 ~ predictJobRole ~ response:", response)

        const prediction = response.generations[0].text.trim().toLowerCase();
        return prediction
    } catch (error) {
        console.error("Cohere API Error: ", error)
        const roleKeywords = {
            'frontend developer': ['react', 'vue', 'javascript', 'html', 'css'],
            'backend developer': ['node', 'express', 'mongodb', 'api', 'sql'],
            'data scientist': ['python', 'pandas', 'numpy', 'ml', 'tensorflow'],
            'devops engineer': ['docker', 'kubernetes', 'ci/cd', 'aws', 'jenkins'],
        }

        const lowerText = text.toLowerCase()
        const scores = {}

        for (const [role, keywords] of Object.entries(roleKeywords)) {
            scores[role] = keywords.reduce((acc, keyword) => {
                return acc + (lowerText.includes(keyword) ? 1 : 0)
            }, 0);
        }

        const bestMatch = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]
        return bestMatch[1] > 0 ? bestMatch[0] : 'general software engineer'

    }

}
