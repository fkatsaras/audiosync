function lerpRGB(rgb1: [number, number, number], rgb2: [number, number, number], t: number): [number, number, number] {
    return rgb1.map((c1, i) => Math.round(c1 + t * (rgb2[i] - c1))) as [number, number, number];
  }
  
export default lerpRGB;