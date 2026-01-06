
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fifybtbxxdqbarwwwcbx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpZnlidGJ4eGRxYmFyd3d3Y2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2Njk0OTMsImV4cCI6MjA4MzI0NTQ5M30.mHrAYri5LX2zhHFqW8d2UjUlL1VAyL9DtLQ-BilkcmQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runTest() {
    console.log('--- Starting Backend Verification ---');

    // 1. Auth Test (Sign Up / Sign In)
    const testEmail = `verify.backend.${Date.now()}@gmail.com`;
    const testPassword = 'password123';

    console.log(`1. Testing Auth: SignUp with ${testEmail}...`);
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
    });

    if (authError) {
        console.error('❌ Auth Error:', authError.message);
        // If sign up fails, try sign in with a known fallback or user might exist
        // But since email is random, it shouldn't exist.
        return;
    }

    console.log('✅ Auth Success. User ID:', authData.user?.id);
    const userId = authData.user?.id;

    if (!userId) {
        console.error('❌ User ID missing after signup.');
        return;
    }

    // 2. Storage Test
    console.log('2. Testing Storage: Uploading dummy file...');
    const fileName = `test_upload_${Date.now()}.txt`;
    const fileBody = new Blob(['Hello World'], { type: 'text/plain' });

    // Note: in Node.js, Blob might utilize 'buffer' or requires polyfill. 
    // Let's try simple string or Buffer if allowed by client. 
    // Supabase JS client in Node supports Buffer.
    const fileBuffer = Buffer.from('Hello Supabase Storage');

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('receipts')
        .upload(fileName, fileBuffer, {
            contentType: 'text/plain'
        });

    if (uploadError) {
        console.error('❌ Storage Upload Error:', uploadError.message);
    } else {
        console.log('✅ Storage Upload Success:', uploadData.path);
    }

    // Get Public URL
    const { data: { publicUrl } } = supabase.storage
        .from('receipts')
        .getPublicUrl(fileName);

    console.log('ℹ️ Public URL:', publicUrl);

    // 3. Database Test (Insert Withdrawal)
    console.log('3. Testing Database: Inserting withdrawal record...');
    const { error: dbError } = await supabase
        .from('withdrawals')
        .insert({
            user_id: userId,
            user_name: 'Test Tester',
            recipient_name: 'Test Recipient',
            nf_number: '12345',
            image_url: publicUrl,
            timestamp: new Date().toISOString()
        });

    if (dbError) {
        console.error('❌ Database Insert Error:', dbError.message);
    } else {
        console.log('✅ Database Insert Success');
    }

    console.log('--- Verification Complete ---');
}

runTest();
