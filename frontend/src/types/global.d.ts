declare module 'colorthief' {
    export default class ColorThief {
        getPalette(image: HTMLImageElement, colorCount?: number): number[][];
    }
}