
import PNSLine from './PNSLine';
import PNSCurve from './PNSCurve';
import PNSDoubleCurve from './PNSDoubleCurve';
import PNSCircle from './PNSCircle';
import PNSSquare from './PNSSquare';
import PNSTriangle from './PNSTriangle';
import PNSRectangle from './PNSRectangle';
import PNSConcentric from './PNSConcentric';
import { PrimitiveType } from '../../types';

// Asset Imports
import lineUrl from '../../assets/primitives/WBM_line.svg?url';
import curveUrl from '../../assets/primitives/WBM_curve.svg?url';
import doubleCurveUrl from '../../assets/primitives/WBM_doublecurve.svg?url';
import circleUrl from '../../assets/primitives/WBM_circle.svg?url';
import squareUrl from '../../assets/primitives/WBM_square.svg?url';
import triangleUrl from '../../assets/primitives/WBM_triangle.svg?url';
import rectangleUrl from '../../assets/primitives/WBM_rectangle.svg?url';
import concentricUrl from '../../assets/primitives/WBM_concentric.svg?url';

// Export individual components
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

export const PRIMITIVE_ASSETS: Record<PrimitiveType, string> = {
    [PrimitiveType.Line]: lineUrl,
    [PrimitiveType.Curve]: curveUrl,
    [PrimitiveType.DoubleCurve]: doubleCurveUrl,
    [PrimitiveType.Circle]: circleUrl,
    [PrimitiveType.Square]: squareUrl,
    [PrimitiveType.Triangle]: triangleUrl,
    [PrimitiveType.Rectangle]: rectangleUrl,
    [PrimitiveType.Concentric]: concentricUrl,
};

// Map PrimitiveType enum to Component
export const PrimitiveComponents: Record<PrimitiveType, React.FC<any>> = {
    [PrimitiveType.Line]: PNSLine,
    [PrimitiveType.Curve]: PNSCurve,
    [PrimitiveType.DoubleCurve]: PNSDoubleCurve,
    [PrimitiveType.Circle]: PNSCircle,
    [PrimitiveType.Square]: PNSSquare,
    [PrimitiveType.Triangle]: PNSTriangle,
    [PrimitiveType.Rectangle]: PNSRectangle,
    [PrimitiveType.Concentric]: PNSConcentric,
};
