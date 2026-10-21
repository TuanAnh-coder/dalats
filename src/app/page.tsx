import { api, HydrateClient } from "~/trpc/server";
import { VillaClientPage } from "./_components/VillaClientPage";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Server-side prefetch rooms for instantaneous hydration
  void api.room.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="w-full max-w-full overflow-x-hidden min-w-0">
        <VillaClientPage />
      </main>
    </HydrateClient>
  );
}
