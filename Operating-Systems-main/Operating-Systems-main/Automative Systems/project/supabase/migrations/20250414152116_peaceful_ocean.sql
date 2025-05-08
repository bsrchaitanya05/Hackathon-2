/*
  # Add airbag deployment status

  1. Changes
    - Add airbag_status to vehicle_data table's adas_status JSONB
    - Update default value to include airbag status
*/

DO $$ 
BEGIN
  -- Update existing rows to include airbag_status if it doesn't exist
  UPDATE vehicle_data 
  SET adas_status = adas_status || 
    '{"airbag_status": {"driver": false, "passenger": false, "side": false}}'::jsonb
  WHERE NOT (adas_status ? 'airbag_status');

  -- Update the default value for new rows
  ALTER TABLE vehicle_data 
  ALTER COLUMN adas_status 
  SET DEFAULT '{"lane_assist": false, "cruise_control": false, "emergency_brake": false, "airbag_status": {"driver": false, "passenger": false, "side": false}}'::jsonb;
END $$;