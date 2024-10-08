import { DEFAULT_SUPPORTED_MEDIA_TYPE_LIST, FileHelpers, MediaHelpers, StateNode } from 'tldraw';

const OFFSET = 100;
export class BaseShapeTool extends StateNode {
  static override id = 'base-shape';

  override onEnter() {
    this.editor.setCursor({ type: 'cross', rotation: 0 });
  }

  override onPointerDown() {
    const editor = this.editor;
    const { currentPagePoint } = editor.inputs;

    const input = window.document.createElement('input');
    input.type = 'file';
    input.accept = DEFAULT_SUPPORTED_MEDIA_TYPE_LIST;
    input.addEventListener('change', async (e) => {
      const fileList = (e.target as HTMLInputElement).files;
      if (!fileList || fileList.length === 0) return;
      const file = fileList[0];

      try {
        const imageUrl = await FileHelpers.blobToDataUrl(file);
        const { w, h } = await MediaHelpers.getImageSize(file);
        editor.createShape({
          type: 'base-shape',
          x: currentPagePoint.x - OFFSET,
          y: currentPagePoint.y - OFFSET,
          props: { text: 'Text', image: imageUrl, w, h },
        });
      } catch (e) {
        console.error(e);
      }
    });
    input.click();
  }
}
