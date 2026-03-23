declare module "gsap-trial/SplitText" {
    export class SplitText {
        chars: Element[];
        words: Element[];
        lines: Element[];
        constructor(
            target: string | string[] | Element | Element[] | NodeList,
            vars?: {
                type?: string;
                linesClass?: string;
                wordsClass?: string;
                charsClass?: string;
                [key: string]: unknown;
            }
        );
        revert(): void;
        split(vars?: object): this;
    }
}

declare module "gsap-trial/ScrollSmoother" {
    export class ScrollSmoother {
        static create(config: {
            wrapper?: string;
            content?: string;
            smooth?: number;
            speed?: number;
            effects?: boolean;
            autoResize?: boolean;
            ignoreMobileResize?: boolean;
            [key: string]: unknown;
        }): ScrollSmoother;
        static refresh(safe?: boolean): void;
        scrollTop(position?: number): number;
        scrollTo(
            target: string | Element | number,
            smooth?: boolean,
            position?: string
        ): void;
        paused(value?: boolean): boolean | this;
    }
}
