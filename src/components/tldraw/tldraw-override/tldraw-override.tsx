import {
  DefaultKeyboardShortcutsDialog,
  DefaultKeyboardShortcutsDialogContent,
  DefaultToolbar,
  DefaultToolbarContent,
  type TLComponents,
  type TLUiAssetUrlOverrides,
  type TLUiOverrides,
  Tldraw,
  TldrawUiMenuItem,
  useIsToolSelected,
  useTools,
} from 'tldraw';
import 'tldraw/tldraw.css';

import baseShapeIcon from '@/assets/icons/base-shape-icon.svg';
import cardShapeIcon from '@/assets/icons/card-shape-icon.svg';
import crossShapeIcon from '@/assets/icons/cross-shape-icon.svg';
import { BaseShapeUtil } from '@/custom-shapes/base-shape';
import { BaseShapeTool } from '@/utils/custom-tools/create-base-shape';
import { CardShapeTool } from '@/utils/custom-tools/create-card-shape';
import { CrossShapeTool } from '@/utils/custom-tools/create-cross-shape';

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
      icon: 'card-shape-icon',
      label: 'Card shape',
      kbd: 's',
      onSelect: () => {
        editor.setCurrentTool('card-shape');
      },
    };
    tools.crossShape = {
      id: 'cross-shape',
      icon: 'cross-shape-icon',
      label: 'Cross shape',
      kbd: 's',
      onSelect: () => {
        editor.setCurrentTool('cross-shape');
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
    const isCrossShapeSelected = useIsToolSelected(tools['crossShape']);
    return (
      <DefaultToolbar {...props}>
        <DefaultToolbarContent />
        <TldrawUiMenuItem {...tools['baseShape']} isSelected={isBaseShapeSelected} />
        <TldrawUiMenuItem {...tools['cardShape']} isSelected={isCardShapeSelected} />
        <TldrawUiMenuItem {...tools['crossShape']} isSelected={isCrossShapeSelected} />
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
        <TldrawUiMenuItem {...tools['crossShape']} />
      </DefaultKeyboardShortcutsDialog>
    );
  },
};

const customAssetUrls: TLUiAssetUrlOverrides = {
  icons: {
    'base-shape-icon': baseShapeIcon,
    'card-shape-icon': cardShapeIcon,
    'cross-shape-icon': crossShapeIcon,
  },
};

const customTools = [BaseShapeTool, CardShapeTool, CrossShapeTool];
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
