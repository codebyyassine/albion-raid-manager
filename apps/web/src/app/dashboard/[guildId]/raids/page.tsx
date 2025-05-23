import { prisma } from "@albion-raid-manager/database";
import { RaidsProvider } from "./context";
import { RaidList } from "./list";
import { RaidsPageProps } from "./types";

export default async function RaidsPage({ params }: RaidsPageProps) {
  const { guildId } = await params;
  const raids = await prisma.raid.findMany({
    where: {
      guildId: guildId,
    },
  });

  return (
    <RaidsProvider raids={raids}>
      <RaidList />
    </RaidsProvider>
  );
}
