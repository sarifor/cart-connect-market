const { Member } = require('../config/db');

/* # 로그인 처리 흐름
   이메일 검증 -> 비밀번호 검증 -> 비밀번호를 제외한 멤버 객체 생성

   # Q&A
   Q. 처리 성공 시 프론트엔드 메인 화면으로 리다이렉트시키려면?
   A. 백엔드에서는 status: 200과 함께 성공 응답을 보내고, 프론트엔드에서 리다이렉트 처리하는 것이 일반적임 (ChatGPT)
   Q. 처음 로그인했을 때 서버가 클라이언트에게 쿠키를 보내주는지 아닌지 확인하려면?
   A. 개발자 도구 (F12) -> Network 탭으로 이동 -> 로그인 요청 (/login)을 찾고 클릭 -> Response Headers에서 Set-Cookie 항목이 있는지 확인 (ChatGPT)
   Q. 회원 정보 조회 결과가 없을 때 어떤 응답 status가 적절할까?
   A. 401 Unauthorized (ChatGPT)
   Q. 유저 객체에서 비밀번호를 제외하고 리턴하려면?
   A. member 객체에서 password 속성을 분리해 password 변수에 저장하고, 나머지 속성(id, name, email 등)은 새 객체에 담는 객체 구조 분해 할당 문법을 쓰면 됩니다 (ChatGPT) */
const login = async (req, res, next) => {
  const reqEmail = req.body.email;
  const reqPassword = req.body.password;

  try {
    const member = await Member.findOne({
      where: {
        email: reqEmail,
      }
    });

    if (!member) {
      return res.status(401).json("회원이 존재하지 않습니다.");
    }

    if (reqPassword !== member.dataValues.password) {
      return res.status(401).json("비밀번호가 일치하지 않습니다.");
    }

    const { password, ...memberWithoutPassword } = member.dataValues;

    req.session.member = memberWithoutPassword;

    await req.session.save();

    res.status(200).json(member);
  } catch (error) {
    console.log(error);
  }
};

// Q. 첫 방문 시 로그인을 하지 않았다고 401 코드를 보내는 건 좀 아닌 것 같아
// A. 첫 방문 시 로그인 여부만 확인하는 API에서는 204 No Content가 더 적절함! (ChatGPT)
const me = async (req, res, next) => {
  if (!req.session.member) {
    return res.sendStatus(204);
  } else {
    return res.status(200).json(req.session.member);
  }
};

// Q. 왜 req.session.destroy는 콜백 구조지?
// A. req.session.destroy()는 비동기 작업이라, 세션이 완전히 삭제된 후에 res.clearCookie()가 실행되어야 해요. 그 순서를 보장하기 위해 destroy의 콜백 안에서 clearCookie()를 호출하는 거예요. (ChatGPT)
const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("세션 삭제 실패: ", err);
      return res.status(500).json({ message: "Failed to destroy session" });
    }

    res.clearCookie("connect.sid", { 
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    
    return res.status(200).json({ data: null, message: "ok" });
  });
};

module.exports = { login, me, logout };