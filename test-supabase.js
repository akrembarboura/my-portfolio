/* global process */
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envFile = fs.readFileSync('.env', 'utf8')
const envConfig = {}
envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
        envConfig[match[1].trim()] = match[2].trim()
    }
})

const supabaseUrl = envConfig.VITE_SUPABASE_URL
const supabaseKey = envConfig.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSubmit() {
    console.log('Testing Supabase contact_messages insert...')
    const { data, error } = await supabase
        .from('contact_messages')
        .insert([
            {
                name: 'Test Setup Agent',
                email: 'test@example.com',
                projectType: 'Integration Test',
                message: 'This is a test message to ensure the contact form connects to the backend successfully with the current RLS policies.'
            }
        ])
        .select()

    if (error) {
        console.error('Error inserting:', error)
        process.exit(1)
    } else {
        console.log('Success! Data returned:', data)
        process.exit(0)
    }
}

testSubmit()
