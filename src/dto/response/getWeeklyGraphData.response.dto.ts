export class GetWeeklyGraphDataResponseDto {
  "graph": Graph[]
  "spend" : {
    "sum" : number,
    "bank" : {
      "kn" : number, // 경남
      "kj" : number, // 광주
      "kb" : number, // 국민
      "ibk" : number, // 기업
      "nh" : number, // 농협
      "im" : number, // 대구
      "busan" : number, // 부산
      "suhyup" : number, // 수협
      "shinhan" : number, // 신한
      "woori" : number, // 우리
      "jb" : number, // 전북
      "sc" : number, // SC제일
      "jeju" : number, // 제주
      "hana" : number, // 하나
      "kdb" : number, // 한국산업
      "koreaexim" : number, // 한국수출입
      "citi" : number, // 한국씨티은행
      "kbank" : number, // 케이뱅크
      "toss" : number, // 토스뱅크
      "keb" : number, // KEB하나
      "kakao" : number, // 카카오뱅크
    }
  }
}

export type Graph = {
  date: string
  sum: number
}