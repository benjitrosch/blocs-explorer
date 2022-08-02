import { Position } from "../types/bounds"

export const drawBezierPath = (p0: Position, p1: Position): string => {
    const x0 = p0.x
    const y0 = p0.y
    const x1 = p1.x
    const y1 = p1.y

    const cx = (x0 + x1) / 2

    return `M${x0},${y0}
            C${cx},${y0} ${cx},${y1}
            ${x1},${y1}`
}

export const drawSteppedPath = (p0: Position, p1: Position): string => {
    const x0 = p0.x
    const y0 = p0.y
    const x1 = p1.x
    const y1 = p1.y

    let mindiff = 15
    let offset = 0

    if (Math.abs(y1 - y0) < mindiff * 2) {
        offset = Math.abs(y1 - y0) / 2
    } else {
        offset = mindiff
    }

    let offsetX = offset
    let offsetY = offset

    if (y1 - y0 < 0) {
        offsetY = -offset
    }

    if (x1 - x0 < (-mindiff * 2)) {
        offsetX = -offset
    }

    const cx = (x1 - x0) / 2 + x0

    return `M${x0},${y0}
            L${cx - offsetX},${y0}
            Q${cx},${y0} ${cx},${y0 + offsetY}
            L${cx},${y1 - offsetY}
            Q${cx},${y1} ${cx + offsetX},${y1}
            L${x1},${y1}`
}
