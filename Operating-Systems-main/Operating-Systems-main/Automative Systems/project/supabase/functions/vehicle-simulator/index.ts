import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function generateRandomData() {
  // Simulate a small chance of airbag deployment
  const airbagEvent = Math.random() < 0.05;
  
  return {
    speed: 30 + Math.floor(Math.random() * 90), // Speed between 30-120 mph
    engine_temp: 85 + Math.floor(Math.random() * 35), // Temperature between 85-120°C
    fuel_level: 20 + Math.floor(Math.random() * 80), // Fuel between 20-100%
    tire_pressure: {
      fl: 30 + Math.floor(Math.random() * 5),
      fr: 30 + Math.floor(Math.random() * 5),
      rl: 30 + Math.floor(Math.random() * 5),
      rr: 30 + Math.floor(Math.random() * 5),
    },
    adas_status: {
      lane_assist: Math.random() > 0.3,
      cruise_control: Math.random() > 0.4,
      emergency_brake: Math.random() > 0.8,
      airbag_status: {
        driver: airbagEvent && Math.random() > 0.5,
        passenger: airbagEvent && Math.random() > 0.6,
        side: airbagEvent && Math.random() > 0.7,
      }
    },
  };
}

async function simulateData() {
  try {
    const data = generateRandomData();
    const { error } = await supabase
      .from('vehicle_data')
      .insert([data]);

    if (error) throw error;
    
    return new Response(
      JSON.stringify({ message: 'Data inserted successfully', data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Simulate data immediately and then every 5 seconds
  if (req.method === 'POST') {
    return simulateData();
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    }
  );
});