/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── ESLint 오류 무시 설정 ──
  eslint: {
    // 빌드 시 ESLint 오류를 무시하고 계속 빌드합니다.
    ignoreDuringBuilds: true,
  },

  // ── 리라이트 설정 (localhost를 환경 변수로 대체) ──
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`,
      },
      {
        source: "/oauth2/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL}/oauth2/:path*`,
      },
    ];
  },
};

export default nextConfig;
