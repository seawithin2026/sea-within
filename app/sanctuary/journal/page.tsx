import FlowerBloom from "@/components/FlowerBloom";

export default function JournalPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f0ea",
      }}
    >
      <FlowerBloom level={1} />
      <FlowerBloom level={5} />
      <FlowerBloom level={12} />
    </div>
  );
}
