import './globals.css'

export const metadata = {
  title: 'Học Vui – Học vui mỗi ngày',
  description: 'Luyện tập đa môn Toán, Tiếng Việt, Tiếng Anh cho lớp 1–5 thông qua hệ thống trò chơi hấp dẫn, giúp trẻ tự giác và yêu thích học tập.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        {/* Preconnect for faster Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Body fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Nunito+Sans:wght@400;600;700;800;900&display=swap"
        />

        {/* Material Symbols Outlined — REQUIRED for all icons */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />

        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body>{children}</body>
    </html>
  )
}

