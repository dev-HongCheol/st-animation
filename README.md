## repo

- https://github.com/adrianhajdin/award-winning-website

clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);

object-cover object-center

```typescript
const titleAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: containerRef.current,
    start: "100 bottom",
    end: "center bottom",
    toggleActions: "play none none reverse",
  },
});
```
