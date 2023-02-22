import {RefObject, useLayoutEffect, useState} from "react";
import useResizeObserver from "@react-hook/resize-observer";

// @ts-ignore
const useSize = (target: RefObject<any>) => {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  })

  // Where the magic happens
  useResizeObserver(target, (entry) => setSize({
    width: entry.borderBoxSize[0].inlineSize ?? 0,
    height: entry.borderBoxSize[0].blockSize ?? 0,
  }))

  return size
}

export default useSize;
