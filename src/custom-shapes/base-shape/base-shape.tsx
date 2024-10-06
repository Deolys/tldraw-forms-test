import {
  BaseBoxShapeUtil,
  FileHelpers,
  HTMLContainer,
  RecordProps,
  stopEventPropagation,
  T,
  TLBaseShape,
} from "tldraw";
import styles from "./base-shape.module.css";

type IBaseShape = TLBaseShape<
  "base-shape",
  {
    w: number;
    h: number;
    text: string;
    image: string;
  }
>;

export class BaseShapeUtil extends BaseBoxShapeUtil<IBaseShape> {
  static override type = "base-shape" as const;
  static override props: RecordProps<IBaseShape> = {
    w: T.number,
    h: T.number,
    text: T.string,
    image: T.string,
  };

  override canEdit() {
    return true;
  }

  getDefaultProps(): IBaseShape["props"] {
    return {
      w: 200,
      h: 200,
      text: "Text",
      image: "",
    };
  }

  component(shape: IBaseShape) {
    const { w: width, h: height } = shape.props;
    const isEditing = this.editor.getEditingShapeId() === shape.id;

    return (
      <HTMLContainer
        id={shape.id}
        onPointerDown={isEditing ? stopEventPropagation : undefined}
        style={{
          pointerEvents: isEditing ? "all" : "none",
          fontSize: 20,
        }}
      >
        <div
          className={styles.wrapper}
          style={{
            width: width,
            height: height,
            backgroundImage: `url(${shape.props.image})`,
          }}
        >
          {isEditing && (
            <div>
              <label htmlFor="image-input" className={styles.imageInputLabel}>
                <img
                  width={50}
                  height={50}
                  src="https://icons.iconarchive.com/icons/dtafalonso/android-lollipop/128/Downloads-icon.png"
                  alt="download image"
                />
              </label>
              <input
                id="image-input"
                type="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file instanceof File) {
                    this.editor.updateShape({
                      id: shape.id,
                      type: shape.type,
                      props: {
                        ...shape.props,
                        image: await FileHelpers.blobToDataUrl(file),
                      },
                    });
                  }
                }}
                accept="image/*"
                style={{ display: "none" }}
              />
            </div>
          )}
          <div
            style={{ position: "absolute", top: height + 20, maxWidth: width }}
          >
            {isEditing ? (
              <input
                value={shape.props.text}
                onChange={(e) => {
                  this.editor.updateShape({
                    id: shape.id,
                    type: shape.type,
                    props: {
                      ...shape.props,
                      text: e.target.value,
                    },
                  });
                }}
              />
            ) : (
              <p className={styles.text}>{shape.props.text}</p>
            )}
          </div>
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: IBaseShape) {
    return <rect width={shape.props.w} height={shape.props.h} />;
  }
}
