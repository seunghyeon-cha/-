'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn] = useState(false); // TODO: 실제 인증 상태로 교체

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500">
                <span className="text-xl font-bold text-white">S</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-primary-700">Smartrip</span>
              </div>
            </Link>
          </div>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/places"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              관광지
            </Link>
            <Link
              href="/restaurants"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              맛집
            </Link>
            <Link
              href="/accommodations"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              숙소
            </Link>
            <Link
              href="/festivals"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              축제
            </Link>
            <Link
              href="/boards"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              커뮤니티
            </Link>
            <Link
              href="/itinerary"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              여행일정
            </Link>
          </nav>

          {/* 우측 버튼 */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 검색 아이콘 */}
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="검색"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {isLoggedIn ? (
              <>
                {/* 알림 */}
                <button
                  className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="알림"
                >
                  <svg
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-error"></span>
                </button>

                {/* 프로필 */}
                <button className="flex items-center space-x-2 rounded-full border border-gray-300 p-1 pr-3 hover:border-gray-400 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-700">김</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">김여행</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* 모바일 햄버거 메뉴 */}
          <button
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="메뉴"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-6 w-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/places"
                className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                관광지
              </Link>
              <Link
                href="/restaurants"
                className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                맛집
              </Link>
              <Link
                href="/accommodations"
                className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                숙소
              </Link>
              <Link
                href="/festivals"
                className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                축제
              </Link>
              <Link
                href="/boards"
                className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                커뮤니티
              </Link>
              <Link
                href="/itinerary"
                className="text-base font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                여행일정
              </Link>
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/mypage"
                      className="block text-base font-medium text-gray-700 hover:text-primary-600 transition-colors mb-4"
                    >
                      마이페이지
                    </Link>
                    <button className="w-full text-left text-base font-medium text-gray-700 hover:text-primary-600 transition-colors">
                      로그아웃
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className="block text-center rounded-lg border border-primary-500 px-4 py-2 text-sm font-medium text-primary-500 hover:bg-primary-50 transition-colors"
                    >
                      로그인
                    </Link>
                    <Link
                      href="/signup"
                      className="block text-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors"
                    >
                      회원가입
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
