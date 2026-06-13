import { MaterialForm } from "#/feature/materials/components/MaterialForm";

export default function NewMaterialPage() {
  return (
    <div className="px-4 py-6 space-y-6 pb-24">
      <h1 className="text-2xl font-bold">New Material</h1>
      <MaterialForm />
    </div>
  );
}
