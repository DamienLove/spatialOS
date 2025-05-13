import SpatialEnvironment from '@/components/spatial-os/SpatialEnvironment';

export default function SpatialOsPage() {
  return (
    <main className="flex flex-col h-screen w-screen fixed inset-0">
      <SpatialEnvironment />
    </main>
  );
}
