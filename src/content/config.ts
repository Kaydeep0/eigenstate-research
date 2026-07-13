import { defineCollection, z } from 'astro:content';

const reports = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    entity_display: z.string(),
    date: z.string(),
    date_iso: z.string(),
    phi_s: z.number(),
    kappa: z.number(),
    vault_records: z.number(),
  }),
});

const predictions = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    status: z.enum(['pending', 'confirmed', 'refuted']),
    logged_at: z.string(),
    gap_id: z.string(),
    title: z.string(),
    claim: z.string(),
    falsifiable_condition: z.string(),
    engine_signal: z.object({
      gap_score: z.number(),
      gap_ratio: z.number(),
      delta_i: z.number(),
      settlement_leverage_normalized: z.number().optional(),
      settlement_leverage: z.number().optional(),
      days_to_expiry: z.number(),
      flag: z.string(),
      curl_confirmed: z.boolean(),
      curl_confirmed_source: z.string().optional(),
      expiry_schedule: z.string().optional(),
      extraction_window: z.string().optional(),
      vault_record_ref: z.string().optional(),
      overlay_entities: z.array(z.string()),
      primary_entity: z.string(),
    }),
    on_chain_proof: z.object({
      chain: z.string(),
      claim_id: z.number(),
      block_number: z.number(),
      tx_hash: z.string(),
      committed_at: z.string(),
      vault_fingerprint: z.string(),
      basescan_url: z.string(),
    }),
    confirmation: z
      .object({
        confirmed_at: z.string().optional(),
        source_url: z.string().optional(),
        note: z.string().optional(),
      })
      .nullable(),
    notes: z.string(),
  }),
});

export const collections = { reports, predictions };
