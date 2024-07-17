export const SignUpMailHtml = (code: number) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>
        @font-face{
          font-family: 'robotoMedium';
          src: url(./Roboto-Medium.woff);
        }
        @font-face{
          font-family: 'robotoBold';
          src: url(./Roboto-Bold.woff);
        }
        html{
          width: 0;
          height: 0;
        }
        *{
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        .mainBox{
          width: 1600px;
          height: 840px;
          margin: 80px 96px;
        }
        .fino{
          color: #406AFF;
          font-size: 72px;
          font-weight: bold;
          margin-bottom: 40px;
          font-family: 'robotoBold';
        }
        hr{
          border-color: #406AFF;
          border-style: solid;
          border-width: 3px;
          margin-bottom: 64px;
        }
        .des{
          color: black;
          font-size: 40px;
          margin-bottom: 100px;
          font-family: 'robotoBold';
          font-weight: bold;
        }
        p{
          font-size: 24px;
          font-weight: 400;
          margin-bottom: 154px;
          font-family: 'robotoMedium';
        }
        .codeBox{
          width: 1600px;
          height: 212px;
          background-color: #EBEBEB;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .code{
          font-size: 72px;
          font-family: 'robotoBold';
        }
      </style>
    </head>
    <body>
      <div class="mainBox">
        <h1 class="fino">Fino</h1>
        <hr>
        <h1 class="des">이메일 인증코드</h1>
        <p>슬기로운 금융생활을 위한 Fino에 가입하신것을 환영합니다<br>
          아래의 인증코드를 입력해 회원가입을 완료하세요</p>
          <div class="codeBox">
            <h1 class="code">${code}</h1>
          </div>
      </div>
    </body>
    </html>
  `;
};
