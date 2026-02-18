
import PNSLine from './PNSLine';
import PNSCurve from './PNSCurve';
import PNSDoubleCurve from './PNSDoubleCurve';
import PNSCircle from './PNSCircle';
import PNSSquare from './PNSSquare';
import PNSTriangle from './PNSTriangle';
import PNSRectangle from './PNSRectangle';
import PNSConcentric from './PNSConcentric';
import { PrimitiveType } from '../../types';

export const PRIMITIVES = {
    [PrimitiveType.Line]: PNSLine,
    [PrimitiveType.Curve]: PNSCurve,
    [PrimitiveType.DoubleCurve]: PNSDoubleCurve,
    [PrimitiveType.Circle]: PNSCircle,
    [PrimitiveType.Square]: PNSSquare,
    [PrimitiveType.Triangle]: PNSTriangle,
    [PrimitiveType.Rectangle]: PNSRectangle,
    [PrimitiveType.Concentric]: PNSConcentric,
};

export {
    PNSLine,
    PNSCurve,
    PNSDoubleCurve,
    PNSCircle,
    PNSSquare,
    PNSTriangle,
    PNSRectangle,
    PNSConcentric
};
