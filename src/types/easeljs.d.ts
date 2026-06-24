declare namespace createjs {
  class Stage {
    constructor(canvas: HTMLCanvasElement);
    compositeOperation: string;
    addChild(child: any): void;
    addChildAt(child: any, index: number): void;
    removeAllChildren(): void;
    update(): void;
    clear(): void;
  }

  class Shape {
    graphics: Graphics;
    filters: any[];
    cache(x: number, y: number, w: number, h: number): void;
    regX: number;
    regY: number;
    x: number;
    y: number;
    alpha: number;
    scaleX: number;
    scaleY: number;
    compositeOperation: string;
    initX: number;
    initY: number;
  }

  class Graphics {
    beginFill(color: string): this;
    beginStroke(color: string): this;
    setStrokeStyle(width: number): this;
    drawCircle(x: number, y: number, radius: number): this;
    drawEllipse(x: number, y: number, w: number, h: number): this;
  }

  class BlurFilter {
    constructor(x: number, y: number, quality: number);
    getBounds(): { x: number; y: number; width: number; height: number };
  }

  class Ticker {
    static addEventListener(type: string, listener: () => void): void;
    static removeAllEventListeners(): void;
  }
}

declare class TweenMax {
  static to(target: any, duration: number, vars: any): TweenMax;
  static fromTo(target: any, duration: number, fromVars: any, toVars: any): TweenMax;
}

interface Window {
  createjs: typeof createjs;
  TweenMax: typeof TweenMax;
  Power1: { easeInOut: any };
  Cubic: { easeInOut: any };
}
