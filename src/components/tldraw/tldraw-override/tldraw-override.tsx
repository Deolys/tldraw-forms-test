import { BaseShapeTool } from '@/utils/custom-tools/create-base-shape'
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
} from 'tldraw'
import 'tldraw/tldraw.css'
import baseShapeIcon from '@/assets/icons/base-shape-icon.svg';
import { BaseShapeUtil } from '@/custom-shapes/base-shape';

const uiOverrides: TLUiOverrides = {
	tools(editor, tools) {
		tools.baseShape = {
			id: 'base-shape',
			icon: 'base-shape-icon',
			label: 'Base shape',
			kbd: 's',
			onSelect: () => {
				editor.setCurrentTool('base-shape')
			},
		}
		return tools
	},
}

const components: TLComponents = {
	Toolbar: (props) => {
		const tools = useTools()
		const isStickerSelected = useIsToolSelected(tools['baseShape'])
		return (
			<DefaultToolbar {...props}>
				<DefaultToolbarContent />
				<TldrawUiMenuItem {...tools['baseShape']} isSelected={isStickerSelected} />
			</DefaultToolbar>
		)
	},
	KeyboardShortcutsDialog: (props) => {
		const tools = useTools()
		return (
			<DefaultKeyboardShortcutsDialog {...props}>
				<DefaultKeyboardShortcutsDialogContent />
				<TldrawUiMenuItem {...tools['baseShape']} />
			</DefaultKeyboardShortcutsDialog>
		)
	},
}

const customAssetUrls: TLUiAssetUrlOverrides = {
	icons: {
		'base-shape-icon': baseShapeIcon,
	},
}

const customTools = [BaseShapeTool]
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
	)
}
