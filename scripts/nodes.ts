export const nodesTableScript: string = `
insert into
public.nodes (
  id,
  created_at,
  updated_at,
  growth_exercise_id,
  text,
  rel_order,
  is_task,
  is_checked,
  parent_id
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
      public.growth_exercise
    order by
      random()
    limit
      1
  ),
  'Dummy Data 1',
  1.0,
  true,
  false,
  (
    select
      id
    from
      public.nodes
    order by
      random()
    limit
      1
  )
),
(
  gen_random_uuid (),
  now(),
  now(),
  (
    select
      id
    from
      public.growth_exercise
    order by
      random()
    limit
      1
  ),
  'Dummy Data 2',
  2.0,
  false,
  true,
  (
    select
      id
    from
      public.nodes
    order by
      random()
    limit
      1
  )
),
(
  gen_random_uuid (),
  now(),
  now(),
  (
    select
      id
    from
      public.growth_exercise
    order by
      random()
    limit
      1
  ),
  'Dummy Data 3',
  3.0,
  true,
  true,
  (
    select
      id
    from
      public.nodes
    order by
      random()
    limit
      1
  )
),
(
  gen_random_uuid (),
  now(),
  now(),
  (
    select
      id
    from
      public.growth_exercise
    order by
      random()
    limit
      1
  ),
  'Dummy Data 4',
  4.0,
  false,
  false,
  (
    select
      id
    from
      public.nodes
    order by
      random()
    limit
      1
  )
),
(
  gen_random_uuid (),
  now(),
  now(),
  (
    select
      id
    from
      public.growth_exercise
    order by
      random()
    limit
      1
  ),
  'Dummy Data 5',
  5.0,
  true,
  true,
  (
    select
      id
    from
      public.nodes
    order by
      random()
    limit
      1
  )
);
`;
