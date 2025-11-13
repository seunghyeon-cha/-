import Rating from '@/components/common/Rating';

interface RatingDistributionProps {
  ratings: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
  averageRating: number;
}

const RatingDistribution = ({
  ratings,
  totalReviews,
  averageRating,
}: RatingDistributionProps) => {
  // 각 평점의 퍼센트 계산
  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  const ratingLevels = [5, 4, 3, 2, 1] as const;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      {/* 전체 평균 평점 */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">평균 평점</h3>
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <div>
              <Rating value={averageRating} size="md" readonly />
              <p className="text-sm text-gray-600 mt-1">
                총 {totalReviews.toLocaleString()}개 리뷰
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 평점 분포 차트 */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">평점 분포</h4>
        {ratingLevels.map((level) => {
          const count = ratings[level];
          const percentage = getPercentage(count);

          return (
            <div key={level} className="flex items-center gap-3">
              {/* 별 개수 */}
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm font-medium text-gray-700">
                  {level}점
                </span>
              </div>

              {/* 프로그레스 바 */}
              <div className="flex-1 relative h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* 퍼센트 및 개수 */}
              <div className="flex items-center gap-2 w-24 text-right">
                <span className="text-sm font-medium text-gray-900 w-12">
                  {percentage}%
                </span>
                <span className="text-xs text-gray-500 w-12">
                  ({count})
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 통계 정보 */}
      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary-600">
            {Math.round((ratings[5] / totalReviews) * 100) || 0}%
          </p>
          <p className="text-xs text-gray-600 mt-1">5점 비율</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {Math.round(((ratings[5] + ratings[4]) / totalReviews) * 100) || 0}%
          </p>
          <p className="text-xs text-gray-600 mt-1">4점 이상 비율</p>
        </div>
      </div>
    </div>
  );
};

export default RatingDistribution;
