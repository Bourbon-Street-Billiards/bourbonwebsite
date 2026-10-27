import Skeleton from "@/components/ui/Skeleton";
import styles from "@/app/panel/page.module.scss";
import EditorCard from "./card/EditorCard";

const EditorLoading = () => {
    return (
        <div className={styles['editor-content']}>
            <Skeleton width="100%" height={54} />
            <div className={styles['card-grid']}>
                {[0, 1, 2, 3, 4].map((index) => (
                    <EditorCard key={index} data={null} loading={true} index={index} openEditEvent={() => { }} removeEvent={() => { }} saving={false} />
                ))}
            </div>
        </div>
    );
}

export default EditorLoading;