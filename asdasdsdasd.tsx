// jsx만 쓸 거면 react import 필요없음
// 앱에 있는 페이지들이 미리 렌더링 된다

import Link from "next/link";

// hydration:

// Link : 클라이언트 사이드 페이지를 제공
/*Link는 오직 href만을 위한 것
<a>에 styles 등 다른 속성을 넣을 수 있음*/
<Link href="/about">
	<a>about</a>
</Link>;

/*css 모듈은 충돌을 만들지 않음 */

//여러 속성 넣는 법
{
	/* <Link href="/">
        <a style={{ color: router.pathname === "/" ? "red" : "blue" }}>Home</a>
        <a
          className={`${styles.link} ${
            router.pathname === "/" ? styles.active : ""
          }`}
        >
          Home
        </a>
      </Link> */
}

//styled-jsx
// <style jsx>{`
// 	a {
// 		color: blue;
// 	}
// `}</style>;

// _app.js는 모든 페이지에 공통으로 적용되는 부분을 처리

//layout   pattern

// [id].js : 동적 라우팅
