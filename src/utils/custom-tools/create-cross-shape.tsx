import { Editor, StateNode, createShapeId } from 'tldraw';

import { createCardShape } from './create-card-shape';

export class CrossShapeTool extends StateNode {
  static override id = 'cross-shape';

  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 });
  }

  override onPointerDown() {
    const editor = this.editor;
    const { currentPagePoint } = editor.inputs;
    const { x: pointerX, y: pointerY } = currentPagePoint;
    createCrossShape(editor, pointerX, pointerY);
  }
}

const CROSS_SHAPE_OFFSET = 260;

function createCrossShape(editor: Editor, pointerX: number, pointerY: number) {
  const groupTopId = createShapeId();
  createCardShape(editor, pointerX, pointerY, groupTopId);

  const groupLeftId = createShapeId();
  createCardShape(
    editor,
    pointerX - CROSS_SHAPE_OFFSET,
    pointerY + CROSS_SHAPE_OFFSET,
    groupLeftId,
  );

  const groupCenterId = createShapeId();
  createCardShape(editor, pointerX, pointerY + CROSS_SHAPE_OFFSET, groupCenterId);

  const groupRightId = createShapeId();
  createCardShape(
    editor,
    pointerX + CROSS_SHAPE_OFFSET,
    pointerY + CROSS_SHAPE_OFFSET,
    groupRightId,
  );

  const groupBottomId = createShapeId();
  const groupIds = [groupTopId, groupLeftId, groupCenterId, groupRightId, groupBottomId];
  createCardShape(editor, pointerX, pointerY + CROSS_SHAPE_OFFSET * 2, groupBottomId, groupIds);
}
