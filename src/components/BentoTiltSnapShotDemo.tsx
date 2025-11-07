import { useState, useCallback, useRef } from "react";
import { throttle } from "lodash-es";

export const BentoTiltSnapshotDemo = () => {
  const [transformStyle, setTransformStyle] = useState("");
  const [renderCount, setRenderCount] = useState(0);
  
  // 렌더링 횟수 추적
  const currentRender = useRef(0);
  currentRender.current++;

  // 🚨 문제가 있는 버전: 스냅샷 문제
  const handleMouseMoveBroken = useCallback(
    throttle(() => {
      console.log(`🚨 Broken - Render ${currentRender.current}에서 실행, transformStyle: "${transformStyle}"`);
      const newTransform = `rotate(${Math.random() * 10}deg)`;
      setTransformStyle(newTransform);
    }, 100),
    [] // 빈 의존성 배열 → 첫 렌더링의 transformStyle만 기억
  );

  // 🟢 해결된 버전: 함수형 업데이트
  const handleMouseMoveFixed = useCallback(
    throttle(() => {
      console.log(`🟢 Fixed - Render ${currentRender.current}에서 실행`);
      setTransformStyle(prev => {
        console.log(`  이전 transformStyle: "${prev}"`);
        const newTransform = `rotate(${Math.random() * 10}deg)`;
        console.log(`  새로운 transformStyle: "${newTransform}"`);
        return newTransform;
      });
    }, 100),
    []
  );

  const handleMouseLeave = () => {
    console.log(`🔄 MouseLeave - Render ${currentRender.current}에서 실행`);
    console.log(`  현재 transformStyle: "${transformStyle}"`);
    setTransformStyle("");
    setRenderCount(prev => prev + 1); // 강제 리렌더링
  };

  const forceRerender = () => {
    setRenderCount(prev => prev + 1);
  };

  const reset = () => {
    setTransformStyle("");
    setRenderCount(0);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h2>BentoTilt 스냅샷 문제 데모</h2>
      
      <div style={{ marginBottom: "20px", backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "5px" }}>
        <div><strong>현재 렌더링:</strong> {currentRender.current}</div>
        <div><strong>Transform Style:</strong> "{transformStyle}"</div>
        <div><strong>Render Count:</strong> {renderCount}</div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={forceRerender} style={{ padding: "10px", backgroundColor: "#e7f3ff" }}>
          강제 리렌더링
        </button>
        <button onClick={reset} style={{ padding: "10px", backgroundColor: "#f0f0f0" }}>
          리셋
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* 문제가 있는 컴포넌트 */}
        <div 
          style={{ 
            width: "200px", 
            height: "200px", 
            backgroundColor: "#ffcccc", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            transform: transformStyle,
            transition: "transform 0.1s",
            cursor: "pointer",
            border: "2px solid #ff6666"
          }}
          onMouseMove={handleMouseMoveBroken}
          onMouseLeave={handleMouseLeave}
        >
          🚨 문제 있는 버전
          <br />
          (마우스 올리고 벗어나보세요)
        </div>

        {/* 해결된 컴포넌트 */}
        <div 
          style={{ 
            width: "200px", 
            height: "200px", 
            backgroundColor: "#ccffcc", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            transform: transformStyle,
            transition: "transform 0.1s",
            cursor: "pointer",
            border: "2px solid #66ff66"
          }}
          onMouseMove={handleMouseMoveFixed}
          onMouseLeave={handleMouseLeave}
        >
          🟢 해결된 버전
          <br />
          (마우스 올리고 벗어나보세요)
        </div>
      </div>

      <div style={{ marginTop: "30px", padding: "15px", backgroundColor: "#fff3cd", borderRadius: "5px" }}>
        <h3>테스트 방법:</h3>
        <ol>
          <li><strong>"강제 리렌더링"</strong>을 여러 번 클릭해서 렌더링 횟수를 늘려보세요</li>
          <li><strong>문제 있는 버전(빨간 박스)</strong>에 마우스를 올리고 벗어나보세요</li>
          <li>콘솔을 확인해보세요 - 문제 있는 버전은 항상 첫 렌더링의 transformStyle만 봅니다</li>
          <li><strong>해결된 버전(초록 박스)</strong>으로 같은 테스트를 해보세요</li>
        </ol>
        
        <h4>예상 콘솔 출력:</h4>
        <pre style={{ backgroundColor: "#f8f9fa", padding: "10px", fontSize: "12px" }}>
{`🚨 Broken - Render 5에서 실행, transformStyle: "" // 항상 빈 문자열!
🟢 Fixed - Render 5에서 실행
  이전 transformStyle: "rotate(3.2deg)" // 실제 현재 값
  새로운 transformStyle: "rotate(7.8deg)"`}
        </pre>
      </div>

      <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
        <h3>왜 이런 일이 일어나는가?</h3>
        <p><strong>스냅샷 문제:</strong> React의 각 렌더링은 해당 시점의 상태값들을 "스냅샷"으로 가집니다.</p>
        <code style={{ display: "block", whiteSpace: "pre-line", backgroundColor: "#f8f9fa", padding: "10px" }}>
{`// 첫 번째 렌더링 (transformStyle = "")
const throttled = throttle(() => {
  setTransformStyle(newValue); // 이 시점의 transformStyle = ""
}, 100);

// 두 번째 렌더링 (transformStyle = "rotate(5deg)")
// 하지만 throttled 함수는 여전히 첫 번째 렌더링의
// transformStyle = ""를 기억하고 있음!`}
        </code>
      </div>
    </div>
  );
};