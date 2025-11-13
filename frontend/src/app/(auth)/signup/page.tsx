'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Card from '@/components/common/Card';
import { signup } from '@/lib/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { toast } from '@/stores/toastStore';

const signupSchema = z
  .object({
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다')
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
        '영문, 숫자, 특수문자를 포함해야 합니다',
      ),
    passwordConfirm: z.string(),
    name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
    phone: z.string().optional(),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: '이용약관에 동의해주세요',
    }),
    agreePrivacy: z.boolean().refine((val) => val === true, {
      message: '개인정보처리방침에 동의해주세요',
    }),
    agreeMarketing: z.boolean().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['passwordConfirm'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password');
  const passwordConfirm = watch('passwordConfirm');

  // 비밀번호 강도 계산
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return null;
    if (pwd.length < 8) return 'weak';
    const hasLetter = /[A-Za-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@$!%*#?&]/.test(pwd);
    if (hasLetter && hasNumber && hasSpecial) return 'strong';
    if ((hasLetter && hasNumber) || (hasLetter && hasSpecial)) return 'medium';
    return 'weak';
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setApiError(null);

      const response = await signup({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
      });

      // 자동 로그인
      setAuth(response.user, response.accessToken, response.refreshToken);

      // 성공 토스트 표시
      toast.success('회원가입이 완료되었습니다');

      // 메인 페이지로 이동
      router.push('/');
    } catch (error: any) {
      // API 인터셉터에서 에러 토스트를 이미 표시함
      setApiError(
        error.response?.data?.message ||
          '회원가입에 실패했습니다. 다시 시도해주세요.',
      );
    } finally{
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
          예림투어 회원가입
        </h2>
        <p className="text-sm text-gray-600">함께 만드는 여행 이야기</p>
      </div>

      {/* 에러 메시지 */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-error rounded-lg text-sm text-error">
          {apiError}
        </div>
      )}

      {/* 회원가입 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label="이메일 *"
          type="email"
          placeholder="user@yerimtour.com"
          fullWidth
          error={errors.email?.message}
          {...register('email')}
        />

        <div>
          <Input
            label="비밀번호 *"
            type="password"
            placeholder="8자 이상, 영문+숫자+특수문자"
            fullWidth
            error={errors.password?.message}
            {...register('password')}
          />
          {password && passwordStrength && (
            <div className="mt-2">
              <div className="flex gap-1">
                <div
                  className={`h-1 flex-1 rounded ${passwordStrength === 'weak' ? 'bg-error' : 'bg-gray-200'}`}
                ></div>
                <div
                  className={`h-1 flex-1 rounded ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'bg-yellow-500' : 'bg-gray-200'}`}
                ></div>
                <div
                  className={`h-1 flex-1 rounded ${passwordStrength === 'strong' ? 'bg-success' : 'bg-gray-200'}`}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {passwordStrength === 'weak' && '약한 비밀번호'}
                {passwordStrength === 'medium' && '보통 비밀번호'}
                {passwordStrength === 'strong' && '강한 비밀번호'}
              </p>
            </div>
          )}
        </div>

        <Input
          label="비밀번호 확인 *"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          fullWidth
          error={errors.passwordConfirm?.message}
          success={
            passwordConfirm && password === passwordConfirm
              ? '비밀번호가 일치합니다'
              : undefined
          }
          {...register('passwordConfirm')}
        />

        <Input
          label="이름 *"
          type="text"
          placeholder="홍길동"
          fullWidth
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="전화번호"
          type="tel"
          placeholder="010-1234-5678"
          fullWidth
          error={errors.phone?.message}
          {...register('phone')}
        />

        {/* 약관 동의 */}
        <div className="space-y-3 pt-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeTerms"
              className="w-[18px] h-[18px] border border-gray-300 rounded text-primary-500 focus:ring-primary-500 mt-0.5"
              {...register('agreeTerms')}
            />
            <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-700">
              <span className="text-error">*</span> [필수] 이용약관 동의{' '}
              <a
                href="#"
                className="text-primary-600 text-xs underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('이용약관 모달 (준비 중)');
                }}
              >
                보기
              </a>
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-xs text-error ml-6">{errors.agreeTerms.message}</p>
          )}

          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreePrivacy"
              className="w-[18px] h-[18px] border border-gray-300 rounded text-primary-500 focus:ring-primary-500 mt-0.5"
              {...register('agreePrivacy')}
            />
            <label htmlFor="agreePrivacy" className="ml-2 text-sm text-gray-700">
              <span className="text-error">*</span> [필수] 개인정보처리방침 동의{' '}
              <a
                href="#"
                className="text-primary-600 text-xs underline"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info('개인정보처리방침 모달 (준비 중)');
                }}
              >
                보기
              </a>
            </label>
          </div>
          {errors.agreePrivacy && (
            <p className="text-xs text-error ml-6">{errors.agreePrivacy.message}</p>
          )}

          <div className="flex items-start">
            <input
              type="checkbox"
              id="agreeMarketing"
              className="w-[18px] h-[18px] border border-gray-300 rounded text-primary-500 focus:ring-primary-500 mt-0.5"
              {...register('agreeMarketing')}
            />
            <label htmlFor="agreeMarketing" className="ml-2 text-sm text-gray-700">
              [선택] 마케팅 정보 수신 동의
            </label>
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
        >
          회원가입
        </Button>
      </form>

      {/* 구분선 */}
      <div className="flex items-center my-8">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">또는</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* 소셜 회원가입 */}
      <div className="space-y-3">
        <Button
          type="button"
          fullWidth
          className="bg-[#FEE500] text-black hover:bg-[#FDD800] h-11"
          onClick={() => toast.info('카카오 회원가입은 준비 중입니다')}
        >
          <span className="font-semibold">카카오로 계속하기</span>
        </Button>

        <Button
          type="button"
          fullWidth
          className="bg-[#03C75A] text-white hover:bg-[#02B350] h-11"
          onClick={() => toast.info('네이버 회원가입은 준비 중입니다')}
        >
          <span className="font-semibold">네이버로 계속하기</span>
        </Button>

        <Button
          type="button"
          variant="outline"
          fullWidth
          className="border-gray-300 text-gray-700 h-11"
          onClick={() => toast.info('구글 회원가입은 준비 중입니다')}
        >
          <span className="font-semibold">구글로 계속하기</span>
        </Button>
      </div>

      {/* 로그인 링크 */}
      <div className="mt-8 text-center text-sm">
        <span className="text-gray-600">이미 계정이 있으신가요? </span>
        <Link
          href="/login"
          className="text-primary-600 font-bold hover:text-primary-700"
        >
          로그인
        </Link>
      </div>
    </Card>
  );
}
