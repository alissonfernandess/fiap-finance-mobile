import { Providers } from './providers';
import { RootContent } from './root-content';

export default function RootLayout() {
  return (
    <Providers>
      <RootContent />
    </Providers>
  );
}