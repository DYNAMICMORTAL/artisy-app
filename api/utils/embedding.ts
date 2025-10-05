import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

/**
 * Generate embeddings for a given text using OpenAI's text-embedding-3-small model
 * @param text The text to generate embeddings for
 * @returns An array of numbers representing the embedding vector
 */
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float'
    })

    return response.data[0].embedding
  } catch (error) {
    console.error('Error generating embedding:', error)
    throw new Error('Failed to generate embedding')
  }
}

/**
 * Generate embeddings for product (combines title and description)
 * @param name Product name
 * @param description Product description
 * @returns An array of numbers representing the embedding vector
 */
export async function getProductEmbedding(name: string, description: string): Promise<number[]> {
  const combinedText = `${name} ${description}`
  return getEmbedding(combinedText)
}
