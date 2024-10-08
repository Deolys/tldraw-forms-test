import {
  AssetRecordType,
  DEFAULT_SUPPORTED_MEDIA_TYPE_LIST,
  type Editor,
  FileHelpers,
  StateNode,
  type TLShapeId,
  createShapeId,
} from 'tldraw';

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
  const input = window.document.createElement('input');
  input.type = 'file';
  input.accept = DEFAULT_SUPPORTED_MEDIA_TYPE_LIST;
  input.addEventListener('change', async (e) => {
    const fileList = (e.target as HTMLInputElement).files;
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];

    try {
      const imageUrl = await FileHelpers.blobToDataUrl(file);
      const w = 200;
      const h = 200;
      const type = file.type;

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
      }
    } catch (e) {
      console.error(e);
    }
  });
  input.click();
}
