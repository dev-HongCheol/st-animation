import { useState, useCallback } from "react";
import { throttle } from "lodash-es";

export const SnapshotProblemExample = () => {
  const [count, setCount] = useState(0);
  
  // 🚨 문제가 있는 코드: 스냅샷 문제
  const throttledIncrement = useCallback(
    throttle(() => {
      console.log(`throttledIncrement - 현재 count: ${count}`); // 항상 0을 출력!
      setCount(count + 1); // 항상 0 + 1 = 1만 설정
    }, 1000),
    [] // 빈 의존성 배열 = 첫 번째 렌더링의 count(0)만 기억
  );

  // 🟢 해결된 코드 1: 함수형 업데이트
  const throttledIncrementFixed1 = useCallback(
    throttle(() => {
      console.log("throttledIncrementFixed1 - 함수형 업데이트 사용");
      setCount(prev => {
        console.log(`이전 값: ${prev}`);
        return prev + 1;
      });
    }, 1000),
    [] // 함수형 업데이트는 항상 최신 상태를 받음
  );

  // 🟢 해결된 코드 2: 의존성 배열에 count 추가 (하지만 throttle이 자주 재생성됨)
  const throttledIncrementFixed2 = useCallback(
    throttle(() => {
      console.log(`throttledIncrementFixed2 - 현재 count: ${count}`);
      setCount(count + 1);
    }, 1000),
    [count] // count가 변경될 때마다 throttle 함수 재생성 (throttle 효과 감소)
  );

  // 일반적인 증가 함수 (비교용)
  const normalIncrement = () => {
    console.log(`normalIncrement - 현재 count: ${count}`);
    setCount(count + 1);
  };

  const reset = () => setCount(0);

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>스냅샷 문제 예제</h2>
      <div style={{ marginBottom: "20px", fontSize: "24px" }}>
        현재 Count: <strong>{count}</strong>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <button onClick={throttledIncrement} style={{ padding: "10px", backgroundColor: "#ffcccc" }}>
          🚨 문제 있는 Throttled (+1) - 항상 1로만 설정됨
        </button>
        
        <button onClick={throttledIncrementFixed1} style={{ padding: "10px", backgroundColor: "#ccffcc" }}>
          🟢 해결책1: 함수형 업데이트 Throttled (+1)
        </button>
        
        <button onClick={throttledIncrementFixed2} style={{ padding: "10px", backgroundColor: "#ffffcc" }}>
          🟡 해결책2: 의존성 배열에 count 추가 (throttle 효과 감소)
        </button>
        
        <button onClick={normalIncrement} style={{ padding: "10px", backgroundColor: "#ccccff" }}>
          🔵 일반 증가 (+1) - 비교용
        </button>
        
        <button onClick={reset} style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
          리셋
        </button>
      </div>

      <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
        <h3>테스트 방법:</h3>
        <ol>
          <li><strong>일반 증가</strong>를 여러 번 클릭해서 count를 5 정도로 올려보세요</li>
          <li><strong>문제 있는 Throttled</strong>를 클릭해보세요 → 항상 1로만 설정됩니다!</li>
          <li><strong>해결책1</strong>을 클릭해보세요 → 정상적으로 증가합니다</li>
        </ol>
        <p><strong>이유:</strong> 문제 있는 버전은 첫 번째 렌더링의 count(0)만 기억하고 있어서 
        count + 1 = 0 + 1 = 1만 계속 설정합니다.</p>
      </div>

      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#fff3cd", borderRadius: "5px" }}>
        <h3>실제 BentoTilt에서의 문제:</h3>
        <code style={{ display: "block", whiteSpace: "pre-line", backgroundColor: "#f8f9fa", padding: "10px" }}>
{`// 첫 번째 렌더링: transformStyle = ""
const throttledMouseMove = throttle(() => {
  setTransformStyle(newValue); // 첫 렌더링의 setTransformStyle 사용
}, 50);

// 두 번째 렌더링: transformStyle = "transform(...)"
// throttledMouseMove는 여전히 첫 렌더링의 setTransformStyle 참조

const handleMouseLeave = () => {
  setTransformStyle(""); // 최신 렌더링의 setTransformStyle 사용
};`}
        </code>
        <p>→ 서로 다른 렌더링의 상태 setter를 사용해서 동기화가 깨집니다!</p>
      </div>
    </div>
  );
};