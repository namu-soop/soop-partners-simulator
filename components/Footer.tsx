export default function Footer() {
    return (
        <footer className="bg-primary text-white py-5 mt-16 text-center">
            <div className="container mx-auto px-6">
                <p className="text-sm opacity-50 mb-1">
                    &copy; 2025 숲파트너스 투자 시뮬레이터. All rights reserved.
                </p>
                <p className="text-xs opacity-40 leading-relaxed">
                    본 시뮬레이터는 예상 수익을 안내하기 위한 참고 자료이며, 실제 수익과 다를 수 있습니다.<br />
                    세부 세무 처리는 고객님의 상황에 따라 달라질 수 있으니, 전문가와 상담하시기 바랍니다.
                </p>
            </div>
        </footer>
    );
}
