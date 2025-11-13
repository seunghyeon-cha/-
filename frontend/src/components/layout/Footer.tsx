import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* 브랜드 정보 */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
                <span className="text-xl font-bold text-white">예</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary-700">예림투어</span>
                <span className="text-[10px] text-gray-500">YeRim Tour</span>
              </div>
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              국내 여행의 모든 것<br />
              함께 만들어가는 여행 커뮤니티
            </p>
            {/* SNS 링크 */}
            <div className="flex space-x-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 hover:bg-primary-500 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 hover:bg-primary-500 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 hover:bg-primary-500 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* 서비스 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">서비스</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/places?category=TOURIST" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  관광지
                </Link>
              </li>
              <li>
                <Link href="/places?category=RESTAURANT" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  맛집
                </Link>
              </li>
              <li>
                <Link href="/places?category=ACCOMMODATION" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  숙소
                </Link>
              </li>
              <li>
                <Link href="/boards" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  커뮤니티
                </Link>
              </li>
              <li>
                <Link href="/itinerary" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  여행일정
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객지원 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">고객지원</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/notice" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  공지사항
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/business/verify" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  사업자 인증
                </Link>
              </li>
            </ul>
          </div>

          {/* 정책 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">정책</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/location" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                  위치기반서비스 이용약관
                </Link>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">고객센터</h4>
              <p className="text-sm font-semibold text-primary-600">1588-0000</p>
              <p className="text-xs text-gray-500 mt-1">평일 09:00 - 18:00</p>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-xs text-gray-500 text-center md:text-left">
              <p>상호명: (주)예림투어 | 대표: 홍길동</p>
              <p>사업자등록번호: 000-00-00000 | 통신판매업신고: 제2025-서울-00000호</p>
              <p>주소: 서울특별시 강남구 테헤란로 123</p>
              <p className="mt-2">© {currentYear} YeRim Tour. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-xs text-gray-600 hover:text-primary-600 transition-colors">
                한국어
              </button>
              <button className="text-xs text-gray-600 hover:text-primary-600 transition-colors">
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
