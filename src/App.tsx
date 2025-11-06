import Hero from "./components/Hero";

const App = () => {
  return (
    <main className="relative min-h-screen">
      <Hero />
      <section className="z-0 min-h-screen bg-blue-500"></section>
    </main>
  );
};

export default App;
