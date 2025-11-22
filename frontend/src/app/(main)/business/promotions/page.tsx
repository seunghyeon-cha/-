'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { AxiosError } from 'axios';
import {
  getMyPromotions,
  getPromotionsByPlace,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionStatus,
} from '@/lib/api/promotions';
import { getMyPlaces } from '@/lib/api/business';
import type { Promotion, CreatePromotionDto } from '@/types/business';
import type { MyPlace } from '@/types/business';
import { toast } from '@/stores/toastStore';

type PromotionStatus = 'all' | 'active' | 'scheduled' | 'ended';
type ActiveFilter = 'all' | 'active' | 'inactive';

export default function PromotionsPage() {
  const searchParams = useSearchParams();
  const urlPlaceId = searchParams.get('placeId');

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [places, setPlaces] = useState<MyPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(urlPlaceId || 'all');
  const [statusFilter, setStatusFilter] = useState<PromotionStatus>('all');
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState<CreatePromotionDto>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    isActive: true,
  });
  const [selectedPlaceForCreate, setSelectedPlaceForCreate] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [promotionsData, placesData] = await Promise.all([
        getMyPromotions(),
        getMyPlaces(),
      ]);
      setPromotions(promotionsData);
      setPlaces(placesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPromotions = useCallback(async () => {
    try {
      const data = await getMyPromotions();
      setPromotions(data);
    } catch (error) {
      console.error('Failed to load promotions:', error);
      toast.error('프로모션 목록을 불러오는데 실패했습니다');
    }
  }, []);

  const loadPromotionsByPlace = useCallback(async () => {
    if (selectedPlaceId === 'all') return;

    try {
      const data = await getPromotionsByPlace(selectedPlaceId, true);
      setPromotions(data);
    } catch (error) {
      console.error('Failed to load place promotions:', error);
      toast.error('프로모션 목록을 불러오는데 실패했습니다');
    }
  }, [selectedPlaceId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (urlPlaceId && urlPlaceId !== selectedPlaceId) {
      setSelectedPlaceId(urlPlaceId);
    }
  }, [urlPlaceId, selectedPlaceId]);

  useEffect(() => {
    if (selectedPlaceId !== 'all') {
      loadPromotionsByPlace();
    } else {
      loadPromotions();
    }
  }, [selectedPlaceId, loadPromotionsByPlace, loadPromotions]);

  const handleCreateClick = () => {
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
    setSelectedPlaceForCreate(selectedPlaceId !== 'all' ? selectedPlaceId : '');
    setShowModal(true);
  };

  const handleEditClick = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      startDate: promotion.startDate.split('T')[0],
      endDate: promotion.endDate.split('T')[0],
      isActive: promotion.isActive,
    });
    setSelectedPlaceForCreate(promotion.placeId);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검증
    if (!selectedPlaceForCreate) {
      toast.error('업장을 선택해주세요');
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('종료일은 시작일보다 이후여야 합니다');
      return;
    }

    try {
      if (editingPromotion) {
        await updatePromotion(editingPromotion.id, formData);
        toast.success('프로모션이 수정되었습니다');
      } else {
        await createPromotion(selectedPlaceForCreate, formData);
        toast.success('프로모션이 생성되었습니다');
      }

      setShowModal(false);
      if (selectedPlaceId !== 'all') {
        loadPromotionsByPlace();
      } else {
        loadPromotions();
      }
    } catch (error) {
      console.error('Failed to save promotion:', error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || '프로모션 저장에 실패했습니다');
      } else {
        toast.error('프로모션 저장에 실패했습니다');
      }
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`"${title}" 프로모션을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deletePromotion(id);
      toast.success('프로모션이 삭제되었습니다');
      if (selectedPlaceId !== 'all') {
        loadPromotionsByPlace();
      } else {
        loadPromotions();
      }
    } catch (error) {
      console.error('Failed to delete promotion:', error);
      toast.error('프로모션 삭제에 실패했습니다');
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await togglePromotionStatus(id);
      if (selectedPlaceId !== 'all') {
        loadPromotionsByPlace();
      } else {
        loadPromotions();
      }
    } catch (error) {
      console.error('Failed to toggle promotion:', error);
      toast.error('프로모션 상태 변경에 실패했습니다');
    }
  };

  const getPromotionStatus = (startDate: string, endDate: string, isActive: boolean) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < now) {
      return { label: '종료', color: 'bg-gray-100 text-gray-800', emoji: '⚫' };
    }
    if (start > now) {
      return { label: '예정', color: 'bg-yellow-100 text-yellow-800', emoji: '🟡' };
    }
    if (isActive) {
      return { label: '진행중', color: 'bg-green-100 text-green-800', emoji: '🟢' };
    }
    return { label: '일시중지', color: 'bg-red-100 text-red-800', emoji: '🔴' };
  };

  // 필터링된 프로모션
  const filteredPromotions = promotions.filter((promo) => {
    const status = getPromotionStatus(promo.startDate, promo.endDate, promo.isActive);

    // 상태 필터
    if (statusFilter === 'active' && status.label !== '진행중') return false;
    if (statusFilter === 'scheduled' && status.label !== '예정') return false;
    if (statusFilter === 'ended' && status.label !== '종료') return false;

    // 활성 필터
    if (activeFilter === 'active' && !promo.isActive) return false;
    if (activeFilter === 'inactive' && promo.isActive) return false;

    return true;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">프로모션 관리</h1>
            <p className="mt-1 text-sm text-gray-600">
              총 {filteredPromotions.length}개의 프로모션
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            + 프로모션 생성
          </button>
        </div>

        {/* 필터 */}
        <div className="flex flex-wrap gap-3">
          {/* 업장 필터 */}
          <select
            value={selectedPlaceId}
            onChange={(e) => setSelectedPlaceId(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체 업장</option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>

          {/* 상태 필터 */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PromotionStatus)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체 상태</option>
            <option value="active">진행중</option>
            <option value="scheduled">예정</option>
            <option value="ended">종료</option>
          </select>

          {/* 활성 필터 */}
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">전체</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
        </div>
      </div>

      {/* 프로모션 테이블 */}
      {filteredPromotions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            프로모션이 없습니다
          </h3>
          <p className="text-gray-600 mb-6">
            새로운 프로모션을 생성하여 고객에게 특별한 혜택을 제공하세요
          </p>
          <button
            onClick={handleCreateClick}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            프로모션 생성
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    업장
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    기간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    활성
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    액션
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPromotions.map((promotion) => {
                  const status = getPromotionStatus(
                    promotion.startDate,
                    promotion.endDate,
                    promotion.isActive
                  );
                  const placeName = places.find((p) => p.id === promotion.placeId)?.name || '-';

                  return (
                    <tr key={promotion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {promotion.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {promotion.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{placeName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(promotion.startDate).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                          })}
                          {' ~ '}
                          {new Date(promotion.endDate).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}
                        >
                          {status.emoji} {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(promotion.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                            promotion.isActive ? 'bg-primary-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              promotion.isActive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditClick(promotion)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(promotion.id, promotion.title)}
                          className="text-red-600 hover:text-red-900"
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 생성/수정 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingPromotion ? '프로모션 수정' : '프로모션 생성'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 업장 선택 */}
                {!editingPromotion && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      업장 선택 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedPlaceForCreate}
                      onChange={(e) => setSelectedPlaceForCreate(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">업장을 선택하세요</option>
                      {places.map((place) => (
                        <option key={place.id} value={place.id}>
                          {place.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    maxLength={100}
                    placeholder="예: 봄맞이 특별 할인"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* 설명 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    설명 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="프로모션 내용을 자세히 입력하세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* 기간 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      종료일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* 활성 여부 */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                    즉시 활성화
                  </label>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingPromotion ? '수정' : '생성'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
