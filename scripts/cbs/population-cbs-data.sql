-- Create the population_gender_wise_cbs table if it doesn't exist
CREATE TABLE IF NOT EXISTS population_gender_wise_cbs (
  id VARCHAR(48) PRIMARY KEY NOT NULL,
  ward_no INTEGER,
  total_population INTEGER,
  total_male INTEGER,
  total_female INTEGER
);

-- Clear existing data (optional)
-- TRUNCATE TABLE population_gender_wise_cbs;

-- Insert ward-wise population data
INSERT INTO population_gender_wise_cbs (id, ward_no, total_population, total_male, total_female)
VALUES 
  ('pop_ward_1', 1, 7561, 3619, 3942),
  ('pop_ward_2', 2, 5596, 2754, 2842),
  ('pop_ward_3', 3, 5049, 2439, 2610),
  ('pop_ward_4', 4, 5983, 2971, 3012),
  ('pop_ward_5', 5, 6901, 3374, 3527),
  ('pop_ward_6', 6, 7847, 3819, 4028),
  ('pop_ward_7', 7, 6111, 2925, 3186),
  ('pop_ward_8', 8, 850, 407, 443);

