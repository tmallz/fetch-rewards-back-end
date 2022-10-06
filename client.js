import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(
	'https://xkdwldykdhneftafghxc.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhrZHdsZHlrZGhuZWZ0YWZnaHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjUwMTgyNTAsImV4cCI6MTk4MDU5NDI1MH0.RZWlVrGaYW0dWDi8PxXTC1r5RZ12uvSuc81sqb033kM'
);

export default supabase;
