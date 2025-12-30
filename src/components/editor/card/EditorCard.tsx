import styles from "./editorcard.module.scss";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

interface EditorCardProps {
    data: any,
    index: number,
    openEditEvent: (index: number, data: any) => void,
    removeEvent: (index: number) => void,
    loading: boolean,
    saving: boolean
}

const EditorCard = ({ data, index, openEditEvent, removeEvent, loading, saving }: EditorCardProps) => {
    return (
        <div key={data == null ? index : data.id} className={styles['editor-card']}>
            <div className={styles['editor-card__header']}>
                {
                    loading ? (
                        <>
                            <Skeleton height="1.5rem" className={styles['editor-card__title']} />
                            <Skeleton height="1.5rem" width="10%" className={styles['editor-card__date-price']} />
                        </>

                    ) : (
                        <>
                            <span className={styles['editor-card__title']}>{data.title}</span>
                            <span className={styles['editor-card__date-price']}>{data.date || data.price}</span>
                        </>
                    )
                }
            </div>
            <div className={styles['editor-card__body']}>
                {
                    loading ? (
                        <Skeleton height="1rem" width="100%" className={styles['editor-card__desc']} />
                    ) : (
                        <span className={styles['editor-card__desc']}>{data.description}</span>
                    )
                }
            </div>
            <div className={styles['editor-card__footer']}>
                {
                    loading ? (
                        <>
                            <Skeleton height="54px" width="120px" className={styles['editor-card__button']} />
                            <Skeleton height="54px" width="120px" className={styles['editor-card__button']} />
                        </>
                    ) : (
                        <>
                            <Button disabled={loading || saving} onClick={() => openEditEvent(index, data)} variant="outline" className={styles['editor-card__button']}>Edit</Button>
                            <Button disabled={loading || saving} onClick={() => removeEvent(index)} variant="delete" className={styles['editor-card__button']}>Delete</Button>
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default EditorCard;