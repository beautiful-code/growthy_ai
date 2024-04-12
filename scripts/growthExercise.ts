const xml_text: string = `<BlogArticle>
<Title name="Embarking on the Journey of Sanskrit: A Personal Odyssey" />
<Outline>
  <Section name="Introduction to My Sanskrit Journey">
    <Task name="Share personal background" uuid = "4f204905-9fab-4344-ae93-bcd410af7d78"/>
    <Task name="Explain motivations for learning Sanskrit" uuid = "4c673990-4b65-4419-9f11-7cc982e74f69"/>
  </Section>
  <Section name="Discovering The Sanskrit Channel">
    <Task name="Describe how I found The Sanskrit Channel" uuid = "cdeb71a6-d4fd-4921-9043-cc67e793eed9"/>
    <Task name="Discuss resources and content available on The Sanskrit Channel" uuid = "8a946268-5908-4ab1-bb30-b6530ca6c332"/>
  </Section>
  <Section name="My Daily Sanskrit Learning Routine">     
    <Task name="Outline daily learning schedule" uuid = "4e6206c4-529e-41d5-9fc1-2a1c11bf2913"/>
    <Task name="Discuss time management strategies for learning" uuid = "638bbaf4-71ea-4ffa-8845-730c1fb060ad"/>
  </Section>
  <Section name="Reflections and Impressions">
    <Task name="Share initial impressions of learning Sanskrit" uuid = "9792ce3c-b84a-4e9b-9d48-19c9e72a48f8"/>
    <Task name="Discuss challenges faced and how they were overcome" uuid = "268d7027-8800-4116-96eb-93d0d554d8ad"/>
  </Section>
</Outline>
</BlogArticle>`

export const growthExerciseTableScript: string = `
insert into
  public.growth_exercise
  (
    id,
    created_at,
    inputs,
    state,
    user_id,
    guild_id,
    type,
    xml_text
  )
values
  (
    gen_random_uuid (),
    now(),
    '{"title": "dummy title", "about": "dummy about"}',
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
    'blog-article',
    '${xml_text}'
  ),
  (
    gen_random_uuid (),
    now(),
    '{"title": "dummy title", "about": "dummy about"}',
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
    'blog-article',
    '${xml_text}'
  ),
  (
    gen_random_uuid (),
    now(),
    '{"title": "dummy title", "about": "dummy about"}',
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
    'blog-article',
    '${xml_text}'
  ),
  (
    gen_random_uuid (),
    now(),
    '{"title": "dummy title", "about": "dummy about"}',
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
    'study-exercise',
    '${xml_text}'
  ),
  (
    gen_random_uuid (),
    now(),
    '{"title": "dummy title", "about": "dummy about"}',
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
    'study-exercise',
    '${xml_text}'
  );
`;

