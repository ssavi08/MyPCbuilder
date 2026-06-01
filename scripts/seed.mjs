// scripts/seed.mjs
// Run from project root: node scripts/seed.mjs
// Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env

import { createClient } from '@supabase/supabase-js';
import { readFileSync }  from 'fs';
import { config }        from 'dotenv';

config({ path: './server/.env' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const data = JSON.parse(readFileSync('./scripts/catalog.json', 'utf8'));

const rows = [];
for (const [group, items] of Object.entries(data)) {
  if (group.startsWith('_')) continue;
  for (const c of items) {
    rows.push({
      id:          c.id,
      slot:        c.slot,
      name:        c.name,
      brand:       c.brand,
      price:       c.price,
      model_url:   c.modelPath ?? '',
      tier:        c.tier,
      use_cases:   c.useCases,
      spec_approx: c.specApprox ?? false,
      has_model:   c.has_model ?? false,
      specs:       c.specs,
    });
  }
}

const { data: upserted, error } = await supabase
  .from('components')
  .upsert(rows, { onConflict: 'id' })
  .select();

if (error) {
  console.error('Seed failed:', error);
  process.exit(1);
}
console.log(`Seeded ${upserted.length} components.`);
