import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, phone, email, details, products } = body;

        // Validate rudimentary fields
        if (!name || !phone || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Insert into Supabase table "inquiries"
        const { data, error } = await supabase
            .from('inquiries')
            .insert([
                {
                    name,
                    phone,
                    email,
                    details,
                    product_list: products ? JSON.stringify(products) : null
                }
            ]);

        if (error) {
            console.error("Supabase Insertion Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (err) {
        console.error("Inquiry Route Error:", err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
