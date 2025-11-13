interface RatingProps {
  value: number; // 평점 값 (0-5)
  max?: number; // 최대 별 개수 (기본 5)
  size?: 'sm' | 'md' | 'lg'; // 크기
  showValue?: boolean; // 숫자 표시 여부
  onChange?: (value: number) => void; // 클릭 가능 여부
  onHover?: (value: number) => void; // 호버 이벤트
  readonly?: boolean; // 읽기 전용
  className?: string;
}

const Rating = ({
  value,
  max = 5,
  size = 'md',
  showValue = false,
  onChange,
  onHover,
  readonly = false,
  className = '',
}: RatingProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const handleClick = (starValue: number) => {
    if (!readonly && onChange) {
      onChange(starValue);
    }
  };

  const handleHover = (starValue: number) => {
    if (!readonly && onHover) {
      onHover(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly && onHover) {
      onHover(0);
    }
  };

  const renderStar = (index: number) => {
    const starValue = index + 1;
    const isFilled = starValue <= value;
    const isHalfFilled = !isFilled && starValue - 0.5 <= value;

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(starValue)}
        onMouseEnter={() => handleHover(starValue)}
        onMouseLeave={handleMouseLeave}
        disabled={readonly && !onChange}
        className={`transition-all ${
          !readonly && onChange
            ? 'cursor-pointer hover:scale-110'
            : 'cursor-default'
        }`}
      >
        {isHalfFilled ? (
          // 반별 (0.5점용)
          <svg
            className={`${sizeClasses[size]} text-yellow-400`}
            viewBox="0 0 20 20"
          >
            <defs>
              <linearGradient id={`half-${index}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#half-${index})`}
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
        ) : (
          // 전체 별
          <svg
            className={`${sizeClasses[size]} ${
              isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
      </button>
    );
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* 별 표시 */}
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, index) => renderStar(index))}
      </div>

      {/* 숫자 표시 */}
      {showValue && (
        <span className={`font-semibold text-gray-900 ml-1 ${textSizeClasses[size]}`}>
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default Rating;
