import { Providers } from "./providers";

export const metadata = {
  title: "NeuroCircles",
  description: "Friend matching app for neurodiverse children",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
