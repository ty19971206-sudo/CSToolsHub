/// <reference types="astro/client" />

interface Window {
  __ATCS_LANG?: 'zh' | 'en';
}

declare namespace App {
  interface Locals {
    // reserved for future SSR
  }
}
