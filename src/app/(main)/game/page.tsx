export const metadata = {
  title: "Боксёрская игра",
};

export default function GamePage() {
  return (
    <div className="w-full" style={{ height: "calc(100vh - 4rem)" }}>
      <iframe
        src="/game/index.html"
        className="w-full h-full border-0"
        allow="autoplay"
      />
    </div>
  );
}
