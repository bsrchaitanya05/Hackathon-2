/*
  # Vehicle Data Schema

  1. New Tables
    - `vehicle_data`
      - `id` (uuid, primary key)
      - `speed` (float)
      - `engine_temp` (float)
      - `fuel_level` (float)
      - `tire_pressure` (jsonb)
      - `adas_status` (jsonb)
      - `created_at` (timestamp)
    
  2. Security
    - Enable RLS on vehicle_data table
    - Add policies for authenticated users
*/

CREATE TABLE vehicle_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  speed float NOT NULL DEFAULT 0,
  engine_temp float NOT NULL DEFAULT 0,
  fuel_level float NOT NULL DEFAULT 0,
  tire_pressure jsonb NOT NULL DEFAULT '{"fl": 32, "fr": 32, "rl": 32, "rr": 32}'::jsonb,
  adas_status jsonb NOT NULL DEFAULT '{"lane_assist": false, "cruise_control": false, "emergency_brake": false}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicle_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
  ON vehicle_data
  FOR SELECT
  TO authenticated
  USING (true);