declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test"
    BASE_URL?: string
    TOKEN?: string
    // … 根据实际项目扩展 …
    [key: string]: string | undefined
  }
}
declare global {
  interface Window {
    MathJax: any;
  }
}
export {};
