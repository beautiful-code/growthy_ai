export const notesTableScript: string = `
insert into public.notes (
  id,
  created_at,
  updated_at,
  task_id,
  data
)
values
(
  gen_random_uuid (),
  now(),
  now(),
  '4f204905-9fab-4344-ae93-bcd410af7d78',
  'Dummy data 1'
),
(
  gen_random_uuid (),
  now(),
  now(),
  '4f204905-9fab-4344-ae93-bcd410af7d78',
  'Dummy data 2'
),
(
  gen_random_uuid (),
  now(),
  now(),
  '4f204905-9fab-4344-ae93-bcd410af7d78',
  'Dummy data 3'
),
(
  gen_random_uuid (),
  now(),
  now(),
  'cdeb71a6-d4fd-4921-9043-cc67e793eed9',
  'Dummy data 4'
),
(
  gen_random_uuid (),
  now(),
  now(),
  'cdeb71a6-d4fd-4921-9043-cc67e793eed9',
  'Dummy data 5'
);
`;
