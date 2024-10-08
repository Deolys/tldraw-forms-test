import {
  AssetRecordType,
  DEFAULT_SUPPORTED_MEDIA_TYPE_LIST,
  Editor,
  FileHelpers,
  StateNode,
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
    createCardShape(editor, pointerX, pointerY);
    // createCardShape(editor, pointerX - 260, pointerY + 260);
    // createCardShape(editor, pointerX, pointerY + 260);
    // createCardShape(editor, pointerX + 260, pointerY + 260);
    // createCardShape(editor, pointerX, pointerY + 520);
  }
}

export function createCardShape(editor: Editor, pointerX: number, pointerY: number) {
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
      const group = editor.getSelectedShapeIds();
      const groupId = createShapeId();
      editor.groupShapes(group, { groupId: groupId });
    } catch (e) {
      console.error(e);
    }
  });
  input.click();
}
