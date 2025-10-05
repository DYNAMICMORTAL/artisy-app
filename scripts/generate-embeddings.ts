/**
 * Script to generate embeddings for all products in the database
 * Run this after setting up the database migration
 * 
 * Usage: tsx scripts/generate-embeddings.ts
 */

import 'dotenv/config'
console.log('🟢 Script started: generate-embeddings.ts')
import { supabaseAdmin } from '../api/config/supabase'
import { getProductEmbedding } from '../api/utils/embedding'

interface Product {
  id: number
  name: string
  description: string
  embedding: number[] | null
}

console.log('Environment Variables:')
async function generateEmbeddingsForAllProducts() {
  try {
    console.log('🚀 Starting embedding generation process...\n')

    // Print Supabase config for diagnosis
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'not set'
    console.log('Supabase URL:', supabaseUrl)
    console.log('Supabase Key prefix:', supabaseKey ? supabaseKey.slice(0, 6) + '...' : 'not set')

    // Fetch all products without embeddings
    console.log('Fetching products...')
    const queryTimeout = setTimeout(() => {
      console.log('⏳ Query taking longer than expected...')
    }, 5000)
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('id, name, description, embedding')
      .is('embedding', null) as { data: Product[] | null, error: Error | null }
    clearTimeout(queryTimeout)
    console.log('Raw query result:', { data: products, error })

    if (error) {
      console.error('❌ Error fetching products:', error)
      return
    }

    if (!products) {
      console.log('No products returned (data is null)')
      return
    }

    if (products.length === 0) {
      console.log('No products found to process.')
      return
    }

    console.log(`📊 Found ${products.length} products without embeddings\n`)

    let successCount = 0
    let errorCount = 0


    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      try {
        console.log(`[${i + 1}/${products.length}] Processing: ${product.name}`)

        // Generate embedding
        const embedding = await getProductEmbedding(product.name, product.description)

        // Print embedding to terminal (first 10 values for brevity)
        if (embedding && Array.isArray(embedding)) {
          console.log(`  Embedding: [${embedding.slice(0, 10).map(v => v.toFixed(4)).join(', ')} ...] (${embedding.length} dims)`)
        } else {
          console.log('  Embedding: null')
        }

        // Update product with embedding
        const { error: updateError } = await supabaseAdmin
          .from('products')
          .update({ embedding })
          .eq('id', product.id)

        if (updateError) {
          throw updateError
        }

        successCount++
        console.log(`  ✓ Successfully generated and saved embedding`)

        // Add a small delay to avoid rate limiting (adjust as needed)
        await new Promise(resolve => setTimeout(resolve, 200))
      } catch (error) {
        errorCount++
        console.error(`  ✗ Error generating embedding:`, error instanceof Error ? error.message : 'Unknown error')
      }
    }

  console.log('\n' + '='.repeat(50))
  console.log('📈 Embedding Generation Complete!')
  console.log('='.repeat(50))
  console.log(`✅ Success: ${successCount}`)
  console.log(`❌ Errors: ${errorCount}`)
  console.log(`📊 Total: ${products.length}`)
  console.log('='.repeat(50) + '\n')
  // ...existing code...

  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

// Run the script
if (process.argv[1] === import.meta.url.replace('file://', '')) {
  (async () => {
    try {
      await generateEmbeddingsForAllProducts()
      console.log('🟢 Script finished: generate-embeddings.ts')
      process.exit(0)
    } catch (error) {
      console.error('❌ Fatal error (top-level):', error)
      process.exit(1)
    }
  })()
}
export { generateEmbeddingsForAllProducts }
