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
        <div key={data == null ? index : data.id} className={styles.card}>
            <div className={styles.card__header}>
                {
                    loading ? (
                        <>
                            <Skeleton height="1.5rem" className={styles.card__title} />
                            <Skeleton height="1.5rem" width="10%" className={styles.card__datePrice} />
                        </>

                    ) : (
                        <>
                            <span className={styles.card__title}>{data.title}</span>
                            <span className={styles.card__datePrice}>{data.date || data.price}</span>
                        </>
                    )
                }
            </div>
            <div className={styles.card__body}>
                {
                    loading ? (
                        <Skeleton height="1rem" width="100%" className={styles.card__desc} />
                    ) : (
                        <span className={styles.card__desc}>{data.description}</span>
                    )
                }
            </div>
            <div className={styles.card__footer}>
                {
                    loading ? (
                        <>
                            <Skeleton height="54px" width="120px" className={styles.smallButton} />
                            <Skeleton height="54px" width="120px" className={styles.smallButton} />
                        </>
                    ) : (
                        <>
                            <Button disabled={loading || saving} onClick={() => openEditEvent(index, data)} variant="outline" className={styles.smallButton}>Edit</Button>
                            <Button disabled={loading || saving} onClick={() => removeEvent(index)} variant="delete" className={styles.smallButton}>Delete</Button>
                        </>
                    )
                }
            </div>
        </div>
    );
}

export default EditorCard;