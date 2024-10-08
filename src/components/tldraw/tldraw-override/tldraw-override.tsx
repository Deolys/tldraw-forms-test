import {
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  DefaultToolbar,
  DefaultToolbarContent,
  TLComponents,
  TLUiAssetUrlOverrides,
  TLUiOverrides,
  Tldraw,
  TldrawUiMenuItem,
  useIsToolSelected,
  useTools,
} from 'tldraw';
import 'tldraw/tldraw.css';

import baseShapeIcon from '@/assets/icons/base-shape-icon.svg';
import { BaseShapeUtil } from '@/custom-shapes/base-shape';
import { BaseShapeTool } from '@/utils/custom-tools/create-base-shape';
import { CardShapeTool } from '@/utils/custom-tools/create-card';

const uiOverrides: TLUiOverrides = {
  tools(editor, tools) {
    tools.baseShape = {
      id: 'base-shape',
      icon: 'base-shape-icon',
      label: 'Base shape',
      kbd: 's',
      onSelect: () => {
        editor.setCurrentTool('base-shape');
      },
    };
    tools.cardShape = {
      id: 'card-shape',
      icon: '',
      label: 'Card shape',
      kbd: 's',
      onSelect: () => {
        editor.setCurrentTool('card-shape');
      },
    };
    return tools;
  },
};

const components: TLComponents = {
  Toolbar: (props) => {
    const tools = useTools();
    const isBaseShapeSelected = useIsToolSelected(tools['baseShape']);
    const isCardShapeSelected = useIsToolSelected(tools['cardShape']);
    return (
      <DefaultToolbar {...props}>
        <DefaultToolbarContent />
        <TldrawUiMenuItem {...tools['baseShape']} isSelected={isBaseShapeSelected} />
        <TldrawUiMenuItem {...tools['cardShape']} isSelected={isCardShapeSelected} />
      </DefaultToolbar>
    );
  },
  KeyboardShortcutsDialog: (props) => {
    const tools = useTools();
    return (
      <DefaultKeyboardShortcutsDialog {...props}>
        <DefaultKeyboardShortcutsDialogContent />
        <TldrawUiMenuItem {...tools['baseShape']} />
        <TldrawUiMenuItem {...tools['cardShape']} />
      </DefaultKeyboardShortcutsDialog>
    );
  },
};

const customAssetUrls: TLUiAssetUrlOverrides = {
  icons: {
    'base-shape-icon': baseShapeIcon,
  },
};

const customTools = [BaseShapeTool, CardShapeTool];
const MyCustomShapes = [BaseShapeUtil];

export function TldrawOverride() {
  return (
    <Tldraw
      tools={customTools}
      overrides={uiOverrides}
      components={components}
      assetUrls={customAssetUrls}
      shapeUtils={MyCustomShapes}
    />
  );
}
