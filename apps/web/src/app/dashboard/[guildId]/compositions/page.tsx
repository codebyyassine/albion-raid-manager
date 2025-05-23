"use server";

import CompositionList from "@/components/compositions/CompositionList";
import { Page, PageTitle } from "@/components/ui/page";
import { prisma } from "@albion-raid-manager/database";
import { CompositionPageProps } from "./types";

export default async function CompositionsPage({ params }: CompositionPageProps) {
  const { guildId } = await params;

  const compositions = await prisma.composition.findMany({
    where: {
      guildId: guildId,
    },
    include: {
      _count: {
        select: {
          builds: true,
        },
      },
    },
  });

  return (
    <Page>
      <PageTitle>Compositions</PageTitle>

      <CompositionList compositions={compositions} />
    </Page>
  );
}
