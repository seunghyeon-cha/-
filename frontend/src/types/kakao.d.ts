// Kakao Maps SDK 타입 정의

declare global {
  interface KakaoLatLng {
    getLat(): number;
    getLng(): number;
  }

  interface KakaoMarker {
    setMap(map: KakaoMap | null): void;
  }

  interface KakaoMap {
    setCenter(latlng: KakaoLatLng): void;
    setLevel(level: number): void;
    setBounds(bounds: KakaoLatLngBounds): void;
    addControl(control: unknown, position: unknown): void;
  }

  interface KakaoLatLngBounds {
    extend(latlng: KakaoLatLng): void;
  }

  interface KakaoCustomOverlay {
    setMap(map: KakaoMap | null): void;
    a: HTMLElement;
  }

  interface KakaoPolyline {
    setMap(map: KakaoMap | null): void;
  }

  interface KakaoInfoWindow {
    open(map: KakaoMap, marker: KakaoMarker | KakaoLatLng | KakaoCustomOverlay): void;
    close(): void;
  }

  interface KakaoMapsSDK {
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
    Marker: new (options: { position: KakaoLatLng; title?: string }) => KakaoMarker;
    ZoomControl: new () => unknown;
    ControlPosition: { RIGHT: unknown };
    LatLngBounds: new () => KakaoLatLngBounds;
    CustomOverlay: new (options: {
      position: KakaoLatLng;
      content: string;
      yAnchor: number;
    }) => KakaoCustomOverlay;
    InfoWindow: new (options: { content: string; removable?: boolean }) => KakaoInfoWindow;
    Polyline: new (options: {
      path: KakaoLatLng[];
      strokeWeight: number;
      strokeColor: string;
      strokeOpacity: number;
      strokeStyle: string;
    }) => KakaoPolyline;
    event: {
      addListener(target: HTMLElement | KakaoMarker, type: string, handler: () => void): void;
    };
    load(callback: () => void): void;
  }

  interface Window {
    kakao?: {
      maps?: KakaoMapsSDK;
    };
  }
}

export {};
