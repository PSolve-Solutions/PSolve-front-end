import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  private isScriptLoaded = false;

  loadAds() {
    if (this.isScriptLoaded) {
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2279093329528152';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    script.onload = () => {
      this.isScriptLoaded = true;
      (window as any)['adsbygoogle'] = (window as any)['adsbygoogle'] || [];
      (window as any)['adsbygoogle'].push({});
    };
  }
}
