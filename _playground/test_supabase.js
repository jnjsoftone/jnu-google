import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { PLATFORM } from 'jnu-abc';

// 환경 변수 로드
dotenv.config({ path: `../.env.${PLATFORM}` });

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;

// Supabase 클라이언트 초기화
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function testReadOAuth2File() {
  try {
    console.log('파일 다운로드 시도...');
    const { data, error } = await supabase.storage
      .from('google-auth')
      .download('oauth2_bigwhitekmc_0.json');

    if (error) {
      console.error('파일 다운로드 오류:', error.message);
      return;
    }

    console.log('파일 다운로드 성공');
    console.log('Blob 정보:', {
      size: data.size,
      type: data.type
    });

    // Blob을 텍스트로 변환
    const text = await data.text();
    const json = JSON.parse(text);
    
    console.log('\n파일 내용:');
    console.log(JSON.stringify(json, null, 2));

    // OAuth2 파일 구조 검증
    if (json.installed || json.web) {
      console.log('\n유효한 OAuth2 인증 파일 확인됨');
      const config = json.installed || json.web;
      console.log('클라이언트 정보:', {
        client_id: config.client_id ? '존재함' : '없음',
        client_secret: config.client_secret ? '존재함' : '없음',
        redirect_uris: config.redirect_uris ? config.redirect_uris.length + '개 존재' : '없음'
      });
    } else {
      console.log('경고: 유효하지 않은 OAuth2 인증 파일 형식');
    }

  } catch (err) {
    console.error('테스트 실행 중 오류 발생:', err.message);
  }
}

// 테스트 실행
testReadOAuth2File();
