'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ItineraryPlace } from '@/types/itinerary';
import { calculateRoute, formatDistance, formatDuration } from '@/lib/utils/mapUtils';

interface DraggablePlaceListProps {
  places: ItineraryPlace[];
  onReorder: (newPlaces: ItineraryPlace[]) => void;
  onUpdate?: (placeId: string, data: Partial<ItineraryPlace>) => void;
  onDelete?: (placeId: string) => void;
  isEditable?: boolean;
  showRouteInfo?: boolean;
}

interface SortablePlaceItemProps {
  place: ItineraryPlace;
  index: number;
  isEditable: boolean;
  onUpdate?: (placeId: string, data: Partial<ItineraryPlace>) => void;
  onDelete?: (placeId: string) => void;
  nextPlace?: ItineraryPlace;
  showRouteInfo: boolean;
}

function SortablePlaceItem({
  place,
  index,
  isEditable,
  onUpdate,
  onDelete,
  nextPlace,
  showRouteInfo,
}: SortablePlaceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: place.id, disabled: !isEditable });

  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [memo, setMemo] = useState(place.memo || '');
  const [visitTime, setVisitTime] = useState(place.visitTime || '');

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveMemo = () => {
    onUpdate?.(place.id, { memo });
    setIsEditingMemo(false);
  };

  const handleSaveTime = () => {
    onUpdate?.(place.id, { visitTime });
    setIsEditingTime(false);
  };

  const route = nextPlace ? calculateRoute(place, nextPlace) : null;

  const hasCoordinates = place.place?.latitude && place.place?.longitude;

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
          isDragging ? 'shadow-lg ring-2 ring-primary-500' : ''
        }`}
      >
        <div className="p-4">
          <div className="flex gap-4">
            {/* 드래그 핸들 */}
            {isEditable && (
              <div
                {...attributes}
                {...listeners}
                className="flex-shrink-0 cursor-grab active:cursor-grabbing hover:bg-gray-100 rounded p-2 -ml-2 -mt-2"
              >
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                </svg>
              </div>
            )}

            {/* 순서 번호 */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
            </div>

            {/* 장소 정보 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                {place.place?.name || '장소 정보 없음'}
              </h3>

              {place.place?.address && (
                <p className="text-sm text-gray-600 mb-2 truncate">
                  {place.place.address}
                </p>
              )}

              {place.place?.category && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded mb-2">
                  {place.place.category}
                </span>
              )}

              {!hasCoordinates && (
                <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded inline-block mb-2">
                  ⚠️ 좌표 정보 없음 (지도 표시 불가)
                </div>
              )}

              {/* 메모 */}
              <div className="mt-2">
                {isEditingMemo ? (
                  <div className="space-y-2">
                    <textarea
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="메모를 입력하세요..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveMemo}
                        className="px-3 py-1 bg-primary-500 text-white rounded text-xs hover:bg-primary-600"
                      >
                        저장
                      </button>
                      <button
                        onClick={() => {
                          setMemo(place.memo || '');
                          setIsEditingMemo(false);
                        }}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {place.memo && (
                      <p className="text-sm text-gray-700 p-3 bg-yellow-50 rounded-lg">
                        {place.memo}
                      </p>
                    )}
                    {isEditable && (
                      <button
                        onClick={() => setIsEditingMemo(true)}
                        className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                      >
                        {place.memo ? '메모 수정' : '+ 메모 추가'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 방문 시간 */}
            <div className="flex-shrink-0">
              {isEditingTime ? (
                <div className="space-y-2">
                  <input
                    type="time"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={handleSaveTime}
                      className="px-2 py-1 bg-primary-500 text-white rounded text-xs hover:bg-primary-600"
                    >
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setVisitTime(place.visitTime || '');
                        setIsEditingTime(false);
                      }}
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  {place.visitTime && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {place.visitTime}
                    </div>
                  )}
                  {isEditable && (
                    <button
                      onClick={() => setIsEditingTime(true)}
                      className="text-xs text-primary-600 hover:text-primary-700 mt-1"
                    >
                      {place.visitTime ? '시간 수정' : '+ 시간 설정'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 삭제 버튼 */}
            {isEditable && onDelete && (
              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    if (confirm('이 장소를 삭제하시겠습니까?')) {
                      onDelete(place.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 경로 정보 (다음 장소로) */}
      {showRouteInfo && route && nextPlace && (
        <div className="flex items-center justify-center py-3">
          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg text-sm">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <span className="text-gray-700">
              {formatDistance(route.distance)} • {formatDuration(route.duration)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DraggablePlaceList({
  places,
  onReorder,
  onUpdate,
  onDelete,
  isEditable = true,
  showRouteInfo = true,
}: DraggablePlaceListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = places.findIndex((p) => p.id === active.id);
      const newIndex = places.findIndex((p) => p.id === over.id);

      const newPlaces = arrayMove(places, oldIndex, newIndex).map(
        (place, index) => ({
          ...place,
          orderIndex: index,
        })
      );

      onReorder(newPlaces);
    }
  };

  if (places.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          장소가 없습니다
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          장소를 추가하여 일정을 만들어보세요
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={places} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {places.map((place, index) => (
            <SortablePlaceItem
              key={place.id}
              place={place}
              index={index}
              isEditable={isEditable}
              onUpdate={onUpdate}
              onDelete={onDelete}
              nextPlace={places[index + 1]}
              showRouteInfo={showRouteInfo}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
