import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const notoSansKr = Noto_Sans_KR({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
    display: 'swap',
})

export const metadata: Metadata = {
    title: '숲파트너스 투자 수익 시뮬레이터',
    description: '고객님의 투자 목적과 성향에 맞춰 가장 적합한 전략을 제안드립니다',
    keywords: ['투자', '수익 시뮬레이터', '숲파트너스', '자산관리'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko" className={notoSansKr.className}>
            <body>
                <Header />
                <main className="min-h-[calc(100vh-200px)] py-10">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
