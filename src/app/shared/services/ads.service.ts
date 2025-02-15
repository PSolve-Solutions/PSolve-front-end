import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdsService {
  private isScriptLoaded = false;
  private excludedPages = ['/login', '/registration']; // 🚫 الصفحات التي لن يتم عرض الإعلانات فيها

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAndLoadAds();
      });
  }

  checkAndLoadAds() {
    if (this.excludedPages.includes(this.router.url)) {
      console.log('🚫 الإعلانات مخفية - هذه الصفحة مستثناة');
      return;
    }

    if (!this.isScriptLoaded) {
      this.loadAdScript();
    }

    setTimeout(() => {
      this.displayAds();
    }, 2000); // ✅ انتظار لضمان تحميل الإعلانات بشكل صحيح
  }

  private loadAdScript() {
    const script = document.createElement('script');
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2279093329528152';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    script.onload = () => {
      this.isScriptLoaded = true;
      console.log('✅ تم تحميل سكربت AdSense');
      this.displayAds();
    };
  }

  private displayAds() {
    const adElements = document.querySelectorAll('.adsbygoogle');
    adElements.forEach((ad) => {
      if (!(ad as any).dataset.adLoaded) {
        (window as any)['adsbygoogle'] = (window as any)['adsbygoogle'] || [];
        (window as any)['adsbygoogle'].push({});
        (ad as any).dataset.adLoaded = 'true'; // ✅ منع تحميل الإعلان أكثر من مرة
        console.log('✅ تم تفعيل الإعلان بنجاح');
      }
    });
  }
}
