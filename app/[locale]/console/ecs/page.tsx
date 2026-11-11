import { Suspense } from "react";
import EcsPage from "@/components/console/EcsPage";
export default function Page() {
  return (
    <Suspense>
      <EcsPage />
    </Suspense>
  );
}
