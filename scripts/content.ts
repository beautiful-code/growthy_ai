export const contentTableScript: string = `
insert into
public.content (
  id,
  created_at,
  updated_at,
  node_id,
  data
)
values
(
  gen_random_uuid (),
  now(),
  now(),
  (
    select
      id
    from
      public.nodes
    order by
      random()
    limit
      1
  ),
  'Dummy data 1'
),
(
  gen_random_uuid (),
  now(),
  now(),
  (
    select
      id
    from
      public.nodes
    order by
      random()
    limit
      1
  ),
  'Dummy data 2'
),
(
  gen_random_uuid (),
  now(),
  now(),
  (
    select
      id
    from
      public.nodes
    order by
      random()
    limit
      1
  ),
  'Dummy data 3'
),
(
  gen_random_uuid (),
  now(),
  now(),
  (
    select
      id
    from
      public.nodes
    order by
      random()
    limit
      1
  ),
  'Dummy data 4'
),
(
  gen_random_uuid (),
  now(),
  now(),
  (
    select
      id
    from
      public.nodes
    order by
      random()
    limit
      1
  ),
  'Dummy data 5'
);
`;
