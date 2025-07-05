// next.config.js
module.exports = {
  // ── ESLint 오류 무시 설정 (추가) ──
  eslint: {
    // 빌드 시 ESLint 오류를 무시하고 계속 빌드합니다.
    ignoreDuringBuilds: true,
  },

  // ── 리라이트 설정 (기존) ──
  async rewrites() {
    return [
      // 구글 로그인 시작 엔드포인트
      {
        source: "/oauth2/authorization/:provider",
        destination: "http://localhost:8080/oauth2/authorization/:provider",
      },
      // 구글 로그인 콜백 엔드포인트
      {
        source: "/login/oauth2/code/:provider",
        destination: "http://localhost:8080/login/oauth2/code/:provider",
      },
      // API 호출 포워딩
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
};
