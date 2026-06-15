import './globals.css'

export const metadata = {
  title: 'Học Vui – Học vui mỗi ngày',
  description: 'Luyện tập đa môn Toán, Tiếng Việt, Tiếng Anh cho lớp 1–5 thông qua hệ thống trò chơi hấp dẫn, giúp trẻ tự giác và yêu thích học tập.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
