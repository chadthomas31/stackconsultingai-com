import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

function getClientIp(request: NextRequest): string | null {
  // Prefer standard proxy/CDN headers; `NextRequest.ip` is not available in all runtimes/versions.
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0]?.trim();
    return first || null;
  }

  const ip =
    request.headers.get('x-real-ip') ??
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('true-client-ip');

  return ip?.trim() || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { toolName, toolData, email, businessName, phone } = body;
    
    // Validate required fields
    if (!toolName || !toolData) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.warn('Supabase not configured, skipping data save');
      return NextResponse.json({ 
        success: true, 
        message: 'Calculation completed (database not configured)' 
      });
    }
    
    // Save to database
    const { data, error } = await supabase
      .from('tool_leads')
      .insert({
        tool_name: toolName,
        tool_data: toolData,
        email: email || null,
        business_name: businessName || null,
        phone: phone || null,
        ip_address: getClientIp(request),
        user_agent: request.headers.get('user-agent')
      })
      .select()
      .single();
    
    if (error) {
      console.error('Database insert error:', error);
      // Still return success - don't block the user experience
      return NextResponse.json({ success: true, message: 'Calculation completed' });
    }

    // Log analytics (fire and forget, don't block on errors)
    supabase.from('tool_analytics').insert({
      tool_name: toolName,
      action: email ? 'email_submit' : 'calculate',
      data: toolData
    }).then(({ error: analyticsErr }) => {
      if (analyticsErr) console.error('Analytics insert error:', analyticsErr);
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Tool submission error:', error);
    // Gracefully handle - user still gets a success experience
    return NextResponse.json({ success: true, message: 'Completed' });
  }
}

// Track tool views
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const toolName = searchParams.get('tool');
    
    if (!toolName) {
      return NextResponse.json(
        { success: false, error: 'Tool name required' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: true });
    }

    // Log view (fire and forget)
    supabase.from('tool_analytics').insert({
      tool_name: toolName,
      action: 'view',
      data: {}
    }).then(({ error: err }) => {
      if (err) console.error('Analytics view error:', err);
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ success: true });
  }
}