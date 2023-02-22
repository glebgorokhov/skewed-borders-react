import {RefObject, useState} from "react";
import useResizeObserver from "@react-hook/resize-observer";

type Coordinate = {
  x: number,
  y: number,
  r: number,
  p1: number[],
  p2: number[],
  pc: number[],
}

type Props = {
  svg?: boolean,
  id: string,
  el?: RefObject<any>,
  corners: Array<number | number[]>,
  width?: number,
  height?: number,
  className?: string,
}

export default function Shape({ width, height, id, el, corners, svg, className }: Props) {
  const defaultWidth = 100;
  const defaultHeight = 50;

  const [elSize, setElSize] = useState({
    width: 0,
    height: 0,
  })

  // Where the magic happens
  useResizeObserver(el, (entry) => setElSize({
    width: entry.borderBoxSize[0].inlineSize ?? 0,
    height: entry.borderBoxSize[0].blockSize ?? 0,
  }))

  const computedWidth = elSize.width || width || defaultWidth;
  const computedHeight = elSize.height || height || defaultHeight;
  const coordinates: Coordinate[] = [];

  const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

  const getCathetus = (radius: number, cos = false) => {
    const angle = degreesToRadians(45);
    return radius * (cos ? Math.cos(angle) : Math.sin(angle));
  };

  corners.forEach((corner, i) => {
    if (Array.isArray(corner)) {
      const [r, delta] = corner;

      switch (i) {
        case 0:
          coordinates.push({
            x: r,
            y: r + delta,
            r,
            p1: [0, r + delta],
            p2: [r - getCathetus(r, true), r + delta - getCathetus(r)],
            pc: [0, r + delta - getCathetus(r) / 2],
          });
          coordinates.push({
            x: r + delta,
            y: r,
            r,
            p1: [r + delta - getCathetus(r, true), r - getCathetus(r)],
            p2: [r + delta, 0],
            pc: [r + delta - getCathetus(r, true) / 2, 0],
          });
          break;
        case 1:
          coordinates.push({
            x: computedWidth - r - delta,
            y: r,
            r,
            p1: [computedWidth - r - delta, 0],
            p2: [
              computedWidth - r - delta + getCathetus(r, true),
              r - getCathetus(r),
            ],
            pc: [computedWidth - r - delta + getCathetus(r, true) / 2, 0]
          });
          coordinates.push({
            x: computedWidth - r,
            y: r + delta,
            r,
            p1: [
              computedWidth - r + getCathetus(r, true),
              r + delta - getCathetus(r),
            ],
            p2: [computedWidth, r + delta],
            pc: [computedWidth, r + delta - getCathetus(r) / 2],
          });
          break;
        case 2:
          coordinates.push({
            x: computedWidth - r,
            y: computedHeight - r - delta,
            r,
            p1: [computedWidth, computedHeight - r - delta],
            p2: [
              computedWidth - r + getCathetus(r, true),
              computedHeight - r - delta + getCathetus(r),
            ],
            pc: [computedWidth, computedHeight - r - delta + getCathetus(r) / 2],
          });
          coordinates.push({
            x: computedWidth - r - delta,
            y: computedHeight - r,
            r,
            p1: [
              computedWidth - r - delta + getCathetus(r, true),
              computedHeight - r + getCathetus(r),
            ],
            p2: [computedWidth - r - delta, computedHeight],
            pc: [computedWidth - r - delta + getCathetus(r, true) / 2, computedHeight],
          });
          break;
        case 3:
        default:
          coordinates.push({
            x: r + delta,
            y: computedHeight - r,
            r,
            p1: [r + delta, computedHeight],
            p2: [
              r + delta - getCathetus(r, true),
              computedHeight - r + getCathetus(r),
            ],
            pc: [r + delta - getCathetus(r, true) / 2, computedHeight],
          });
          coordinates.push({
            x: r,
            y: computedHeight - r - delta,
            r,
            p1: [
              r - getCathetus(r, true),
              computedHeight - r - delta + getCathetus(r),
            ],
            p2: [0, computedHeight - r - delta],
            pc: [0, computedHeight - r - delta + getCathetus(r) / 2],
          });
          break;
      }

      return;
    }

    const r = corner;

    switch (i) {
      case 0:
        coordinates.push({
          x: r,
          y: r,
          r,
          p1: [0, r],
          p2: [r, 0],
          pc: [0, 0],
        });
        break;
      case 1:
        coordinates.push({
          x: computedWidth - r,
          y: r,
          r,
          p1: [computedWidth - r, 0],
          p2: [computedWidth, r],
          pc: [computedWidth, 0]
        });
        break;
      case 2:
        coordinates.push({
          x: computedWidth - r,
          y: computedHeight - r,
          r,
          p1: [computedWidth, computedHeight - r],
          p2: [computedWidth - r, computedHeight],
          pc: [computedWidth, computedHeight],
        });
        break;
      case 3:
      default:
        coordinates.push({
          x: r,
          y: computedHeight - r,
          r,
          p1: [r, computedHeight],
          p2: [0, computedHeight - r],
          pc: [0, computedHeight],
        });
        break;
    }
  });

  const path = coordinates.map((circle, i) => {
    let pointsPaths = [circle.p1.join(" "), "Q " + circle.pc.join(" "), circle.p2.join(" ")].join(" ");

    switch (i) {
      case 0:
        return "M " + pointsPaths;
      case coordinates.length - 1:
        return "L " + pointsPaths + " Z";
      default:
        return "L " + pointsPaths;
    }
  }).join(" ");

  return (
    <svg className={className} viewBox={`0 0 ${computedWidth} ${computedHeight}`} xmlns="http://www.w3.org/2000/svg">
      <clipPath id={id}>
        <path d={path}/>
      </clipPath>
      {svg && <path d={path}/>}
  </svg>)
}
