import { type ReactNode, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * BentoTilt 컴포넌트 - 마우스 움직임에 따른 3D 틸트 효과
 * 
 * 기존 문제점들:
 * 1. useState + throttle 조합으로 인한 클로저/스냅샷 문제
 *    - throttled 함수가 오래된 상태값을 참조
 *    - onMouseLeave가 동작하지 않는 문제 발생
 * 2. 직접 DOM 조작으로 인한 성능 문제
 *    - 매번 getBoundingClientRect() 호출
 *    - 동기적 transform 변경으로 리플로우 발생
 * 3. Grid 내부에서 애니메이션 끊김 현상
 *    - Grid layout 재계산으로 인한 성능 저하
 *    - 여러 아이템 동시 애니메이션 시 최적화 실패
 */
export const BentoTilt = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // useMotionValue: React 리렌더링 없이 값 저장 및 변경
  // 장점: 성능 최적화, GPU에서 직접 처리
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // useSpring + useTransform: 부드러운 spring 애니메이션
  // y값(-0.5 ~ 0.5)을 rotateX(5deg ~ -5deg)로 변환하며 스프링 적용
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), {
    stiffness: 300, // 스프링 강도 (높을수록 빠름)
    damping: 30,    // 감쇠 (높을수록 빨리 멈춤)
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });
  
  // scale도 useSpring으로 부드러운 애니메이션 적용
  // 기존 문제: scale.set(1)로 즉시 복원되어 grid 외부에서 애니메이션 없이 커짐
  const scale = useSpring(useMotionValue(1), {
    stiffness: 400,
    damping: 30,
  });

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!ref.current) return;
    
    // 중앙점을 기준으로 상대적 위치 계산 (더 자연스러운 틸트)
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // -1 ~ 1 범위로 정규화
    const relativeX = (event.clientX - centerX) / (rect.width / 2);
    const relativeY = (event.clientY - centerY) / (rect.height / 2);
    
    // useMotionValue.set(): 리렌더링 없이 값 업데이트
    // GPU에서 직접 transform 계산 → 부드러운 애니메이션
    x.set(relativeX);
    y.set(relativeY);
    scale.set(0.95); // 호버 시 살짝 축소
  };

  const handleMouseLeave = () => {
    // 모든 값을 원래 상태로 복원
    // useSpring 덕분에 부드럽게 애니메이션되어 복원
    x.set(0);
    y.set(0);
    scale.set(1); // 이제 스프링 애니메이션으로 부드럽게 복원됨
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        perspective: "700px",        // 3D 원근감
        transformStyle: "preserve-3d", // 3D 변환 유지
        rotateX,                     // useSpring으로 생성된 애니메이션 값
        rotateY,
        scale,
        willChange: "transform",     // 브라우저에게 transform 변경 예고
                                    // → Composite Layer 생성으로 GPU 가속
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{
        scale: 0.93, // 클릭 시 더 작게
      }}
      transition={{
        // whileTap용 전환 설정
        scale: {
          type: "spring",
          stiffness: 400,
          damping: 30,
        },
      }}
    >
      {children}
    </motion.div>
  );
};
