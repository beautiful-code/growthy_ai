export const guildsTableScript: string = `
insert into
  public.guilds (id, created_at, led_by, name)
values
  (gen_random_uuid (), now(), '891c117c-bde4-48e3-ab9e-3f8c476fcd57', 'react'),
  (gen_random_uuid (), now(), '3103e6c5-4e3e-4ee8-9d5d-e1da8059a539', 'golang');
`;
