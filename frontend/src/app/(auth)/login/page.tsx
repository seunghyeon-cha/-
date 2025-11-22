'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AxiosError } from 'axios';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import { login } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';

const loginSchema = z.object({
  email: z.string().email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await login({
        email: data.email,
        password: data.password,
      });

      // 인증 정보 저장
      setAuth(response.user, response.accessToken, response.refreshToken);

      // 성공 토스트 표시
      toast.success('로그인되었습니다');

      // 메인 페이지로 이동
      router.push('/');
    } catch (error) {
      // API 인터셉터에서 에러 토스트를 이미 표시함
      // apiError는 유지 (폼 하단에 표시용)
      if (error instanceof AxiosError) {
        setApiError(
          error.response?.data?.message || '로그인에 실패했습니다. 다시 시도해주세요.',
        );
      } else {
        setApiError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding="lg">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
          예
        </div>
        <h2 className="text-2xl font-bold text-primary-700 mb-2">
          Smartrip에 로그인
        </h2>
        <p className="text-sm text-gray-600">국내 여행의 모든 것</p>
      </div>

      {/* 에러 메시지 */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-error rounded-lg text-sm text-error">
          {apiError}
        </div>
      )}

      {/* 로그인 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="이메일"
          type="email"
          placeholder="user@smartrip.com"
          fullWidth
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="비밀번호"
          type="password"
          placeholder="8자 이상"
          fullWidth
          error={errors.password?.message}
          {...register('password')}
        />

        {/* 로그인 유지 체크박스 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            className="w-[18px] h-[18px] border border-gray-300 rounded text-primary-500 focus:ring-primary-500"
            {...register('rememberMe')}
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
            로그인 상태 유지
          </label>
        </div>

        {/* 로그인 버튼 */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          로그인
        </Button>
      </form>

      {/* 구분선 */}
      <div className="flex items-center my-8">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">또는</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* 소셜 로그인 */}
      <div className="space-y-3">
        <Button
          type="button"
          fullWidth
          className="bg-[#FEE500] text-black hover:bg-[#FDD800] h-11"
          onClick={() => toast.info('카카오 로그인은 준비 중입니다')}
        >
          <span className="font-semibold">카카오로 계속하기</span>
        </Button>

        <Button
          type="button"
          fullWidth
          className="bg-[#03C75A] text-white hover:bg-[#02B350] h-11"
          onClick={() => toast.info('네이버 로그인은 준비 중입니다')}
        >
          <span className="font-semibold">네이버로 계속하기</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          fullWidth
          className="border-gray-300 text-gray-700 h-11"
          onClick={() => toast.info('구글 로그인은 준비 중입니다')}
        >
          <span className="font-semibold">구글로 계속하기</span>
        </Button>
      </div>

      {/* 회원가입 링크 */}
      <div className="mt-8 text-center text-sm">
        <span className="text-gray-600">아직 계정이 없으신가요? </span>
        <Link
          href="/signup"
          className="text-primary-600 font-bold hover:text-primary-700"
        >
          회원가입
        </Link>
      </div>
    </Card>
  );
}
