import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';

// biome-ignore lint/style/noNonNullAssertion: `index.html` is a static file with a known content
const root = createRoot(document.getElementById('root')!);
root.render(<App/>);
