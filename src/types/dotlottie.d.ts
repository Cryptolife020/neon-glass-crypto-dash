
declare module '@dotlottie/player-component' {
  export class DotLottiePlayer {
    constructor(options: {
      container: HTMLElement;
      src: string;
      background?: string;
      speed?: number;
      loop?: boolean;
      autoplay?: boolean;
    });
  }

  export enum PlayMode {
    Normal = 'normal',
    Reverse = 'reverse',
    Bounce = 'bounce'
  }
}
