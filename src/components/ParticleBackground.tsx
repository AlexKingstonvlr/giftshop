import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.createjs || !window.TweenMax) return;

    const stage = new window.createjs.Stage(canvas);
    stage.compositeOperation = 'lighter';

    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;

    canvas.width = W();
    canvas.height = H();

    const particles: createjs.Shape[] = [];
    const lights: createjs.Shape[] = [];

    function range(min: number, max: number) {
      return min + (max - min) * Math.random();
    }

    function weightedRange(to: number, from: number, _dec: number, wRange: number[], wStrength: number) {
      if (wRange && Math.random() <= wStrength) {
        return Math.random() * (wRange[1] - wRange[0]) + wRange[0];
      }
      return Math.random() * (to - from) + from;
    }

    // Background lights
    const lightDefs = [
      { w: 400, h: 100, a: 0.6, ox: 0, oy: 0, color: '#6ac6e8' },
      { w: 350, h: 250, a: 0.3, ox: -50, oy: 0, color: '#54d5e8' },
      { w: 100, h: 80, a: 0.2, ox: 80, oy: -50, color: '#2ae8d8' },
    ];

    for (const ld of lightDefs) {
      const light = new window.createjs.Shape();
      light.graphics.beginFill(ld.color).drawEllipse(0, 0, ld.w, ld.h);
      light.regX = ld.w / 2;
      light.regY = ld.h / 2;
      light.y = light.initY = H() / 2 + ld.oy;
      light.x = light.initX = W() / 2 + ld.ox;
      light.alpha = ld.a;
      light.compositeOperation = 'screen';

      const blur = new window.createjs.BlurFilter(ld.w, ld.h, 1);
      const bounds = blur.getBounds();
      light.filters = [blur];
      light.cache(bounds.x - ld.w / 2, bounds.y - ld.h / 2, bounds.width * 2, bounds.height * 2);
      stage.addChildAt(light, 0);
      lights.push(light);
    }

    // Animate lights
    window.TweenMax.fromTo(lights[0], 10,
      { scaleX: 1.5, x: lights[0].initX, y: lights[0].initY },
      { yoyo: true, repeat: -1, ease: window.Power1.easeInOut, scaleX: 2, scaleY: 0.7 }
    );
    window.TweenMax.fromTo(lights[1], 12,
      { x: lights[1].initX, y: lights[1].initY },
      { delay: 5, yoyo: true, repeat: -1, ease: window.Power1.easeInOut, scaleY: 2, scaleX: 2, y: H() / 2 - 50, x: W() / 2 + 100 }
    );
    window.TweenMax.fromTo(lights[2], 8,
      { x: lights[2].initX, y: lights[2].initY },
      { delay: 2, yoyo: true, repeat: -1, ease: window.Power1.easeInOut, scaleY: 1.5, scaleX: 1.5, y: H() / 2, x: W() / 2 - 200 }
    );

    // Particles
    const particleTypes = [
      { num: 300, bw: 3, am: 0.4, ah: 0.5, color: '#0cdbf3', fill: false },
      { num: 100, bw: 8, am: 0.3, ah: 1, color: '#6fd2f3', fill: true },
      { num: 10, bw: 30, am: 0.2, ah: 1, color: '#93e9f3', fill: true },
    ];

    function applySettings(circle: createjs.Shape, _px: number, _tw: number, ah: number) {
      (circle as any).initY = weightedRange(0, H(), 1,
        [H() * (2 - ah / 2) / 4, H() * (2 + ah / 2) / 4], 0.8
      );
      (circle as any).initX = weightedRange(0, W(), 1,
        [W() / 4, W() * 3 / 4], 0.6
      );
    }

    function animateBall(ball: createjs.Shape & { initX: number; initY: number; distance: number; speed: number }) {
      const scale = range(0.3, 1);
      const xpos = range(ball.initX - ball.distance, ball.initX + ball.distance);
      const ypos = range(ball.initY - ball.distance, ball.initY + ball.distance);
      const speed = ball.speed;
      window.TweenMax.to(ball, speed, {
        scaleX: scale, scaleY: scale, x: xpos, y: ypos,
        onComplete: animateBall, onCompleteParams: [ball],
        ease: window.Cubic.easeInOut
      });
      window.TweenMax.to(ball, speed / 2, {
        alpha: range(0.1, (ball as any).alphaMax),
        onComplete: () => {
          ball.speed = range(2, 10);
          window.TweenMax.to(ball, speed / 2, { alpha: 0 });
        }
      });
    }

    for (const pt of particleTypes) {
      for (let s = 0; s < pt.num; s++) {
        const circle = new window.createjs.Shape();
        if (pt.fill) {
          circle.graphics.beginFill(pt.color).drawCircle(0, 0, pt.bw);
          const blur = new window.createjs.BlurFilter(pt.bw / 2, pt.bw / 2, 1);
          const bounds = blur.getBounds();
          circle.filters = [blur];
          circle.cache(-50 + bounds.x, -50 + bounds.y, 100 + bounds.width, 100 + bounds.height);
        } else {
          circle.graphics.beginStroke(pt.color).setStrokeStyle(1).drawCircle(0, 0, pt.bw);
        }

        circle.alpha = range(0, 0.1);
        (circle as any).alphaMax = pt.am;
        (circle as any).distance = pt.bw * 2;
        (circle as any).ballwidth = pt.bw;
        applySettings(circle, 0, W(), pt.ah);
        (circle as any).speed = range(2, 10);
        circle.y = (circle as any).initY;
        circle.x = (circle as any).initX;
        circle.scaleX = circle.scaleY = range(0.3, 1);

        stage.addChild(circle);
        animateBall(circle as any);
        particles.push(circle);
      }
    }

    // Render loop
    const ticker = window.createjs.Ticker;
    ticker.addEventListener('tick', () => stage.update());

    function onResize() {
      canvas!.width = W();
      canvas!.height = H();
      stage.update();
      for (const p of particles) {
        applySettings(p, 0, W(), (p as any).ah);
      }
      for (let i = 0; i < lights.length; i++) {
        lights[i].initY = H() / 2 + lightDefs[i].oy;
        lights[i].initX = W() / 2 + lightDefs[i].ox;
        window.TweenMax.to(lights[i], 0.5, { x: lights[i].initX, y: lights[i].initY });
      }
    }
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      ticker.removeAllEventListeners();
      window.removeEventListener('resize', onResize);
      stage.removeAllChildren();
      stage.clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="projector"
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: -2 }}
    />
  );
}
