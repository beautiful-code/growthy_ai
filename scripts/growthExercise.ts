export const growthExerciseTableScript: string = `
insert into
  public.growth_exercise
  (
    id,
    created_at,
    inputs,
    title,
    state,
    user_id,
    guild_id,
    type
  )
values
  (
    gen_random_uuid (),
    now(),
    '{"title": "dummy title", "about": "dummy about"}',
    'Dummy Exercise 1',
    'active',
    (
      select
        id
      from
        public.users
      order by
        random()
      limit
        1
    ),
    (
      select
        id
      from
        public.guilds
      order by
        random()
      limit
        1
    ),
    'blog-article'
  ),
  (
    gen_random_uuid (),
    now(),
    '{"title": "dummy title", "about": "dummy about"}',
    'Dummy Exercise 2',
    'inactive',
    (
      select
        id
      from
        public.users
      order by
        random()
      limit
        1
    ),
    (
      select
        id
      from
        public.guilds
      order by
        random()
      limit
        1
    ),
    'blog-article'
  ),
  (
    gen_random_uuid (),
    now(),
    '{"title": "dummy title", "about": "dummy about"}',
    'Dummy Exercise 3',
    'active',
    (
      select
        id
      from
        public.users
      order by
        random()
      limit
        1
    ),
    (
      select
        id
      from
        public.guilds
      order by
        random()
      limit
        1
    ),
    'blog-article'
  ),
  (
    gen_random_uuid (),
    now(),
    '{"title": "dummy title", "about": "dummy about"}',
    'Dummy Exercise 4',
    'inactive',
    (
      select
        id
      from
        public.users
      order by
        random()
      limit
        1
    ),
    (
      select
        id
      from
        public.guilds
      order by
        random()
      limit
        1
    ),
    'study-exercise'
  ),
  (
    gen_random_uuid (),
    now(),
    '{"title": "dummy title", "about": "dummy about"}',
    'Dummy Exercise 5',
    'active',
    (
      select
        id
      from
        public.users
      order by
        random()
      limit
        1
    ),
    (
      select
        id
      from
        public.guilds
      order by
        random()
      limit
        1
    ),
    'study-exercise'
  );
`;

