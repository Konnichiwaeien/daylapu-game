import Link from 'next/link';

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: '#2C1810' }}
    >
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4">🐾</div>

        <h1
          className="text-lg font-bold mb-1"
          style={{ color: '#8B6914' }}
        >
          МИССИЯ:
        </h1>
        <h2
          className="text-5xl font-bold mb-6"
          style={{ color: '#D4A843' }}
        >
          ДАЙ ЛАПУ
        </h2>

        <p
          className="text-lg mb-8"
          style={{ color: '#F5E6CC' }}
        >
          Казуальный платформер о спасении бездомных животных
          на улицах Сургута
        </p>

        <Link
          href="/game"
          className="inline-block px-10 py-4 rounded-xl text-xl font-bold transition-colors"
          style={{
            backgroundColor: '#4A7C59',
            color: '#FFFFFF',
          }}
        >
          ИГРАТЬ
        </Link>

        <div className="mt-12 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl mb-2">🐕</div>
            <div style={{ color: '#D4A843' }} className="text-sm font-bold">3 уровня</div>
            <div style={{ color: '#8B6914' }} className="text-xs">Городские улицы, стройка, зимний Сургут</div>
          </div>
          <div>
            <div className="text-3xl mb-2">🐾</div>
            <div style={{ color: '#D4A843' }} className="text-sm font-bold">Монеты-лапки</div>
            <div style={{ color: '#8B6914' }} className="text-xs">Собирай и помогай реальному приюту</div>
          </div>
          <div>
            <div className="text-3xl mb-2">❤️</div>
            <div style={{ color: '#D4A843' }} className="text-sm font-bold">Коллекция</div>
            <div style={{ color: '#8B6914' }} className="text-xs">Спасённые питомцы в твоей коллекции</div>
          </div>
        </div>

        <p
          className="mt-12 text-xs"
          style={{ color: '#666' }}
        >
          Благотворительный фонд «Дай лапу» — Сургут
        </p>
      </div>
    </main>
  );
}
