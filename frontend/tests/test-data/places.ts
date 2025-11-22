export const testPlaces = {
  searchKeyword: '서울',
  expectedPlace: '경복궁',
  category: {
    tourist: 'TOURIST',
    restaurant: 'RESTAURANT',
    accommodation: 'ACCOMMODATION',
  },
};

export const testBoards = {
  title: `E2E 테스트 게시글 ${Date.now()}`,
  content: '이것은 자동화 테스트로 작성된 게시글입니다. 자동으로 삭제됩니다.',
  updatedTitle: `E2E 테스트 게시글 (수정됨) ${Date.now()}`,
  updatedContent: '게시글 내용이 수정되었습니다.',
  category: 'COMMUNITY',
};

export const testItinerary = {
  title: `E2E 테스트 여행 ${Date.now()}`,
  region: '서울',
  startDate: '2025-12-01',
  endDate: '2025-12-03',
  updatedTitle: `E2E 테스트 여행 (수정됨) ${Date.now()}`,
  updatedRegion: '제주',
};
