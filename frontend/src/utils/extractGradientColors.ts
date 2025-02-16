import ColorThief from "colorthief";

const extractGradientColors = (image: HTMLImageElement, callback: (colors: number[][]) => void) => {
    const colorthief = new ColorThief();

    const setGradient = () => {
        const colors = colorthief.getPalette(image, 2);
        if (!colors) return;
        console.log("Extracted colors:", colors); // Debug log
        callback(colors);
    };

    if (image.complete) {
        setGradient();
    } else {
        image.onload = setGradient;
    }
};

export default extractGradientColors;