import { AssetRecordType, type Editor, StateNode, type TLShapeId, createShapeId } from 'tldraw';

import catImage from '@/assets/images/black-cat.jpg';

export class CardShapeTool extends StateNode {
  static override id = 'card-shape';

  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 });
  }

  override onPointerDown() {
    const editor = this.editor;
    const { currentPagePoint } = editor.inputs;
    const { x: pointerX, y: pointerY } = currentPagePoint;
    const groupId = createShapeId();
    createCardShape(editor, pointerX, pointerY, groupId);
  }
}

export function createCardShape(
  editor: Editor,
  pointerX: number,
  pointerY: number,
  groupId: TLShapeId,
  groupIds?: TLShapeId[],
) {
  const imageUrl = catImage;
  const w = 200;
  const h = 168;
  const type = 'image/jpeg';

  const assetId = AssetRecordType.createId();
  editor.createAssets([
    {
      id: assetId,
      typeName: 'asset',
      type: 'image',
      meta: {},
      props: {
        w,
        h,
        mimeType: type,
        src: imageUrl,
        name: 'image',
        isAnimated: false,
      },
    },
  ]);

  const imageId = createShapeId();
  const textId = createShapeId();

  editor.createShapes([
    {
      id: imageId,
      type: 'image',
      x: pointerX - w / 2,
      y: pointerY - h / 2,
      props: {
        assetId,
        w,
        h,
      },
    },
    {
      id: textId,
      type: 'text',
      x: 0,
      y: pointerY + h / 2,
      props: { text: 'Test message' },
    },
  ]);

  const textBounds = editor.getShapePageBounds(textId)!;
  editor.updateShape({
    id: textId,
    type: 'text',
    x: pointerX - textBounds.w / 2,
  });

  editor.select(imageId, textId);
  editor.setCurrentTool('select');
  const group = editor.getSelectedShapeIds();
  editor.groupShapes(group, { groupId: groupId });

  if (groupIds?.length === 5) {
    const bigGroupId = createShapeId();
    editor.groupShapes(groupIds, { groupId: bigGroupId });
    editor.updateShape({
      id: bigGroupId,
      type: 'group',
      meta: { childrenIds: groupIds, rotation: 0 },
    });

    editor.sideEffects.registerAfterChangeHandler('shape', (prev, next) => {
      if (next.id === bigGroupId && prev.rotation !== next.rotation && prev.x !== next.x) {
        /** Если нужно видеть, в каком положении будут карточки
         groupIds.forEach((cardId) => {
          editor.updateShape({
            id: cardId,
            type: 'group',
            rotation: -next.rotation,
          });
        }); **/
        editor.getShapeUtil('group').onRotateEnd = (initial, current) => {
          if (!initial.meta.childrenIds) {
            return;
          }

          const bigGroupBounds = editor.getShapePageBounds(bigGroupId)!;
          const bigGroupCenter = {
            x: bigGroupBounds.x + bigGroupBounds.w / 2,
            y: bigGroupBounds.y + bigGroupBounds.h / 2,
            z: 20,
          };

          groupIds.forEach((cardId) => {
            const card = editor.getShape(cardId)!;
            editor.rotateShapesBy([card], current.rotation, { center: bigGroupCenter });
          });

          editor.updateShape({
            id: bigGroupId,
            type: 'group',
            rotation: 0,
            x: initial.x,
            y: initial.y,
          });

          groupIds.forEach((cardId) => {
            editor.updateShape({
              id: cardId,
              type: 'group',
              rotation: 0,
            });
          });
        };
      }
    });
  }
}
