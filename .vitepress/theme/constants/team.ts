import type { DefaultTheme } from "vitepress";

export interface TeamMember extends DefaultTheme.TeamMember {
  id: string;
}

export const CORE_MEMBERS: TeamMember[] = [
  {
    id: "7086cmd",
    title: "Blogger",
    name: "Ethan Goh",
    avatar: "https://www.github.com/7086cmd.png",
    links: [
      { icon: "github", link: "https://github.com/7086cmd" },
      { icon: "twitter", link: "https://twitter.com/7086cmd" },
      { icon: "instagram", link: "https://instagram.com/7086cmd" },
    ],
  },
];

export const TEAM_MEMBERS_MAP: Record<TeamMember["id"], TeamMember> =
  Object.fromEntries(
    CORE_MEMBERS.map(({ id, ...rest }) => [id, { id, ...rest }]),
  );
