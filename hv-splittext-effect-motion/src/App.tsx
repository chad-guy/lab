import { SplitText, SplitTextChar } from "./components";

function App() {
  return (
    <main className="h-screen w-full bg-[#1e1e1e] text-white flex flex-col items-center justify-center gap-4">
      {/* <SplitText href="https://www.google.com">INDEX</SplitText> */}
      <SplitTextChar href="https://www.google.com" label="CONTACT" />
    </main>
  );
}

export default App;
