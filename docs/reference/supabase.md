
## 목차
- [1. 초기 설정](#1-초기-설정)
- [2. Database](#2-database)
- [4. Authentication](#4-authentication)
- [5. Edge Functions](#5-edge-functions)
- [6. 실시간 기능](#6-실시간-기능)

## 1. 초기 설정

### 환경변수 설정
```env
SUPABASE_URL=your_project_url
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

### Supabase 클라이언트 초기화
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)
```

## 2. Database

### 테이블 조회
```typescript
// 전체 조회
const { data, error } = await supabase
  .from('table_name')
  .select('*')

// 특정 컬럼만 조회
const { data, error } = await supabase
  .from('table_name')
  .select('id, name, email')

// 관계 테이블 조회
const { data, error } = await supabase
  .from('posts')
  .select(`
    id,
    title,
    user_id,
    users (
      name,
      email
    )
  `)
```

### 데이터 삽입
```typescript
// 단일 레코드 삽입
const { data, error } = await supabase
  .from('table_name')
  .insert([
    { name: 'Korea', code: 'KR' }
  ])

// 다중 레코드 삽입
const { data, error } = await supabase
  .from('table_name')
  .insert([
    { name: 'Korea', code: 'KR' },
    { name: 'Japan', code: 'JP' }
  ])
```

### 데이터 수정
```typescript
const { data, error } = await supabase
  .from('table_name')
  .update({ name: 'New Name' })
  .eq('id', 1)
```

### 데이터 삭제
```typescript
const { data, error } = await supabase
  .from('table_name')
  .delete()
  .eq('id', 1)
```

## 3. Storage

### 버킷 생성
```typescript
const { data, error } = await supabase
  .storage
  .createBucket('bucket_name', {
    public: false,
    allowedMimeTypes: ['image/png', 'image/jpeg'],
    fileSizeLimit: 1024 * 1024 * 2 // 2MB
  })
```

### 파일 업로드
```typescript
const { data, error } = await supabase
  .storage
  .from('bucket_name')
  .upload('folder/file.png', file, {
    cacheControl: '3600',
    upsert: false
  })
```

### 파일 다운로드
```typescript
const { data, error } = await supabase
  .storage
  .from('bucket_name')
  .download('folder/file.png')
```

### 파일 삭제
```typescript
const { data, error } = await supabase
  .storage
  .from('bucket_name')
  .remove(['folder/file.png'])
```

## 4. Authentication

### 이메일/비밀번호 회원가입
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'example@email.com',
  password: 'example-password'
})
```

### 로그인
```typescript
// 이메일/비밀번호 로그인
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'example@email.com',
  password: 'example-password'
})

// OAuth 로그인 (Google)
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google'
})
```

### 로그아웃
```typescript
const { error } = await supabase.auth.signOut()
```

### 현재 사용자 정보
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

## 5. Edge Functions

### Edge Function 생성
```bash
# Supabase CLI 설치
npm install -g supabase

# 로그인
supabase login

# Edge Function 생성
supabase functions new function-name
```

### Edge Function 예시
```typescript
// supabase/functions/function-name/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
```

### Edge Function 배포
```bash
supabase functions deploy function-name
```

### Edge Function 호출
```typescript
const { data, error } = await supabase.functions.invoke('function-name', {
  body: JSON.stringify({ name: 'World' })
})
```

## 6. 실시간 기능

### 실시간 구독
```typescript
// 테이블 변경 구독
const channel = supabase
  .channel('table_db_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'table_name'
    },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()

// 특정 이벤트만 구독
const channel = supabase
  .channel('table_db_changes')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'table_name'
    },
    (payload) => {
      console.log('Insert received!', payload)
    }
  )
  .subscribe()
```

### 구독 해제
```typescript
await channel.unsubscribe()
```

## 유용한 팁

### 타입 안전성
```typescript
// 데이터베이스 타입 정의
interface Database {
  public: {
    Tables: {
      countries: {
        Row: {
          id: number
          name: string
          code: string
        }
        Insert: {
          id?: number
          name: string
          code: string
        }
        Update: {
          id?: number
          name?: string
          code?: string
        }
      }
    }
  }
}

// 타입이 지정된 클라이언트 생성
const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)
```

### 에러 처리
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')

if (error) {
  console.error('Error:', error.message)
  return
}

// 데이터 처리
console.log('Data:', data)
```

### RLS (Row Level Security)
```sql
-- 테이블에 RLS 활성화
alter table table_name enable row level security;

-- 정책 생성
create policy "Users can only access their own data"
  on table_name
  for select
  using (auth.uid() = user_id);
```
```

이 문서는 Supabase의 주요 기능들에 대한 기본적인 사용법을 다루고 있습니다. 필요에 따라 더 자세한 내용이나 특정 기능에 대한 설명을 추가할 수 있습니다.
